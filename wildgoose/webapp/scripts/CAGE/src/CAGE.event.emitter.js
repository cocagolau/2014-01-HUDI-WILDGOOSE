(function(window) {
//	'use strict';
	var document = window.document;
	var console = window.console;
	var CAGE = window.CAGE || {};
	
	CAGE.event = CAGE.event || {};
	CAGE.event.emitter = CAGE.event.emitter || {};


	// 이벤트 emitter 
	// 개별 Popup 인스턴스마다 가지고 있으며 커스텀 이벤트의 콜백등록과 삭제, 이벤트 발생시 해당 이벤트에 등록된 모든 콜백 순서대로 실행시키기를 담당한다.
	// 현재는 이벤트마다 가지고 있지만, 인스턴스마다 하나씩 가지고 여러종류의 이벤트를 다룰수 있도록 바꾸어야 한다.
	// 그럴려면 현재 popup.afteropen.add(callback); 이렇게 쓰던걸
	// popup.on.afteropen(callback); popup.off.afteropen(callback);  popup.trigger.afteropen([parmeter1, parameter2]); 
	// 이렇게 되도록 API를 변경해야 한다...
	// pupup 생성자 내에서 eventEmitter의 인스턴스멤버와, 프로토타입 상속을 하면 될것 같다.
	
    function eventEmitter(eventType) {
    	this.type = eventType;
	    this.eventHandlers = [];
    }
    eventEmitter.prototype.add = function(handler){
	    this.eventHandlers.push(handler);       
    };   
    eventEmitter.prototype.remove = function(handler){
    	var eventHandlers = this.eventHandlers;
    	for(var i in eventHandlers){
	    	if(eventHandlers[i] === handler){
		    	eventHandlers.splice(i, 1);
	    	}
    	}
    };   
    eventEmitter.prototype.dispatch = function(){
    	var eventHandlers = this.eventHandlers;
    	var param = undefined;
    	for(var i in eventHandlers){
    		param = (arguments[i])?arguments[i]:undefined;
	    	eventHandlers[i](param);
    	}
    };	
	
	CAGE.event.emitter = eventEmitter;

	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = CAGE;
		// browser export
	} else {
		window.CAGE = CAGE;
	}    	

}(this));
