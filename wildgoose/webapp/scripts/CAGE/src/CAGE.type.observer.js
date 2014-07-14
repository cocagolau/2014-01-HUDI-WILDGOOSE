(function(window) {
	'use strict';
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var CAGE = window.CAGE || {};
	CAGE.type = CAGE.type || {};
	CAGE.type.observer = CAGE.type.observer || {};
	
	
	var Dom = CAGE.util.dom;

	function Observer(args) {
		this.interval = null;
		this.observerEl = null;
		this.targetEl = null;
		
		this.status = null;
		this.usable = false;
		
		this._observer(args);
	};
	
	Observer.prototype = {
		constructor: "Observer",
		_observer: function(args) {
			if (args !== undefined) {
				if (args.interval !== undefined) {
					this.interval = args.interval;
				}
				this.observerEl = args.observerEl;
				this.targetEl = args.targetEl;
				this.usable = (this.observerEl === null || this.targetEl === null)? false: true;
			}
		},
		activate: function() {
			if (this.usable === true && this.status === null) {
				this.status = setInterval(this._handler.bind(this), this.interval);
			}
//			if (this.usable === true) {
//				setTimeout(this._handler.bind(this));
//			}
		},
		deactivate: function() {
			clearInterval(this.status);
			this.status = null;
			/*
			 * interface
			 * do - something;
			 */
		},
		_handler: function() {
			this._trigger(this._observe());
			this.deactivate();
		},
		_trigger: function(detailObj) {
			if (detailObj.flag) {
				var observeEvt = new CustomEvent("observe", {detail: detailObj});
				this.observerEl.dispatchEvent(observeEvt);				
			}
		},
		_observe: function() {
			// interface
			return null;
		}
	};


	
	// 공개 메서드 노출
	CAGE.type.observer = Observer;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = CAGE;
		// browser export
	} else {
		window.CAGE = CAGE;
	}    	

}(this));
