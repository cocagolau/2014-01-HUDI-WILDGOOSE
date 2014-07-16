(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var APP = window.APP || {};
	APP.page = APP.page || {};
	APP.page.me = APP.page.me || {};

	// 하위 모듈 import
	var ArticleMore = WILDGOOSE.more.article;
	var Drag = WILDGOOSE.drag;
	var MeFav = WILDGOOSE.ui.favorite.me;
	var Template = CAGE.util.template;
	var User = WILDGOOSE.user;
	var Dom = CAGE.util.dom;
	var StartMe = WILDGOOSE.ui.startme;
	
	var MePage = {
		init: function() {
			this._articleMoreModule();
			this._dragModule();
			this._startMeModule();
			MeFav.init();
		},
		
		_articleMoreModule: function() {
			var moreEl = document.querySelector(".article-more button");
			var curNumDiv = document.querySelector(".article-more .state-article-curNum");
			var totalNumDiv = document.querySelector(".article-more .state-article-totalNum");
			var templateCompiler = Template.getCompiler();
			
			this.articleMore = new ArticleMore({
				more: {
					button: moreEl,
					curNum: (curNumDiv !== null)? parseInt(curNumDiv.innerText) : 0,
					totalNum: (totalNumDiv !== null)? parseInt(totalNumDiv.innerText) : 0
				},
				container: document.querySelector(".timeline-result ul"),
				template: Template.get({"url":"/api/v1/templates/articleCard.html"}),
				requestNum: 10
			});
		},
		
		_dragModule: function() {
			Drag.exe({
				body: document.querySelector('.dashboard-left ul'),
				tagName: "LI",
				movedClassName : "moving"
			});
		},
		
		_startMeModule: function() {
			var startBtn = document.querySelector(".start-me");
			if (startBtn !== null) {
				var starEls = document.getElementsByClassName("star");
				
				StartMe.init({
					button: startBtn,
					target: starEls
				});
			}				
		}
	}
		
	APP.page.me = MePage;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = APP;
		// browser export
	} else {
		window.APP = APP;
	}
})(this);
