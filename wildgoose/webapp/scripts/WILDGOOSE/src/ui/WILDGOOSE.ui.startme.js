(function() {
	'use strict';
	var document = window.document;
	var console = window.console;

	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.ui = WILDGOOSE.ui || {};
	WILDGOOSE.ui.startme = WILDGOOSE.ui.startme || {};
	
	// 의존성 선언
	var Ajax = CAGE.ajax;
	var Dom = CAGE.util.dom;
	var User = WILDGOOSE.user;
	
	var StartMe = {
		init: function(args) {
			this.startBtn = args.button;
			this.starEls = args.target;
			this.targetArr = [];
			
			this.startBtn.addEventListener("click", this.start, false);
			
			if (this.startBtn !== null && this.starEls !== null) {
				Array.prototype.forEach.call(this.starEls, function(node) {
					node.addEventListener("click", this.check.bind(this), false);
				}.bind(this));
			}
		},
		
		check: function(evt) {
			Dom.removeClass(this.startBtn, "disable");
		},
		
		start: function(evt) {
			location.href = "/me/" + User.getId();
		}
	}

	WILDGOOSE.ui.startme = StartMe;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}	

})();
