(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var APP = window.APP || {};
	APP.page = APP.page || {};
	APP.page.search = APP.page.search || {};

	// 하위 모듈 import
	var Search = WILDGOOSE.search;
	var Favorite = WILDGOOSE.ui.favorite;
	var User = WILDGOOSE.user;
	
	var SearchPage = {
		init: function() {
			this._searchModule();
			this._favoriteModule();
		},
		
		_searchModule: function() {
			Search.init({
				search: {
					box: "#query-entry",
					container: ".search-result > ul",
					templateURL: "/api/v1/templates/reporterCard.html",
					requestNum: 24
				},
				autocompletion: {
					list: ".search .auto-completion-list",
					requestNum: 7
				},
				more: {
					button: ".search-more button",
					curNum: ".search-more .state-search-curNum",
					totalNum: ".search-more .state-search-totalNum"
				}
			});
		},
		
		_favoriteModule: function() {
			Favorite.init();
		}
	}
		
	APP.page.search = SearchPage;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = APP;
		// browser export
	} else {
		window.APP = APP;
	}
})(this);
