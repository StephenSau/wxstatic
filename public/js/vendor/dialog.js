/**
 * Created by admina on 14-7-22.
 *
 * dialog 对话框，显示文本内容，能给与按钮回调函数
 * ep: var dialog = new Dialog({content: "这是一个对话框"});
 * 入参是一个对象字面量，包括如下字段
 * title｛string|optional|"提示"｝对话框标题，ps：字符串类型，可选，默认值为“提示”，下同
 * content｛string|primary｝对话框内容，
 * width{number|optional|300}对话框宽度，默认是300px，但会根据屏幕宽度调整
 * modal｛boolean|optional|true｝模式，默认显示遮罩层
 * buttons｛array|optional｝指定按钮，是一个对象数组，默认为确定按钮，点击关闭对话框
 * -- name｛string|primary｝， 按钮名称
 * -- callback {function|primary}, 回调函数
 * show方法，入参是对象字面量，字段如构建对话框对象
 * ep：dialog.show({content: "成功"})；
 *
 * close方法，无入参
 * ep：dialog.close();
 */

function Dialog(params) {
    params = params || {};
    this.titleText = params.title || "提示";
    this.contentText = params.content;
    this.width = this.getWidth(params.width);
    this.modal = params.modal !== undefined ? params.modal : true;
    this.buttons = params.buttons;
    this.init();

}

Dialog.prototype = {
    cssUrl: "../style/common/dialog.css",
    mask : null,
    box: null,
    fontSize: 16,
    title: null,
    content: null,
    btnGroup: null,

    getWidth: function (width) {
        if (width) {
            return width > window.innerWidth ?  window.innerWidth - 60 : width;
        } else {
            return window.innerWidth < 360 ? window.innerWidth - 60 : 300;
        }
    },

    getHeight : function (contentText, width) {
        contentText = contentText || this.contentText;
        width = width || this.width;
        var fontSize = this.fontSize;
        var lines = Math.ceil((contentText.length * fontSize + fontSize * 2) / width);
        return 22 + fontSize * 1.125 + 10 + lines * fontSize * 1.2 + 24 + 2 + 50;

    },

    init: function () {
        if (this.modal) {
            if (!document.getElementById('mask')) {
                this.initMask();
            } else {
                this.mask = document.getElementById('mask');
                this.mask.className = "mask";
                this.mask.style.display = "none";
            }
        }
        if (!document.getElementById('ui-dialog')) {
            this.initDialog();
        } else {
            this.box = document.getElementById('ui-dialog');
            this.title = document.getElementById('ui-dialog-title');
            this.content = document.getElementById('ui-dialog-content');
            this.btnGroup = document.getElementById('ui-dialog-btnGroup');
        }

    },
    initMask: function () {
        this.mask = document.createElement("div");
        this.mask.style.height =  (window.innerHeight > document.body.clientHeight ? window.innerHeight : document.body.clientHeight) + "px";
        this.mask.style.display = "none";
        this.mask.className = "mask";
        this.mask.id = "mask";
        document.body.appendChild(this.mask);
    },

    initDialog: function () {
        this.box = document.createElement('div');
        this.box.className = "dialog";
        this.box.id = "ui-dialog";
        this.box.style.width = this.width + "px";
        this.box.style.marginLeft = -this.width / 2 + "px";
        this.box.style.marginTop = -this.getHeight() / 2 + "px";
        this.box.style.display = "none";
        this.title = document.createElement('h2');
        this.title.className = "title";
        this.title.id = "ui-title";
        this.title.appendChild(document.createTextNode(this.titleText));
        this.box.appendChild(this.title);
        this.content = document.createElement("div");
        this.content.className = "content";
        this.content.id = "ui-content";
        this.content.appendChild(document.createTextNode(this.contentText));
        this.box.appendChild(this.content);
        this.btnGroup = document.createElement("p");
        this.btnGroup.className = "btnGroup";
        this.btnGroup.id = "ui-dialog-btnGroup";
        this.box.appendChild(this.btnGroup);
        this.rebuildBtnGroup();
        document.body.appendChild(this.box);
    },

    show: function (params) {
        params = params || {};
        var modal = params.modal !== undefined ? params.modal : this.modal;
        if (modal) {
            this.mask.style.display = "block";
        }
        if (params) {
            this.rebuild(params);
        }
        this.box.style.display = "block";
    },

    rebuild: function (params) {
        var titleText = params.title || this.titleText,
            contentText = params.content || this.contentText,
            width = this.getWidth(params.width);
        if (titleText !== this.titleText) {
            this.title.innerHTML = titleText

        }
        if (contentText !== this.contentText) {
            this.content.innerHTML = contentText
            this.box.style.width = this.width + "px";
            this.box.marginLeft = -width / 2 + "px";
            this.box.marginTop = -this.getHeight(contentText, width) / 2 + "px";
        }

        this.rebuildBtnGroup(params.buttons);

    },

    rebuildBtnGroup: function (buttons) {
        buttons = buttons || this.buttons || [];
        var that = this;
        var length = buttons.length;
        this.btnGroup.innerHTML = "";
        if (!length) {
            var confirmBtn = document.createElement("button");
            confirmBtn.setAttribute("type", "button");
            confirmBtn.style.width = "100%";
            confirmBtn.appendChild(document.createTextNode("确定"));
            confirmBtn.addEventListener('click', function (event) {
                that.close();
            }, false);
            this.btnGroup.appendChild(confirmBtn);
        } else {
            for (var i = 0; i < length; i++) {
                var button = document.createElement("button");
                button.setAttribute("type", "button");
                button.style.width = 100/length + "%";
                button.appendChild(document.createTextNode(buttons[i].name));
                if(buttons[i].callBack){
                    button.addEventListener('click', buttons[i].callBack, false);
                }else{
                    button.addEventListener('click', function (event) {
                        that.close();
                    }, false);
                }
                this.btnGroup.appendChild(button);
            }
        }
    },

    close : function(){
        this.box.style.display = "none";
        if (this.modal) {
            this.mask.style.display = "none";
        }
    }
};