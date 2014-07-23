(function(window) {
//	'use strict';
	var document = window.document;
	var console = window.console;
	var CAGE = window.CAGE || {};
	
	CAGE.ui = CAGE.ui || {};
	CAGE.ui.popup = CAGE.ui.popup || {};
	CAGE.ui.popup.super_type = CAGE.ui.popup.super_type || {};


	var Dom = CAGE.util.dom;
	var Template = CAGE.util.template;
	var Ajax = CAGE.ajax;
	var eventEmitter = CAGE.event.emitter;
 
	// 이벤트 emitter 
	// 개별 Popup 인스턴스마다 가지고 있으며 커스텀 이벤트의 콜백등록과 삭제, 이벤트 발생시 해당 이벤트에 등록된 모든 콜백 순서대로 실행시키기를 담당한다.
	// 현재는 이벤트마다 가지고 있지만, 인스턴스마다 하나씩 가지고 여러종류의 이벤트를 다룰수 있도록 바꾸어야 한다.
	// 그럴려면 현재 popup.afteropen.add(callback); 이렇게 쓰던걸
	// popup.on.afteropen(callback); popup.off.afteropen(callback);  popup.trigger.afteropen([parmeter1, parameter2]); 
	// 이렇게 되도록 API를 변경해야 한다...
	// pupup 생성자 내에서 eventEmitter의 인스턴스멤버와, 프로토타입 상속을 하면 될것 같다.
	
	/*
	myPopup2.open.dispatch(param1, param2, ...);   
    */
    
    function popup(config) {
		this.el = config.element;
		this.template = config.template;	
		this.transitionEffect = (config.transitionEffect)?(config.transitionEffect):("zoom");	
		this.afteropen = new eventEmitter("afteropen");
		this.afterclose = new eventEmitter("afterclose");
		
		this.status = {
			data: false
		};

		this._init();
    }
    
    popup.prototype._init = function() {
		var el = this.el;
		var afteropen = this.afteropen;
		var afterclose = this.afterclose;
		var status = this.status;
		
		var close = this.close;
		el.addEventListener("click", this.openHandler.bind(this), false);
    }
    
    popup.prototype.openHandler = function(event) {
    	if (this.template === "!") {
    		Ajax.GET({
    			url: this.templateUrl,
    			callback: (function(response){
    				this.template = this.templateLoader(response);
    				event.preventDefault();
    				event.stopPropagation();

    				this._modularizeDOM();
						
    			}).bind(this)
    		});
    	}
    	else {
    		this._modularizeDOM();
    	}
    };
    
    popup.prototype._modularizeDOM = function() {
    	this._counstructDOM();
		this._wrapAnimation();
    };
    
    popup.prototype._wrapAnimation = function() {
    	var popupWrapAnimation = document.querySelector(".popup-wrap.popup-animation");
		popupWrapAnimation.addEventListener("transitionend", this.afteropenCallbackRef.bind(this), false);
    };
    
    popup.prototype.afteropenCallbackRef = function(event){
		//console.log(event);
//    	debugger;
//		if(event.propertyName === "-webkit-transform" && this.status.data === false){	
    	if(event.propertyName === "transform" && this.status.data === false){
			
			var popupWrapAnimation = document.querySelector(".popup-wrap.popup-animation");
			popupWrapAnimation.removeEventListener("webkitTransitionEnd", this.afteropenCallbackRef.bind(this), false);    

			// 오픈 엔드 콜백 실행
			//console.log("왜 두번 실행되지?");
			this.afteropen.dispatch(document.querySelector(".popup-content"));
			this.status.data = !this.status.data;
			
			var popupContainer = document.querySelector(".popup-container");
			var popupContent = document.querySelector(".popup-content");
			
			// esc 버튼으로 팝업 닫기 
			var escClose = function(e) {
			  if (e.keyCode == 27) { 
				  close();
			  }
			};
			document.addEventListener("keyup", escClose, false);				

			popupContainer.addEventListener("click",this._closeHandler.bind(this), false);
        }
	}
    
	popup.prototype.open = function(){
		this.el.click();				
	};
	popup.prototype.close = function(){
		var popupContainer = document.querySelector(".popup-container");
		popupContainer.click();
	};
	
	popup.prototype._closeHandler = function(evt) {
		var args ={
			popupContainer: document.querySelector(".popup-container"),
			popupContent: document.querySelector(".popup-content"),
			popupBg: document.querySelector(".popup-bg"),
			popupWrap: document.querySelector(".popup-wrap")
		};
		
		if(evt.target === args.popupContainer || evt.target === args.popupContent) {
			this._closePopup(args);
		}
	};
	
	popup.prototype._closePopup = function(args) {
		var popupBg = args.popupBg;			
		var popupWrap = args.popupWrap;
		
		// 역 애니메이션 걸기
		Dom.removeClass(popupBg, "popup-ready");
		Dom.removeClass(popupWrap, "popup-ready");		

        popupBg.addEventListener("transitionend", this._closePopupTransitionend.bind(this, event, args), false);
	}
	
	
	popup.prototype._closePopupTransitionend = function(event, args) {
		var popupContainer = args.popupContainer;
		var popupContent = args.popupContent;
		var popupBg = args.popupBg;			
		var popupWrap = args.popupWrap;

//		뭔지 모르겠어염 ㅠ
//		if(event.propertyName === "opacity" && this.status.data === true){
		if(this.status.data === true){
			this.afterclose.dispatch(popupContent);
			this.status.data = !this.status.data;

	        popupBg?document.body.removeChild(popupBg):undefined;
	        popupWrap?document.body.removeChild(popupWrap):undefined;					        
		}
	};
	
    popup.prototype._getTemplate = function() {
	    return this.template;
    }
	popup.prototype._counstructDOM = function(){
		var transitionEffect = this.transitionEffect;
		var tempDiv = document.createElement("div");
		var popupBg = tempDiv.cloneNode(false);
		var popupWrap = tempDiv.cloneNode(false);
		var popupContainer = tempDiv.cloneNode(false);
		var popupContent = tempDiv.cloneNode(false);
		
		Dom.addClass(popupBg, "popup-bg");
		Dom.addClass(popupBg, "popup-animation");

		Dom.addClass(popupWrap, "popup-wrap");
		Dom.addClass(popupWrap, "popup-animation");
	
		Dom.addClass(popupContainer, "popup-container");
		Dom.addClass(popupContent, "popup-content");

		popupContent.innerHTML = this._getTemplate();	
		popupContainer.appendChild(popupContent);
		
		if(transitionEffect != undefined) {
			Dom.addClass(popupContent, transitionEffect + "-animation-dialog");
		}
		
		popupWrap.appendChild(popupContainer);			

		document.body.insertAdjacentHTML("afterbegin", popupBg.outerHTML + popupWrap.outerHTML);			
		
		//data-role : close 인 엘리먼트에 팝업 닫기 리스너 연결해 줌 
		var closeBtn = document.querySelector(".popup-wrap button[data-role='close']");
		if(closeBtn) {
			closeBtn.addEventListener("click", this.closePopup, false);
		}	
		
		var popupWrapAnimation = document.querySelector(".popup-wrap.popup-animation");
		var popupBgAnimation = document.querySelector(".popup-bg.popup-animation");

		// 크롬 애니메이션 버그해결을 위한 코드 // render tree를 업데이트하는 style프로퍼티를 호출				
		popupWrapAnimation.offsetHeight;
		popupBgAnimation.offsetHeight;
		// graphic layer화 시켜서 애니메이션을 부드럽게 만들기
		popupBgAnimation.style.transform="translateY(0px)";

		// start opening animation
		Dom.addClass(popupWrapAnimation, "popup-ready");
		Dom.addClass(popupBgAnimation, "popup-ready");	
	}	    
		
	
	CAGE.ui.popup.super_type = popup;

	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = CAGE;
		// browser export
	} else {
		window.CAGE = CAGE;
	}    	

}(this));
