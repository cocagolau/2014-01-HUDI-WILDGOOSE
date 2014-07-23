(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.search = WILDGOOSE.search || {};
	WILDGOOSE.search.more = WILDGOOSE.search.more || {};

	// 의존성 주입
	var Fav = WILDGOOSE.ui.favorite;
	var More = WILDGOOSE.more.super_type;
	
	function SearchMore(args) {
		More.call(this, args);
		
		this.postsuccess.add(function(conatiner){
//			Fav.updateFavs(this.metadata.curNum, this.requestNum);
//			Fav.attatchEventToFavBtn(this.metadata.curNum, this.requestNum);
			Fav.addCards(conatiner);
		});
	};
	
	SearchMore.prototype = new More();
	SearchMore.prototype.constuctor = SearchMore;
	SearchMore.prototype.getApproachEventCondition = function(evt) {
		var footer = document.querySelector(".footer");
		var viewportHeight = window.innerHeight;
		var footerHeight = parseInt(window.getComputedStyle(footer, null).height);
		var footerTopPos = footer.getBoundingClientRect().bottom - footerHeight;
		var condition = viewportHeight - 15 > footerTopPos; 
		
		return condition;
	};
	
	SearchMore.prototype.getMoldedData = function(data, templateCompiler, template) {
		var className = "card card-reporter";
		var newLi = '<li class="' + className + '">' + templateCompiler(data, template) + '</li>';
		
		return newLi;
	};
	
	SearchMore.prototype.getURL = function() {
		return "/api/v1/search?q=" + this.metadata.keyword + "&start_item=" + this.metadata.curNum + "&how_many=" + this.requestNum;
	};
	
	SearchMore.prototype.success = function(responseObj) {
		return responseObj.data.reporters;
	};
	
	// 공개 메서드 노출
	WILDGOOSE.more.search = SearchMore;
})();
