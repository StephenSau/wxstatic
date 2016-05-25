/*add class function, allow multi-class that separate by space*/
function addClass(element, className){
    var elementClass = element.className;
    if(elementClass === ""){
        elementClass = className;
    }else{
        var classes = className.split(/\s+/);
        for(var i = 0, length = classes.length; i < length; i++){
            if(elementClass.indexOf(classes[i]) === -1){
                elementClass += " " + classes[i];
            }
        }

    }
    element.className = elementClass;
}

function next (t, className) {
    var n = t.nextSibling;
    if (!n) {
        return undefined;
    }
    if (n.nodeType !== 1) {
        return next(n, className);
    }
    if (className && n.className.indexOf(className) === -1) {
        return next(n, className);
    }
    return n;
}

function insertAfter(newChild,target){
    var oParent = target.parentNode;
    if(oParent.lastChild === target){
        oParent.appendChild(newChild);
    }else{
        oParent.insertBefore(newChild,next(target));
    }
}

/*remove class function, allow multi-class that separate by space*/
function removeClass(element, className){
    var elementClass = element.className;
    if(elementClass === ""){
        return;
    }else{
        var classes = className.split(/\s+/);
        for(var i = 0, length = classes.length; i < length; i++){
            elementClass = elementClass.replace(classes[i], "");
        }
        elementClass = elementClass.replace(/\s{2,}/g, " ");
        elementClass.trim();
        element.className = elementClass;
    }
}

function FormVerified(form, callback){
    var that = this;
    this.form  = form;
    this.callback = callback;
    //this.loadingBox = null;
    this.checkArea = this.findCheckArea();
    /*if(!document.getElementById("loadingBox")){
        this.initLoading();
    }else{
        this.loadingBox = document.getElementById("loadingBox");
        addClass(this.loadingBox, "dn");
    }*/
    this.showErrorMessage = function(info){
        /*var error = document.getElementById('formErrorMessage');
        removeClass(error, "dn");
        findText(error.firstChild).textContent = info;var error = document.getElementById('formErrorMessage');
        removeClass(error, "dn");
        findText(error.firstChild).textContent = info;*/
    };

    this.checkLength = function(value, length, notRequire){
        if (this.checkDirty(value, notRequire)) {
                return this.messageInfo.dirty;
            } else if (!value) {
                return "";
            }
        if(value.length !== length * 1){
            if(notRequire !== undefined && notRequire !== "true"){
                return notRequire;
            }
            return this.messageInfo.lengthError + length + "个字符";
        }
        return "";
    };

    this.checkName = function(value, notRequire){
        if (this.checkDirty(value, notRequire)) {
                return this.messageInfo.dirty;
            } else if (!value) {
                return "";
            }
        if(!/[\u4E00-\u9FBF]{2,8}/.test(value)){
            return this.messageInfo.nameError;
        }
        return "";
    };

    this.checkPhone = function(value, notRequire){
        if (this.checkDirty(value, notRequire)) {
                return this.messageInfo.dirty;
            } else if (!value) {
                return "";
            }
        if(!/^1\d{10}$/.test(value)){
            return this.messageInfo.phoneError;
        }
        return "";
    };

    this.checkCode = function(value, notRequire){
        if (this.checkDirty(value, notRequire)) {
                return this.messageInfo.dirty;
            } else if (!value) {
                return "";
            }
        if(!/\d{6}/.test(value)){
            return this.messageInfo.codeError;
        }
        return "";
    };

    this.checkId = function(value, notRequire){
        if (this.checkDirty(value, notRequire)) {
                return this.messageInfo.dirty;
            } else if (!value) {
                return "";
            }
        if(!/^(\d{6})(18|19|20)?(\d{2})([01]\d)([0123]\d)(\d{3})(\d|X)?$/.test(value)){
            return this.messageInfo.idError;
        }else{
            var length = value.length;
            if(length === 18){
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var total = 0;
                for(var i = 0; i < 17; i++){
                    total += parseInt(value.substr(i, 1),10) * arrInt[i];
                }
                if(value.substr(17, 1) !== arrCh[total % 11]){
                    return this.messageInfo.idError;
                }
            }
        }
        return "";
    };

    this.checkMoney = function(value, notRequire){
        if (this.checkDirty(value, notRequire)) {
                return this.messageInfo.dirty;
            } else if (!value) {
                return "";
            }
        var reg =  /(^[1-9]\d*(\.\d{1,2})?$)|(^0\.\d{1,2}$)/;
        if(!reg.test(value)){
            return this.messageInfo.moneyError;
        }
        return "";
    };

    this.checkNumber = function(value, length, notRequire){
        if (this.checkDirty(value, notRequire)) {
                return this.messageInfo.dirty;
            } else if (!value) {
                return "";
            }
        var reg = new RegExp("^\d{0," + length + "}$");
        if(!reg.test(value)){
            return this.messageInfo.numberError;
        }
        return "";
    };

    this.checkDate = function(value, format, notRequire){
        if (this.checkDirty(value, notRequire)) {
                return this.messageInfo.dirty;
            } else if (!value) {
                return "";
            }
        var reg = /^[12]\d{3}-(1[0-2]|0[1-9])-([0][1-9]|[12]\d|3[0-1])$/;
        if(format && format !== "true"){
            var regStr = format.replace(/(yy|yyyy|MM|dd|hh|mm|ss)/, function(match, pos, originalText){
                switch(match){
                    case "yy":
                        return "\d{2}";
                    case "yyyy":
                        return "[12]\d{3}";
                    case "MM":
                        return "(1[0-2]|0\d)";
                    case "dd":
                        return "(3[0-1]|[0-2]\d)";
                    case "hh":
                        return "(2[0-4]|[0-1]\d)";
                    case "mm":
                        return "[0-5]\d";
                    case "ss":
                        return "[0-5]\d";
                }
            });
            reg = new RegExp("^" + regStr + "$");
        }
        if(!reg.test(value)){
            return this.messageInfo.dateError;
        }
        return "";
    };

    this.checkEmail = function(value, notRequire){
        if (this.checkDirty(value, notRequire)) {
                return this.messageInfo.dirty;
            } else if (!value) {
                return "";
            }
        if(!/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value)){
            return this.messageInfo.emailError;
        }
        return "";
    };

    this.checkEmpty = function(value, errorMessage){
        if(value === ""){
            return errorMessage ? errorMessage : this.messageInfo.emptyError;
        }
        return "";
    };

    this.checkLicensePlateNo = function(value, length){
        var regs = {
                "7": /^[\u4E00-\u9FBF][A-Za-z][A-Za-z0-9]{4}[A-Za-z0-9港澳挂]$/,
                "6": /^[A-Za-z][A-Za-z0-9]{4}[A-Za-z0-9港澳挂]$/,
                "5": /^[A-Za-z0-9]{4}[A-Za-z0-9港澳挂]$/
            },
            reg = regs[length],
            maxLength = length === "5" ? 2 : 3,
            result = false;
        if(!reg.test(value)){
            result = false;
        }else{
            if(!value.match(/[A-Za-z]/g) || value.match(/[A-Za-z]/g).length <= maxLength){
                result = true;
            }
        }
        return  result ? "" : this.messageInfo.licensePlateNoError;
    };

    this.form.addEventListener('submit', function (event) {
        that.formSubmit(event);
    }, false);
}

