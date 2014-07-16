(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.search = WILDGOOSE.search || {};
	WILDGOOSE.search.article = WILDGOOSE.search.article || {};

	// 의존성 주입
	var More = WILDGOOSE.more.super_type;
	var User = WILDGOOSE.user;
	
	function ArticleMore(args) {
		More.call(this, args);
	};
	
	ArticleMore.prototype = new More();
	ArticleMore.prototype.constuctor = ArticleMore;
	ArticleMore.prototype.getApproachEventCondition = function(evt) {
		var footer = document.querySelector(".footer");
		var viewportHeight = window.innerHeight;
		var footerHeight = parseInt(window.getComputedStyle(footer, null).height);
		var footerTopPos = footer.getBoundingClientRect().bottom - footerHeight;
		
		/*
		 *  mobile 상태 확인하여 scrolling 조건 변경
		 *  아래처럼 조건을 바꾸는 이유는 모바일에서 성능문제때문.
		 */
		var condition = (User.isMobile() == true)? viewportHeight > footerTopPos - 100 : viewportHeight > footerTopPos; 
		
		return condition;
	};
	
	ArticleMore.prototype.getMoldedData = function(data, templateCompiler, template) {
		var datetime = data.datetime;
		data.datetime = datetime.substring(0, datetime.length-11);
		var className = "card card-reporter";	
		var newLi = '<li class="' + className + '">' + templateCompiler(data, template) + '</li>';
		
		return newLi;
	};
	
	ArticleMore.prototype.getURL = function() {
		var userId = User.getId();
		var uri = "/api/v1/me/" + userId + "/timeline?start_item=" + this.metadata.curNum + "&how_many=" + this.requestNum;
		console.log(uri);
		return uri;
	};
	
	ArticleMore.prototype.success = function(responseObj) {
		return responseObj.data.articles;
	};
	
	// 공개 메서드 노출
	WILDGOOSE.more.article = ArticleMore;
})();
