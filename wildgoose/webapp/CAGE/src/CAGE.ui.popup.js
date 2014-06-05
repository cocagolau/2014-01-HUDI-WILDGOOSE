(function(window) {
//	'use strict';
	var document = window.document;
	var console = window.console;
	var CAGE = window.CAGE || {};
	
	CAGE.ui = CAGE.ui || {};
	CAGE.ui.popup = CAGE.ui.popup || {};


	var Dom = CAGE.util.dom;
	var Template = CAGE.util.template;
	var Ajax = CAGE.ajax;

  
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
    
	/*
	myPopup2.open.dispatch(param1, param2, ...);   
    */
    
    function popup(config) {
		this.el = config.element;
		this.template = config.template;	
		this.transitionEffect = (config.transitionEffect)?(config.transitionEffect):("zoom");	
		//this.data = (config.data)?(config.data):({});
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

		el.addEventListener("click", openHandler.bind(this), false);

		function openHandler(event) {
			Ajax.GET({
				url: this.templateUrl,
				callback: (function(response){
					console.log(response)
					this.template = this.templateLoader(response);
					event.preventDefault();
					event.stopPropagation();
					
					var originalTarget;
					if(event.toElement) {
						originalTarget = event.toElement;
					} else if(event.originalTarget){
						originalTarget = event.originalTarget;
					}
					if(originalTarget === el) {
						this._counstructDOM();
						var popupWrapAnimation = document.querySelector(".popup-wrap.popup-animation");	
						popupWrapAnimation.addEventListener("transitionend", afteropenCallbackRef, false);
					}
				}).bind(this)
			});
			
		}

		function afteropenCallbackRef(event){
			//console.log(event);
			if(event.propertyName === "-webkit-transform" && status.data === false){	
				
				
				var popupWrapAnimation = document.querySelector(".popup-wrap.popup-animation");
				popupWrapAnimation.removeEventListener("webkitTransitionEnd", afteropenCallbackRef, false);    
	
				// 오픈 엔드 콜백 실행
				//console.log("왜 두번 실행되지?");
				afteropen.dispatch(document.querySelector(".popup-content"));
				status.data=!status.data;
				
				var popupBg = document.querySelector(".popup-bg");			
				var popupWrap = document.querySelector(".popup-wrap");
				var popupContainer = document.querySelector(".popup-container");
				var popupContent = document.querySelector(".popup-content");
				
				// esc 버튼으로 팝업 닫기 
				var escClose = function(e) {
				  if (e.keyCode == 27) { 
					  close();
				  }
				};
				
				document.addEventListener("keyup", escClose, false);				
				
				popupContainer.addEventListener("click",function(event){
					if(event.target === popupContainer || event.target === popupContent) {												
						var that = this;
						
						// 역 애니메이션 걸기
						Dom.removeClass(popupBg, "popup-ready");
						Dom.removeClass(popupWrap, "popup-ready");		
	 				        
				        popupBg.addEventListener("transitionend", (function(event){
							if(event.propertyName === "opacity" && status.data === true){	
								afterclose.dispatch(document.querySelector(".popup-content"));
								status.data=!status.data;
	
								var popupBg = document.querySelector(".popup-bg");			
								var popupWrap = document.querySelector(".popup-wrap");
		
						        popupBg?document.body.removeChild(popupBg):undefined;
						        popupWrap?document.body.removeChild(popupWrap):undefined;					        
							}	
				        }).bind(that), false);
					}
				}, false);											
	        }
		}
    }
	popup.prototype.open = function(){
		this.el.click();				
	};
	popup.prototype.close = function(){
		var popupContainer = document.querySelector(".popup-container");
		popupContainer.click();
	};	
    popup.prototype._getTemplate = function() {
	    return this.template;
    }
	popup.prototype._counstructDOM = function(){
		var transitionEffect = this.transitionEffect;
		var popupBg = document.createElement("div");
		
		Dom.addClass(popupBg, "popup-bg");
		Dom.addClass(popupBg, "popup-animation");

		var popupWrap = document.createElement("div");
		Dom.addClass(popupWrap, "popup-wrap");
		Dom.addClass(popupWrap, "popup-animation");
	
		var popupContainer = document.createElement("div");
		Dom.addClass(popupContainer, "popup-container");
		var popupContent = document.createElement("div");
		Dom.addClass(popupContent, "popup-content");

		popupContent.innerHTML = this._getTemplate();	
		popupContainer.appendChild(popupContent);
		
		if(transitionEffect != undefined) {
			Dom.addClass(popupContent, transitionEffect + "-animation-dialog");
		}
		
		popupWrap.appendChild(popupContainer);			

		document.body.insertAdjacentHTML("afterbegin", popupWrap.outerHTML);			
		document.body.insertAdjacentHTML("afterbegin", popupBg.outerHTML);			

		//data-role : close 인 엘리먼트에 팝업 닫기 리스너 연결해 줌 
		var closeBtn = document.querySelector(".popup-wrap button[data-role='close']");
		if(closeBtn) {
			closeBtn.addEventListener("click", this.closePopup, false);
		}	
		
		var popupWrapAnimation = document.querySelector(".popup-wrap.popup-animation");
		var popupBgAnimation = document.querySelector(".popup-bg.popup-animation");

		// 크롬 애니메이션 버그해결을 위한 코드					
		popupWrapAnimation.offsetHeight;
		popupBgAnimation.offsetHeight;
		popupBgAnimation.style.transform="translateY(0px)";

		// start opening animation
		Dom.addClass(popupWrapAnimation, "popup-ready");
		Dom.addClass(popupBgAnimation, "popup-ready");	
	}	    
	   
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
	
	CAGE.ui.popup = {
		popup: popup,
		ajaxPopup: ajaxPopup
	};

	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = CAGE;
		// browser export
	} else {
		window.CAGE = CAGE;
	}    	

}(this));