(function () {
	'use strict';

	function Topic() {
		this.onCountDown = false;
		this.hasPost = false;
		this.confire = false;
		this.dialog = new Dialog({
			content: "初始化"
		});
		this.init();
	}

	Topic.prototype = {
		init: function () { 
			this.listener();
		},

		listener: function () {
			var that = this,
				form = document.getElementById("form"),
				service01 = document.getElementById('service01'),
				service02 = document.getElementById('service02');
			service01.addEventListener('change', function () {
				if (!this.checked) {
					return;
				}
				service02.checked = !this.checked;
			}, false);

			service02.addEventListener('change', function () {
				if (!this.checked) {
					return;
				}
				service01.checked = !this.checked;
			}, false);

			form.addEventListener('submit', function (event) {
				event.preventDefault();
				if (that.hasPost) {
					that.dialog.show({
						content: "出问题了，请重新扫描二维码购买"
					});
					return;
				}
				if (that.checkForm()) {
					that.dialog.show({
						content: that.checkForm()
					});
					return;
				}
				that.checkPhone();
			}, false);
			document.getElementById('getPhoneCodeBtn').addEventListener('click', function () {
                if (!/^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/.test(document.getElementById('telphone').value)) {
                    that.dialog.show({
                        content: "请输入正确的手机号码"
                    });
                    return;
                }
                if (!that.onCountDown) {
                    that.getPhoneCode();
                }
            }, false);

            document.getElementById('imgBtn').addEventListener('click', function () {
                that.changeImageCode();
            }, false);

            document.getElementById('checkImgCodeBtn').addEventListener('click', function () {
                that.checkImageCode();
            }, false);
		},

		checkForm: function () {
			var form = document.getElementById("form"),
				message = "";
			if (!(form.service[0].checked ||
				form.service[1].checked ||
				form.service[2].checked)) {
				return "请选择服务";
			}

			if (!form.district.value) {
				return "请选择店铺所在地区";
			}

			if (!/^[\u4E00-\u9FBFA-Za-z]{2,20}$/.test(form.contactor.value)) {
				return "请填写2-20中英文字符作为联系人";
			}

			if (!/^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/.test(form.telphone.value)) {
				return "请填写11位手机号码";
			}

			if (!/^\d{4}$/.test(form.code.value)) {
				return "请输入4位验证码";
			}
			return;
		},

		getPhoneCode: function (validateCode) {
            var that = this,
                xhr = new xhrFactory(),
                params = {
                    phoneNo: document.getElementById('telphone').value
                };
            if (validateCode) {
                params.validateCodeImg = validateCode;
            }
			xhr.post('/order/sendValidateCode.htm', params, function (data) {
				if (data.status === "200") {
                    that.startCountDown();
                } else if (data.status === "-100") {
                    if (data.errorcode === "2084") {
                        that.packageImageCode();
                    } else {
                        that.dialog.show({
                            content: data.errormsg
                        });
                    }
                }
			});
        },

        onBridgeReady: function (data, orderNo, serviceName) {
            var that = this;
            WeixinJSBridge.invoke(
		        'getBrandWCPayRequest', data,
		        function (res) {
		            if (res.err_msg === "get_brand_wcpay_request:ok") {
                        window.location.href = "/canyin/result.htm" +
                            "?ordernos=" + orderNo +
                            "&sdnames=" + serviceName;
		            } else if (res.err_msg === "get_brand_wcpay_request:cancel" ||
                               res.err_msg === "get_brand_wcpay_request:fail") {
                        that.hasPost = false;
		            }
		       });
        },

        checkPhone: function () {
        	var that = this,
        		xhr = new xhrFactory(),
        		phoneVal = document.getElementById('telphone').value,
        		params = {
        			'telephone': phoneVal,
                    'validateCode': document.getElementById('code').value
        		};
        	xhr.post('/canyin/checkUnionAndMobile.htm', params, function (data) {
        		if (data.status === "200") {
					if (data.re.confire) {
						that.dialog.show({
							content: "您所填写的手机号码，与账号此前绑定的手机号码不一致。<br/><br/>要将账号绑定的手机号码更改为 " + phoneVal + " 吗？<br/><br/>如有任何疑问，请咨询壹财税客服 4008-310-866",
							buttons: [{
								name: "确定修改",
								callBack: function () {
									that.confire = true;
									that.dialog.close();
									that.formPost();
								}
							},{
								name: "保持不变",
								callBack: function () {
									that.dialog.close();
									that.formPost();
								}
							}]
						});
					} else {
						that.formPost();
					}
				} else {
					that.dialog.show({
						content: data.errormsg
					});
				}
        	});
        },

        formPost: function () {
            var that = this,
                xhr = new xhrFactory(),
                form = document.getElementById("form"),
				i = 0,
				services = [],
				length = form.service.length,
				params = {
					'service': "",
					'canyinId': form.canyinId.value,
					'contactor': form.contactor.value,
					'district': form.district.value,
					'telphone': form.telphone.value,
					'confire': this.confire,
					'validateCode': form.code.value
				};
			for (i = 0; i < length; i += 1) {
				if (form.service[i].checked) {
					services.push(form.service[i].value);
				}
			}
			params.service = services.join(',');
			this.dialog.show({
				content: "处理中，请稍后"
			});
			this.hasPost = true;
			xhr.post('/canyin/buyAjax.htm', params, function (data) {
				that.dialog.close();
				if (data.status === "200") {
					that.onBridgeReady({
						"appId": data.appxId,
				        "timeStamp": data.timeStamp,
				        "nonceStr": data.nonceStr,
				        "package": data.package,
				        "signType": data.signType,
				        "paySign": data.paySign
					}, data.listOrderNoAmount, data.serviceName);
				} else {
					that.dialog.show({
						content: "出问题了，请重新扫描二维码购买"
					});
				}
			});
        },

        packageImageCode: function () {
			var that = this,
				mask = document.getElementById('mask'),
				codeBox = document.getElementById('ui_codeBox');
			if (!mask) {
				mask = document.createElement('div');
				mask.id = "mask";
				mask.className = "mask";
				mask.style.height = window.innerHeight + "px";
				document.body.appendChild(mask);
			}
			mask.style.display = "block";
			codeBox.style.display = "block";
			that.changeImageCode();
		},

		startCountDown: function () {
            var that = this,
                btn = document.getElementById('getPhoneCodeBtn'),
                i = 60,
                countDown = function () {
                    i -= 1;
                    if (i <= 0) {
                        that.onCountDown = false;
                        btn.innerHTML = '获取验证码';
                    } else {
                        btn.innerHTML =  i + '秒后可重新获取';
                        setTimeout(countDown, 1000);
                    }
                };
            this.onCountDown = true;
            countDown();
        },

        changeImageCode: function () {
            document.getElementById('imgBtn').setAttribute('src', "/vc.htm?time=" + new Date().getTime());
        },
        
        checkImageCode: function () {
            var that = this,
                xhr = new xhrFactory(),
                code = document.getElementById('imgCodeText'),
                params = {
                    validateCode: code.value
                },
                mask = document.getElementById('mask'),
				codeBox = document.getElementById('ui_codeBox');
			if (code.value.length !== 4) {
				code.style.borderColor = "#db281f";
				return;
			}
            xhr.post('/order/checkValidateCode4Img.htm', params, function (data) {
				if (data.status === "200") {
					mask.style.display = "none";
					codeBox.style.display = "none";
					code.removeAttribute('style');
                    that.getPhoneCode(document.getElementById('imgCodeText').value);
                    that.startCountDown();
                } else {
                    code.style.borderColor = "#db281f";
                }
			});
        }
	};

	var topic = new Topic();
}());