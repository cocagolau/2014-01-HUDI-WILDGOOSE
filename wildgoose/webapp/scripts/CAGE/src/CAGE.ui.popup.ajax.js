(function(window) {
//	'use strict';
	var document = window.document;
	var console = window.console;
	var CAGE = window.CAGE || {};
	
	CAGE.ui = CAGE.ui || {};
	CAGE.ui.popup = CAGE.ui.popup || {};
	CAGE.ui.popup.ajax = CAGE.ui.popup.ajax || {};


	var Dom = CAGE.util.dom;
	var Template = CAGE.util.template;
	var Ajax = CAGE.ajax;
	var eventEmitter = CAGE.event.emitter;
	var popup = CAGE.ui.popup;
 
	// 이벤트 emitter 
	// 개별 Popup 인스턴스마다 가지고 있으며 커스텀 이벤트의 콜백등록과 삭제, 이벤트 발생시 해당 이벤트에 등록된 모든 콜백 순서대로 실행시키기를 담당한다.
	// 현재는 이벤트마다 가지고 있지만, 인스턴스마다 하나씩 가지고 여러종류의 이벤트를 다룰수 있도록 바꾸어야 한다.
	// 그럴려면 현재 popup.afteropen.add(callback); 이렇게 쓰던걸
	// popup.on.afteropen(callback); popup.off.afteropen(callback);  popup.trigger.afteropen([parmeter1, parameter2]); 
	// 이렇게 되도록 API를 변경해야 한다...
	// pupup 생성자 내에서 eventEmitter의 인스턴스멤버와, 프로토타입 상속을 하면 될것 같다.
	
	
	// POPUP을 상속받은 AJAX POPUP  
	function ajaxPopup(config){
		this.el = config.element;
		this.template = "!";	// ajaxPopup 은 템플릿을 비동기로 로딩한다.
		this.transitionEffect = (config.transitionEffect)?(config.transitionEffect):("zoom");	
		this.templateUrl = config.templateUrl; // 템플릿을 요청할 주소. 필수 옵션이다.
		this.templateLoader = (config.templateLoader)?(config.templateLoader):(
			function(response){
				return response;
			}
		);
		
		this.afteropen = new eventEmitter("afteropen");
		this.afterclose = new eventEmitter("afterclose");
		
		this.status = {
			data: false
		};
		// preload 되면 session에 어떤 randNum이 저장될 지 알 수가 없다ㅠ
		this._init();
	}	
	
	ajaxPopup.prototype = popup.prototype;	
	
	CAGE.ui.popup.ajax = ajaxPopup;

	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = CAGE;
		// browser export
	} else {
		window.CAGE = CAGE;
	}    	

}(this));
