/**
 * Created by Administrator on 2015/11/25 0025.
 *
 */
(function () {
    'use strict';

    function extend(subClass, supClass) {
        for (var attr in supClass) {
            if (supClass.hasOwnProperty(attr)) {
                subClass[attr] = supClass[attr];
            }
        }
        return subClass;
    }

    /*旋转木马*/
    function Carousel(params) {

        this.defaults = {
            oCarousel: document.querySelector(".carousel-list"),
            oUl: document.querySelector(".carousel-list ul"),
            oOl: document.querySelector(".carousel-list ol"),
            aList: document.querySelectorAll(".carousel-list ul li"),
            aItem: document.querySelectorAll(".carousel-list ol li"),
            oPrev: document.querySelector(".carousel-wrap .prev"),
            oNext: document.querySelector(".carousel-wrap .next"),
            interval : 5000
        };
        /*merge arguments*/
        this.params = params || {};
        this.defaults = extend(this.defaults,this.params);

        this.iLen = this.defaults.aList.length;
        this.iNow = 0;
        this.iX = 0;
        this.iW = this.view().w;
        this.oTimer = 0;
        this.iStartTouchX = 0;
        this.iStartX = 0;

        /*initial boostrap*/
        this.init();
    }

    Carousel.prototype = {
        constructor: Carousel,
        init: function () {
            var that = this;
            this.defaults.oOl.style.width = this.defaults.oUl.style.width = this.iLen * 100 + '%';
            for (var i = 0; i < this.iLen; i++) {
                this.defaults.aItem[i].style.width = this.defaults.aList[i].style.width = 1 / this.iLen * 100 + '%';
            }

            /*if only one ,not to trigger slide*/
            if (this.iLen == 1) {
                this.defaults.oPrev.style.display = this.defaults.oNext.style.display = "none";
                return;
            }

            /*绑定touch 事件*/
            /*this.defaults.oCarousel.addEventListener("touchstart", function (evt) {
                that.fnStart(evt);
            }, false);
            this.defaults.oCarousel.addEventListener("touchmove", function (evt) {
                that.fnMove(evt);
            }, false);
            this.defaults.oCarousel.addEventListener("touchend", function (evt) {
                that.fnEnd(evt);
            }, false);
            this.defaults.oPrev.addEventListener("touchstart", function (evt) {
                that.fnPrev(evt);
            }, false);*/
            this.defaults.oNext.addEventListener("touchstart", function (evt) {
                that.fnNext(evt)
            }, false);

            this.auto();
        },
        view: function () {
            return {
                w: document.documentElement.clientWidth,
                h: document.documentElement.clientHeight
            };
        },
        carouselFn: function () {
            this.iX = -this.iNow * this.iW;
            this.defaults.oOl.style.transition = this.defaults.oUl.style.transition = "0.5s";
            this.defaults.oOl.style.WebkitTransform = this.defaults.oOl.style.transform = this.defaults.oUl.style.WebkitTransform = this.defaults.oUl.style.transform = "translateX(" + this.iX + "px)";
        },
        auto: function () {
            var that = this;
            this.oTimer = setInterval(function () {
                that.iNow++;
                that.iNow = that.iNow % that.iLen;
                that.carouselFn();
            }, this.defaults.interval);
        },
        fnPrev: function () {
            clearInterval(this.oTimer);
            this.iNow--;
            if (this.iNow < 0) {
                this.iNow = 0;
            }
            this.carouselFn();
            this.auto();
        },
        fnNext: function () {
            clearInterval(this.oTimer);
            this.iNow++;
            if (this.iNow > this.iLen - 1) {
                this.iNow = this.iLen - 1;
            }
            this.carouselFn();
            this.auto();
        },
        fnStart: function (ev) {
            ev.preventDefault();
            this.defaults.oUl.style.transition = "none";
            ev = ev.changedTouches[0];
            this.iStartTouchX = ev.pageX;
            this.iStartX = this.iX;
            clearInterval(this.oTimer);
        },
        fnMove: function (ev) {
            ev.preventDefault();
            ev = ev.changedTouches[0];
            var iDis = ev.pageX - this.iStartTouchX;
            this.iX = this.iStartX + iDis;
            this.defaults.oUl.style.WebkitTransform = this.defaults.oUl.style.transform = "translateX(" + this.iX + "px)";
        },
        fnEnd: function fnEnd() {
            this.iNow = this.iX / this.iW;
            this.iNow = -Math.round(this.iNow);

            if (this.iNow < 0) {
                this.iNow = 0;
            }
            if (this.iNow > this.iLen - 1) {
                this.iNow = this.iLen - 1;
            }
            this.carouselFn();
            this.auto();
        }


    }

    /*bootstrap carousel*/
    var carousel = new Carousel();

})()