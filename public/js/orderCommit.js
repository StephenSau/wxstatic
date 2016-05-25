(function () {
    'use strict';
	function OrderCommit() {
        this.confire = false;
        this.dialog = new Dialog({
            content: "初始化"
        });
        this.onCountDown = false;
		this.init();
	}

	OrderCommit.prototype = {
		init: function () {
            var that = this,
                formVerified = new FormVerified(document.getElementById('orderCommit'), function () {
                    that.checkPhone();
                }, true);
			formVerified.checkNickname = function (value) {
                if (!/[\u4E00-\u9FBFA-Za-z]{2,20}/.test(value)) {
                    return "请正确填写您的称呼";
                }
                return "";
            };

            formVerified.checkPhone = function (value) {
                if (!/^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/.test(value)) {
                    return "请正确填写11位手机号码";
                }
                return "";
            };

            formVerified.checkCode = function (value) {
                if (!/^\d{4}$/.test(value)) {
                    return "请填写4位验证码";
                }
                return "";
            };
            this.fillSelect();
            this.listener();
		},

        fillSelect: function () {
            var city = document.getElementById('city'),
                district = document.getElementById('district');
            addrsCtrl.addressSelectAction({
                selectObj: city,
                value: "440000",
                isCity: true
            });

            city.addEventListener('change', function (event) {
                addrsCtrl.addressSelectAction({
                    selectObj: district,
                    value: this.value,
                    isCity: false
                });
            }, false);

            addrsCtrl.addressSelectAction({
                selectObj: district,
                value: "440100",
                isCity: false
            });
        },

        listener: function () {
            var that = this;
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
                form = document.getElementById("orderCommit"),
                params = {
                    'serviceid': form.serviceid.value,
                    'srid': form.srid.value,
                    'contacts': form.name.value,
                    'phone': form.phone.value,
                    'city': form.city.value,
                    'district': form.district.value,
                    'confire': this.confire,
                    'validateCode': form.code.value
                };
                if (form.needAgency && form.needAgency.checked) {
                   params.needAgency = "on";
                }
            
            this.dialog.show({
                content: "处理中，请稍后"
            });

            xhr.post('/order/createOrder.htm', params, function (data) {
                that.dialog.close();
                if (data.status === "200") {
                    window.location.href = "/order/successjsp.htm?orderno=" + data.re.orderno + "&username=" + data.re.username + (data.re.password ? ("&password=" + data.re.password) : "");
                } else {
                    that.dialog.show({
                        content: data.errormsg
                    });
                }
            });
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

	var orderCommit = new OrderCommit();
}());