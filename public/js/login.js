(function () {
	function Login (){
		this.init();
	}

	Login.prototype = {
		init: function () {
			var formVerified = new FormVerified(document.getElementById('binding'));
			formVerified.checkAccount = function (value) {
                if (!/^\S{4,20}$/.test(value)) {
                    return "请正确填写您的壹财税用户名";
                }
                return "";
            };
            
            formVerified.checkPassword = function (value) {
                if (!/^\S{6,20}$/.test(value)){
                    return "请正确填写您的壹财税密码";
                }
                
                return ""; 
            };
		}
	};

	var login = new Login();
}());