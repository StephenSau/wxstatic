
function SmartText(obj, type) {
    this.element = obj;
    this.type = type;
    this.init();
}

SmartText.prototype = {
    init: function () {
        this.element.data = "";
        this.listener();
    },
    listener: function () {
    	var that = this;
    	this.element.addEventListener('keyup', function (event) {
    		if (event.keyCode === 8 || that[that.type](event)) {
                that.element.data = that.element.value;
    		} else {
    			that.element.value = that.element.data;
    		}
    	}, false);
    },
    currency: function () {
        var reg = "",
            value = this.element.value,
            digit = this.element.getAttribute('maxlength');
        function sqrt(n, x) {
            if (x === 1) {
                return n
            } else {
                return n * sqrt(n, x - 1);
            }  
        }
        if (digit) {
            reg = new RegExp("^\\d{0," + digit + "}(\\.\\d{0,2})?$"); 
        } else {
            reg = /^\d*(\.\d{0,2})?$/;
        }

        if (reg.test(value)) {
            if (value * 1 >= 0) {
                if (digit && parseInt(value, 10) >= sqrt(10, digit + 1)) {
                    return false;
                } else {
                   return true; 
                }
            }
        }
        return false;
    },

    email: function () {
        var value = this.element.value;
        if (value.indexOf('@') === -1) {
            return /^\w*(\.\w+)*$/.test(value);
        } else {
            return /^\w+(\.\w+)*@\w*(\.\w{0,3}){0,3}$/.test(value);
        }
    },

    telphone: function () {
        var value = this.element.value;
        switch (value.length) {
            case 0:
                return true;
            case 1:
                return value === '1';
            case 2:
                return /^1[34578]$/.test(value);
            case 3:
                return /^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])$/.test(value);
            default:
                return /^1(3[0-9]|4[0-9]|5[0-35-9]|7[0-9]|8[0-9])\d{1,8}$/.test(value);
        }
    },

    phone: function () {
        var value = this.element.value;
        if (value.indexOf('-') === -1) {
            return /^\d{0,8}$/.test(value);
        } else {
            return /^\d{0,4}-\d{0,8}$/.test(value);
        }
    },

    date: function (event) {
        var value = this.element.value;
        switch (value.length) {
            case 0:
                return true;
            case 1:
                return /^[12]$/.test(value);
            case 2:
                return /^(1\d|20)$/.test(value);
            case 3:
                return /^(1\d|20)\d$/.test(value);
            case 4:
                if (/^(1\d|20)\d{2}$/.test(value)) {
                    this.element.data = value + '-0';
                    return false;
                }
                return /^(1\d|20)\d{2}$/.test(value);
            case 5:
                return /^(1\d|20)\d{2}-$/.test(value);
            case 6:
                return /^(1\d|20)\d{2}-\d$/.test(value);
            case 7:
                if (/^(1\d|20)\d{2}-(1[0-2]|0[1-9])$/.test(value)) {
                    this.element.data = value + '-0';
                    return false;
                }
                return /^(1\d|20)\d{2}-(1[0-2]|0[1-9])$/.test(value).test(value);
            case 8:
                return /^(1\d|20)\d{2}-(1[0-2]|0[1-9])-$/.test(value);
            case 9:
                return /^(1\d|20)\d{2}-(1[0-2]|0[1-9])-[0-3]$/.test(value);
            case 10:
                return /^(1\d|20)\d{2}-(1[0-2]|0[1-9])-([0][1-9]|[12]\d|3[0-1])$/.test(value);
        }
    }

};
