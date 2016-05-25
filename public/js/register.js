(function () {
	function Register() {
        this.onCountDown = false;
		this.dialog = new Dialog({
			content: "测试"
		});
		this.init();
	}

	Register.prototype = {
		init: function () {
			var that = this,
				formVerified = new FormVerified(document.getElementById("register"), undefined, true);
            formVerified.checkAccount = function (value, notRequire) {
                if (this.checkDirty(value, notRequire)) {
                    return this.messageInfo.dirty;
                } else if (!value) {
                    return "";
                }
                if (!/^[A-Za-z0-9\-\_]{4,20}$/.test(value)) {
                    return "请输入4-20位字母、数字或“-”、“_”字符";
                }
                return "";
            };
            formVerified.checkTelphone = function (value, notRequire) {
            	if (this.checkDirty(value, notRequire)) {
	                return this.messageInfo.dirty;
	            } else if (!value) {
	                return "";
	            }
	            if (!/^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/.test(value)) {
	                return this.messageInfo.phoneError;
	            }
	            return "";
	        };
            document.getElementById('getPhoneCodeBtn').addEventListener('click', function () {
            	if (!/^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{8}$/.test(document.getElementById('telphone').value)){
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
            xhr.post('/user/checkValidateCode4Img.htm', params, function (data) {
				if (data.status === "200"){
					mask.style.display = "none";
					codeBox.style.display = "none";
					code.removeAttribute('style');
                    that.getPhoneCode(document.getElementById('imgCodeText').value);
                    that.startCountDown();
                } else {
                    code.style.borderColor = "#db281f";
                }
			});
        },

        registerPass: function () {
            var that = this,
            	xhr = new xhrFactory(),
                params = {
                    password: document.getElementById('password').value,
                    mobile: document.getElementById('telphone').value,
                    validatecode: document.getElementById('phonecode').value
                };
            xhr.post('/user/registuser.htm', params, function (data) {
				if (data.status === "200") {
                        
                    } else {
                        dialog.show({
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
			xhr.post('/user/sendValidateCode.htm', params, function (data) {
				if (data.status === "200"){
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
        }
	};

	var register = new Register();
}());