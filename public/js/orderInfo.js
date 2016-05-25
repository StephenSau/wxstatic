(function () {
	'use strict';
	function previous (t) {
		var n = t.previousSibling;
		if (!n) {
	        return undefined;
	    }
	    if(n.nodeType !== 1){
	        return previous(n);
	    }
	    return n;
	}

	function next (t) {
		var n = t.nextSibling;
		if (!n) {
	        return undefined;
	    }
		if (n.nodeType !== 1) {
			return next(n);
		}
		return n;
	}

	function child (t){
		var n = t.firstChild;
		if (!n) {
	        return undefined;
	    }
		if (n.nodeType !== 1){
			return next(n);
		}
		return n;
	}



	function OrderInfo (){
		this.init();
	}

	OrderInfo.prototype = {
		dialog: new Dialog({content: "测试"}),
		init: function () {
			var smartText = new SmartText(document.getElementById('total'), 'email');
			this.listener();
		},
		listener: function () {
			var that = this,
				mask = document.getElementById('mask'),
				phoneBtn = document.getElementById('oi_phoneBtn'),
				saveBtn = document.getElementById('oi_formSaveBtn'),
				serviceBox = document.getElementById('oi_serviceBox'),
				remarkShowBtn = document.getElementById('oi_remarkShowBtn'),
				remarkSaveBtn = document.getElementById('oi_remarkSaveBtn'),
				remark = document.getElementById('oi_remark'),
				remarkText = document.getElementById('oi_remark_text'),
				list = document.getElementById('oi_serviceList');
			this.initServiceBox();
			if (document.getElementById('oi_serviceBtn')) {
				document.getElementById('oi_serviceBtn').addEventListener('click', function () {
					if (!mask) {
						mask = document.createElement('div');
						mask.id = "mask";
						mask.className = "mask";
						mask.style.height = window.innerHeight + "px";
						document.body.appendChild(mask);
					}
					mask.style.display = "block";
					serviceBox.style.display = "block";
				}, false);

				document.getElementById('oisb_saveBtn').addEventListener('click', function () {
					that.packageQryConditions();
					serviceBox.style.display = "none";
					mask.style.display = "none";
				}, false);
			}
			
			remarkShowBtn.addEventListener('click', function () {
				remark.style.display = "none";
				remarkShowBtn.style.display = "none";
				remarkSaveBtn.style.display = "inline-block";
				remarkText.style.display = "inline";
			}, false);

			remarkSaveBtn.addEventListener('click', function () {
				that.saveRemark();
			}, false);

			if (list) {
				list.addEventListener('click', function (e) {
					var e = e || window,
						obj = e.target || e.srcElement;
					if (obj.className.indexOf('noActive') === -1) {
						return;
					}
					if (!previous(obj.parentNode) || child(previous(previous(obj.parentNode))).className.indexOf('active') !== -1){
						that.dialog.show({
							content: "确认完成?",
							buttons: [{
								name: "确定",
								callBack: function () {
									that.updateStepStatus(obj);
								}
							}, {
								name: "取消",
								callBack: function () {
									that.dialog.close();
								}
							}]
						});
					};
				}, false);
			}

			if (saveBtn) {
				saveBtn.addEventListener('click', function () {
					that.saveForm();
				}, false);
			}

			phoneBtn.addEventListener('click', function () {
				that.updatePhonerecord();
			}, false);
			
		},

		updatePhonerecord: function () {
			var that = this,
				xhr = new xhrFactory(),
				params = {
					'id': document.getElementById('orderid').value
				};
			xhr.post('/order/recordCallInfo.htm', params, function (data) {
				if (data.status === "200") {
					
				} else {

				}
			});	
		},

		updateStepStatus: function (obj) {
			var that = this,
				xhr = new xhrFactory(),
				params = {
					'id': obj.getAttribute('data-id'),
					'orderno': obj.getAttribute('data-order-no'),
					'siid': obj.getAttribute('data-siid')
				};
			
			xhr.post('/order/updateStepStatus.htm', params, function (data) {
				if (data.status === "200") {
					obj.className = "active";
					child(next(obj.parentNode)).innerHTML = data.re.orderServiceTrace.modified;
					that.dialog.close();
					if (data.re.finished === "1") {
						window.location.reload();
					}
				} else {

				}
			});
		},

		saveRemark: function() {
			var that = this,
				remarkShowBtn = document.getElementById('oi_remarkShowBtn'),
				remarkSaveBtn = document.getElementById('oi_remarkSaveBtn'),
				remark = document.getElementById('oi_remark'),
				remarkText = document.getElementById('oi_remark_text'),
				xhr = new xhrFactory(),
				params = {
					'id': document.getElementById('orderid').value,
					'remark': remarkText.value
				};
			
			xhr.post('/order/updateOrderInfo.htm', params, function (data) {
				if (data.status === "200") {
					remark.style.display = "inline";
					remarkShowBtn.style.display = "inline-block";
					remarkSaveBtn.style.display = "none";
					remarkText.style.display = "none";
					remark.innerHTML = remarkText.value;
				} else {

				}
			});	
		},

		saveForm: function () {
			var that = this,
				xhr = new xhrFactory(),
				totalVal = document.getElementById('total').value,
				statusVal = 0,
				orderstatus = document.getElementById('orderstatus').value,
				remarkText = document.getElementById('oi_remark_text'),
				params = {
					'id': document.getElementById('orderid').value,
					'price': document.getElementById('total').value
				};

				if (orderstatus === "0") {
					params.status = "1";
				} else if (orderstatus === "15") {
					params.status = "8";
				}

				if (remarkText.value !== "") {
					params.remark = remarkText.value;
				}

				if (this.qryConditions) {
					params.qryConditions = JSON.stringify(this.qryConditions);
				}
			if (totalVal === "" || /^\s+$/.test(totalVal)) {
				that.dialog.show({
						content: '请输入总价'
					});
				return;
			}
			if (!/^\d{0,6}(.\d{1,2})?$/.test(totalVal) || (/^\d{0,6}(.\d{1,2})?$/.test(totalVal) && (totalVal*1 < 0 || totalVal*1 > 100000))) {
				that.dialog.show({
						content: '金额不能大于100000.00'
					});
				return;
			}
			
			xhr.post('/order/updateOrderInfo.htm', params, function (data) {
				if (data.status === "200") {
					if (orderstatus === "0" || orderstatus === "15") {
						window.location.reload();
					}
				} else {
					that.dialog.show({
						content: data.errormsg
					});
				}
			});	
		},

		initServiceBox: function () {
			var that = this,
				mask = document.getElementById('mask'),
				serviceBox = document.getElementById('oi_serviceBox'),
				data = JSON.parse(document.getElementById('serviceitemsstr').value)[0],
				specification = data.specification,
				active = false,
				opt = [],
				i = 0,
				j = 0,
				iLength = 0,
				jLength = 0,
				title = document.getElementById('ois_title'),
				list = document.getElementById('ois_list'),
				html = [];
			title.innerHTML = "服务项：" + data.name;
			title.setAttribute('data-id', data.id);
			for (i = 0, iLength = specification.length; i < iLength; i += 1) {
				html.push('<li data-type="' + specification[i].type + '">');
				html.push('<h3>' + specification[i].name + '</h3>');
				if (specification[i].type === 1) {
					html.push('<select>');
				}
				for(j = 0, jLength = specification[i].options.length; j < jLength; j += 1) {
					opt = specification[i].options[j];
					active = false;
					if (specification[i].type === 1) {
						active = specification[i].content === opt;
						html.push('<option value="' + opt + '"' + (active ? ' selected="true"' : '') + '>' + opt + '</option>');
					} else if (specification[i].type === 2) {
						active = specification[i].content.indexOf(opt) !== -1;
						html.push('<label>');
						html.push('<input type="checkbox"' + (active ? ' checked="true"' : '') + ' value="' + opt + '"/>');
						html.push(opt);
						html.push('</label><br/>');
					}
				}
				if (specification[i].type === 1) {
					html.push('</select>');
				}
				html.push('</li>');
			}
			list.innerHTML = html.join('');
			

		},

		packageQryConditions: function () {
			var temp = {},
				tempItems = {},
				listText = document.getElementById('oi_list'),
				title = document.getElementById('ois_title'),
				list = document.getElementById('ois_list'),
				lis = list.getElementsByTagName('li'),
				i = 0,
				j = 0,
				length = lis.length,
				html = [],
				cLength  = 0,
				checkboxs = null;
			this.qryConditions = {};
			this.qryConditions.qrycondition = [];
			temp.siid = title.getAttribute('data-id');
			temp.options = [];
			for (i = 0; i < length; i += 1) {
				tempItems = {}
				tempItems.type = lis[i].getAttribute('data-type');
				tempItems.name = lis[i].getElementsByTagName('h3')[0].innerHTML;
				html.push('<li>');
				html.push(tempItems.name + "：");
				tempItems.content = "";
				if (tempItems.type === "1") {
					tempItems.content = lis[i].getElementsByTagName('select')[0].value
				} else if (tempItems.type === "2") {
					checkboxs = lis[i].getElementsByTagName('input');
					for (j = 0, cLength = checkboxs.length; j < cLength; j += 1) {
						if (checkboxs[j].checked) {
							tempItems.content += checkboxs[j].value + ",";
						}
					}
					tempItems.content = tempItems.content.substr(0, tempItems.content.length - 1);
				}
				html.push(tempItems.content);
				html.push('</li>');
				temp.options.push(tempItems);
			}
			listText.innerHTML = html.join('');
			this.qryConditions.qrycondition.push(temp);
		}
	}

	var orderInfo = new OrderInfo();
}());