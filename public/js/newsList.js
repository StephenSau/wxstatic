(function () {
	function NewsList (){
		this.init();
	}

	NewsList.prototype = {
		onloading: false,
		isOver: false,
		currentPage: 2,
		currentTab: "",
		init: function () {
			this.showActive();
			this.handleNav();
			//var navbar = new Navbar(document.getElementById('nav'));
			this.listenScroll();
		},

		showActive: function () {
			var nav = document.getElementById('nav'),
				lis = nav.getElementsByTagName('li'),
				active = null,
				html = "",
				i = 0,
				length = lis.length;
			for (i = 0; i < length; i += 1) {
				if (i > 0 && lis[i].className.indexOf('active') !== -1) {
					active = lis[i];
					this.currentTab = active.getElementsByTagName('a')[0].innerHTML;
					nav.removeChild(lis[i]);
					nav.insertBefore(active, nav.childNodes[2]);
				}
			}
		},

		handleNav: function () {
			var btn = document.getElementById('showall_btn'),
				box = document.getElementById('navBox'),
				img = btn.getElementsByTagName('img')[0];
			btn.addEventListener('click', function (event) {
				var status = this.getAttribute('data-status');
				if (!status || status === "hide") {
					box.style.height = "auto";
					this.setAttribute('data-status', 'show');
					img.src = "../public/img/arrow_up.png";
				} else if (status === "show") {
					box.style.height = "40px";
					this.setAttribute('data-status', 'hide');
					img.src = "../public/img/arrow_down.png";
				}
			}, false);
		},

		listenScroll: function () {
			var that = this,
				point = document.getElementById('loadingPoint');
			window.onscroll = function () {
				var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
				if (! that.isOver && !that.onloading && scrollTop + window.screen.height >= point.offsetTop + point.offsetHeight) {
					that.getNewsList();
				}
			};
		},

		getNewsList: function () {
			var that = this,
				xhr = new xhrFactory(),
				params = {
					'querycondition': this.currentTab,
					'pageNumber': this.currentPage
				};
			this.onloading = true;
			xhr.post('/info/ajaxGetList.htm', params, function (data) {
				if (data.status === "200") {
					that.pageNewsList(data.re);
				} else {

				}
			});
		},

		pageNewsList: function (data) {
			var i = 0,
				list = document.getElementById('newsList'),
				items = data.articleList,
				item = null
				length = items.length,
				html = [],
				li = null;
			if (length) {
				for (i = 0; i < length; i += 1) {
					item = items[i];
					html = [];
					li = document.createElement('li');
					if (item.pic !== "") {
						html.push('<p class="nl_photo">');
						html.push('<a href="/info/infoDetailById.htm?id=' + item.articleid + '&querycondition=' + this.currentTab + '" title="">');
						html.push('<img src="' + item.pic + '" alt="' + item.title + '" width="105" />');
						html.push('</a>');
						html.push('</p>');
					}
					html.push('<p class="nl_content">');
					html.push('<a href="/info/infoDetailById.htm?id=' + item.articleid + '&querycondition=' + this.currentTab + '" title="' + item.title + '">');
					html.push(item.title);
					html.push('</a>');
					html.push('<span>' + item.beforepresent + '</span>')
					html.push('</p>');

					li.innerHTML = html.join('');
					list.appendChild(li);
				}
				this.onloading = false;
				this.currentPage += 1;
				this.isOver = false;
			} else {
				this.isOver = true;
				document.getElementById('loadingPoint').style.display = "none";
			}
			
		}
	}

	var newslist = new NewsList();
}());