function Navbar (obj) {
	this.obj = obj;
	this.leftPoint = 0;
	this.rightPoint = 0;
	this.startTouchX = 0;
	this.startX = 0;
	this.X = 0;
	this.outerWidth = 0;
	this.innerWidth = 0;
	this.left = null;
	this.right = null;
	this.init();
}



Navbar.prototype = {
	init: function () {
		this.packageBar();
		
	},

	packageBar: function () {
		var temp = null;
		this.outer = document.createElement('div');
		this.outer.className = "nav-outer";
		this.obj.parentNode.insertBefore(this.outer, this.obj);
		temp = this.obj;
		this.outer.appendChild(this.obj);
		this.left = document.createElement('div');
		this.left.className = "nav-left";
		temp = document.createElement('img');
		temp.src = "../public/img/arrow_left.png";
		this.left.appendChild(temp);
		this.right = document.createElement('div');
		this.right.className = "nav-right";
		temp = document.createElement('img');
		temp.src = "../public/img/arrow_right.png";
		this.right.appendChild(temp);
		this.obj.parentNode.insertBefore(this.left, this.obj);
		this.obj.parentNode.appendChild(this.right);
		this.showActive();
		this.resetInnerWidth();
	},

	listener: function () {
		var that = this;
		this.obj.addEventListener('touchstart', function (event) {
			that.tStart(event);
		}, false);
		this.obj.addEventListener('touchmove', function (event) {
			that.tMove(event);	
		}, false);
		this.obj.addEventListener('touchend', function (event) {
			that.tEnd(event);	
		}, false);
	},

	tStart: function (event) {
		this.obj.style.transition = "none";
		this.startTouchX = event.changedTouches[0].pageX;
		this.startX = this.X;

	},

	tMove: function (event) {
		var d = event.changedTouches[0].pageX - this.startTouchX;
		this.X = this.startX + d;
		if (this.X >= this.rightPoint) {
			this.right.style.opacity = "0.8";
			this.right.style.zIndex = "20";
		}

		if (this.X <= this.leftPoint) {
			this.left.style.opacity = "0.8";
			this.left.style.zIndex = "20";
		}
		if (this.X > this.leftPoint) {
			this.left.removeAttribute('style');
		}

		if (this.X < this.rightPoint) {
			this.right.removeAttribute('style');
		}
		this.obj.style.WebKitTransform = this.obj.style.transform = "translateX(" + this.X + "px)";
		//this.obj.style.marginLeft = this.X + "px";
	},

	tEnd: function (event) {
		this.right.removeAttribute('style');
		this.left.removeAttribute('style');
		this.returnBack();
	},

	returnBack: function () {
		if (this.X < this.rightPoint) {
			this.obj.style.transition = "0.5s";
			this.obj.style.WebKitTransform = this.obj.style.transform = "translateX(" + this.rightPoint + "px)";
			//this.obj.style.marginLeft = this.rightPoint + "px";
			this.X = this.rightPoint;
		}

		if (this.X > this.leftPoint) {
			this.obj.style.transition = "0.5s";
			this.obj.style.WebKitTransform = this.obj.style.transform = "translateX(" + this.leftPoint + "px)";
			//this.obj.style.marginLeft = this.leftPoint + "px";
			this.X = this.leftPoint;
		}
	},

	showActive: function () {
		var lis = this.obj.getElementsByTagName('li'),
			active = null,
			html = "",
			i = 0,
			length = lis.length;
		for (i = 0; i < length; i += 1) {
			if (i > 0 && lis[i].className.indexOf('active') !== -1) {
				active = lis[i];
				this.currentTab = active.getElementsByTagName('a')[0].innerHTML;
				this.obj.removeChild(lis[i]);
				this.obj.insertBefore(active, this.obj.childNodes[2]);
			}
		}
	},

	resetInnerWidth: function () {
		var width = 0,
			lis = this.obj.getElementsByTagName('li'),
			i = 0,
			length = lis.length;
		for (i = 0; i < length; i += 1) {
			width += lis[i].offsetWidth;
		}
		this.innerWidth = width;
		if (width > this.outer.offsetWidth) {
			this.rightPoint = this.outer.offsetWidth - width;
			this.listener();
		}
		this.obj.style.width = this.innerWidth + "px";
	}
};