FormVerified.prototype = {

    messageInfo:{
        dirty: "此为必填项",
        licensePlateNoError: "请输入正确的车牌号码",
        lengthError: "输入信息不满",
        moneyError: "请输入价钱",
        numberError: "请输入数值",
        emptyError: "请填写或选择",
        nameError: "请填写2~8个中文名",
        phoneError: "请填写正确的手机号码",
        idError:"请填写正确的身份证",
        codeError: "请填写正确邮寄编码",
        dateError: "请输入正确的日期",
        emailError: "请填写正确的电子邮箱"
    },

    initLoading: function(){
        this.loadingBox = document.createElement("div");
        this.loadingBox.id = "loadingBox";
        this.loadingBox.className = "loadingBox";
        var img = new Image();
        img.src = "../images/loading.gif";
        img.style.width = "50px";
        img.style.height = "50px";
        this.loadingBox.appendChild(img);
        var text = document.createElement("p");
        text.style.fontSize = ".875em";
        text.style.color = "#ffffff";
        text.appendChild(document.createTextNode(this.text));
        this.loadingBox.appendChild(text);
        document.body.appendChild(this.loadingBox);
        var boxWidth = getStyle(this.loadingBox, "width");
        var boxHeight = getStyle(this.loadingBox, "height");
        this.loadingBox.style.marginTop = -(parseInt(boxHeight)/2 + 33) + "px";
        this.loadingBox.style.marginLeft = -(parseInt(boxWidth)/2 + 40) + "px";
        addClass(this.loadingBox, "dn");
     },



    formSubmit: function(event){
         //this.loadingBox.className = "";

            if(!this.checkValidity()){
                //this.loadingBox.className = "dn";
                event.preventDefault();
            }else{
                if(this.callback && typeof this.callback === "function") {
                    event.preventDefault();
                    this.callback();
                }
            }
    },

    findCheckArea: function(){
        var elements = this.form.elements,
            result = [];
        for(var i = 0, length = elements.length; i < length; i++){
            if(elements[i].getAttribute('data-rule')){
                result.push(elements[i]);
            }
        }
        return result;
    },

    checkDirty: function (value, notRequire) {
        var isRequire = notRequire === "true" ? false : true;
        if (!isRequire) {
            return false;
        } else if (isRequire && value === ""){
            return true;
        }
    },

    checkValidity: function(){
        var i = 0,
            length = this.checkArea.length,
            area = null,
            result = "",
            canPass = true;
        for(i = 0; i < length; i++){
            area = this.checkArea[i];
            var rules = [];
            var params = [];
            if(area.getAttribute('data-rule')){
                rules = area.getAttribute('data-rule').split(":");
                params = rules[1] ? params.concat(area.value.trim(), rules[1].split(",")) : [area.value.trim()];
                result = this[rules[0]].apply(this, params);
                if (result !== "") {
                    removeClass(area, 'valid');
                    addClass(area, 'invalid');
                    this.showError(area, result);
                    canPass = false;
                } else {
                    removeClass(area, 'invalid');
                    addClass(area, 'valid');
                    this.hideError(area);
                }
            }
        }
        return canPass;
    },

    showError: function (area, message) {
        var error = next(area, 'ui-warn');
        if (!error || error.className.indexOf('ui-warn') === -1) {
            error = document.createElement('span');
            error.className = "ui-warn";
            error.innerHTML = '<i>!</i>' + message;
            area.parentNode.appendChild(error);
            //insertAfter(error, area);
        } else {
            error.innerHTML = '<i>!</i>' + message;
            error.style.display = "block";
        }
    },

    hideError: function (area) {
        var error = next(area, 'ui-warn');
        if (error && error.className.indexOf('ui-warn') !== -1) {
            error.style.display = "none";
        }
    }
};
