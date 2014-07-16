(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.search = WILDGOOSE.search || {};

	// 의존성 주입
	var Ajax = CAGE.ajax;
	var Template = CAGE.util.template;
	var SearchMore = WILDGOOSE.more.search;
	var AutoComplement = WILDGOOSE.search.auto_complement;
	var Submit = WILDGOOSE.search.submit;
	
	var Search = {
		init: function(args) {
			// search
			var search = args.search;
			if (search !== undefined) {
				this.form = {
					box: document.querySelector(search.box),
					container: document.querySelector(search.container)
				};
				
				this.search = {
					submit: document.querySelector(search.submit),
					requestNum: search.requestNum,
					templateURL: search.templateURL,
					template: Template.get({"url":search.templateURL})
				};
				
				// initialize submit button
				Submit.init({
					box: this.form.box,
					submit: this.search.submit
				});
				
			}
			
			// initialize auto completion list
			var autocompletion = args.autocompletion;
			var autoEl = document.querySelector(args.autocompletion.list);
			if (autocompletion !== undefined && autoEl !== null) {
				AutoComplement.init({
					searchBox: this.form.box,
					list: {
						element: autoEl,
						requestNum: autocompletion.requestNum,
						interval: 100
					}
				});
			}
			
			// initialize more button
			var more = args.more;
			var moreEl = document.querySelector(more.button);
			if (more !== undefined && moreEl !== null) {
				var curNumDiv = document.querySelector(args.more.curNum);
				var totalNumDiv = document.querySelector(args.more.totalNum);
				
				var searchMore = new SearchMore({
					more: {
						button: moreEl,
						curNum: (curNumDiv !== undefined)? parseInt(curNumDiv.innerText) : 0,
						totalNum: (totalNumDiv !== undefined)? parseInt(totalNumDiv.innerText) : 0
					},
					container: this.form.container,
					template: this.search.template,
					keyword: this.form.box.value,
					requestNum: this.search.requestNum
				});
			}
			
			// box focus status
			this.form.box.focus();
		}
	};
	
	// 공개 메서드 노출
	WILDGOOSE.search = {
		init: Search.init
	}
})();
