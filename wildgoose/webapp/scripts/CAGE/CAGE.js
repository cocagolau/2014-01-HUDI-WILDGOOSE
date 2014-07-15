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
(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var CAGE = window.CAGE || {};
	var isClassListExist = false
	CAGE.util = CAGE.util || {};

	if('classList' in document.createElement('a')) {
		isClassListExist = true;
	}
	
	var hasClass_common = function(DOM, className) {
		// DOM에 클래스 존재여부 확인
		var pattern = new RegExp("^.*" + className + ".*$");
		if (pattern.test(DOM.className)) {
			return true;
		}
		return false;
	}
	
	var addClass_common = function(DOM, className) {
		// DOM에 클래스 존재여부 확인
		if (this.hasClass(DOM, className)) return;
		
		// DOM에 class가 없는 경우
		if (DOM.className == "") {
			DOM.className = className;
			return;
		}
		
		// DOM에 class가 있는 경우
		DOM.className += " " + className;
	}
	
	var removeClass_common = function (DOM, className) {
		// DOM에 클래스 존재여부 확인
		if (!this.hasClass(DOM, className)) return;
		
		// DOM에 class가 한개만 존재시
		if (DOM.className == className) {
			DOM.className = "";
			return;
		}
		
		// DOM에 class가 두개 이상 존재시
		if(this.hasClass(DOM," "+className)) {
			DOM.className = DOM.className.replace(" " + className, "");
		} else {
			DOM.className = DOM.className.replace(className + " ", "");
		}
	};
	
	var Util = {
		object : {
			extend: function(dest, src) {
				for (var property in src) {
					dest[property] = src[property];
				}
				return dest;
			}
		},
		dom : {
			hasClass : (function() {
				if(isClassListExist) {
					return function(DOM, className) {
						return DOM.classList.contains(className);
					}
				} else return hasClass_common;
			})(),
			
			addClass : (function() {
				if(isClassListExist) {
					return function(DOM, className) {
						return DOM.classList.add(className);
					}
				} else return addClass_common;
			})(),
			
			removeClass : (function() {
				if(isClassListExist) {
					return function(DOM, className) {
						return DOM.classList.remove(className);
					}
				} else return addClass_common;
			})(), 
			isDescendant : function(parent, child) {
			     var node = child.parentNode;
			     while (node != null) {
			         if (node == parent) {
			             return true;
			         }
			         node = node.parentNode;
			     }
			     return false;
			}
		},
		
		string: {
			trim: (function() {
				if('trim' in String.prototype) {
					return function(str) {
						return String.prototype.trim.call(str);
					};
				} else return function (str) {
					return this.ltrim(this.rtrim(str));
				}
			})(),
			
			rtrim: (function(str) {
				if('trimRight' in String.prototype) {
					return function(str) {
						return String.prototype.trimRight.call(str);
					};
				} else return function (str) {
					return str.replace(/\s*$/, "");
				}
			})(),
			
			ltrim: (function(str) {
				if('trimLeft' in String.prototype) {
					return function(str) {
						return String.prototype.trimLeft.call(str);
					};
				} else return function (str) {
					return str.replace(/^\s*/, "");
				}
			})()
		},
		
		template: {
			compiler: function(dataObj, templateString) {
		        var resultStr = Util.string.trim(templateString);
		        for (var variableName in dataObj) {
		            if (dataObj[variableName]===0||dataObj[variableName]) {
		            	var reg = "<%= "+variableName+" %>"
		                resultStr = resultStr.replace(RegExp(reg, "gm"), dataObj[variableName]);
		            }
		        }
		        return resultStr;
		    },
				
			getCompiler: function() {
			    return this.compiler;
			},
			
			// xhr, using synchronized get method
			get: function(args) {
				var Ajax = CAGE.ajax;
				var url = args.url;
				var template = null;
				Ajax.GET({
					"url":url,
					"isAsync":false,
					"callback":function(templateResponse) {
						template = JSON.parse(templateResponse)["data"]["template"];
					}
				});
				
				return template;
			}
		}
	};
	
	CAGE.util = Util;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = CAGE;
		// browser export
	} else {
		window.CAGE = CAGE;
	}    	

}(this));



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
(function(window) {
	'use strict';
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var CAGE = window.CAGE || {};
	CAGE.ajax = CAGE.ajax || {};

	// 비공개 메서드 선언
	function _createRequest() {
		try {
			var request = new XMLHttpRequest();
		} catch (tryMS) {
			try {
				request = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (otherMS) {
				try {
					request = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (failed) {
					request = null;
				}
			}
		}
		return request;
	}
		
	function _responseData(e, request, callback) {
		if (request.readyState == 4) {
			if (request.status == 200) {
				// responseText의 마지막에 포함된 개행문자 제거
				var response = request.responseText;
				if(response.substring(response.length - 1) === "\n") {
					response = response.substring(0, response.length - 1);					
				}
				callback(response);
			}
		}
	}
	function removeNewLine(str) {
		if(str.substring(str.length - 1) === "\n") {
			return str.substring(0, str.length - 1);					
		}
		return str;
	}
	
	function _error(evt, request, failure, error) {
		// failure
		if (evt.detail !== undefined) {
			failure(evt.detail);
			return;
		}
		
		// error
		var responseText = removeNewLine(request.responseText);
		var responseObj = JSON.parse(request.responseText);
		error(responseObj);
	}
	
	// success
	function _load(evt, request, success) {
		var targetEl = evt.target;
		if (request.status >= 200 && request.status < 300 || request.status == 304) {
			var response = removeNewLine(request.responseText);
			var responseObj = JSON.parse(request.responseText);
			var apiStatus = responseObj.status;
			if (apiStatus >= 200 && apiStatus < 300 || apiStatus == 304) {
				success(responseObj);
			}
			// failure, error이벤트를 거쳐 실행되어야 callback을 실행할 수 있음.
			else {
				var errorEvt = new CustomEvent("error", { "detail": responseObj });
				targetEl.dispatchEvent(errorEvt);
			}
		}
	}
	
	function _exec(config){
		var method = config.method,
		headerObj = config.headers,
		url = config.url,
		callback = config.callback,
		data = config.data,
		isAsync = config.isAsync,
		success = config.success,
		failure = config.failure,
		error = config.error;

		if (url == undefined) {
			return;
		}
		
		if (isAsync == undefined) {
			isAsync = true;
		}
				
		var request = _createRequest();
		if (request == undefined) {
			console.log("Unable to create request");
			return;
		}
		
		request.open(method, url, isAsync);
		////////  success, failure로 변경 완료시 삭제 필요함.  /////////
		if (callback !== undefined) {
			request.addEventListener("readystatechange", function (e) {
				_responseData(e, request, callback);
			}, false);
		}
		/////////////////////////////////////////////////////////
		
		if (success !== undefined){ 
			request.addEventListener("load", function(evt){
				_load(evt, request, success);
//				_load(evt, success);
			}, false);
		}
		
		if (failure !== undefined) {
			request.addEventListener("error", function(evt){
				_error(evt, request, failure, error);
//				_error(evt, failure, error);
			}, false);
		}
		
		
		if (headerObj !== undefined) {
			for (var header in headerObj) {
				var content = headerObj[header];
				request.setRequestHeader(header, content);
			}
		}
		
		// send
		request.send(data);
	}

	// 공개 메서드 선언	
	function GET(config) {
		config.method = "GET";
		_exec(config);
	}
		
	function POST(config) {
		config.method = "POST";
		config.headers = {
			"Content-Type": "application/x-www-form-urlencoded"
		};
		_exec(config);
	}

	function PUT(config) {
		config.method = "PUT";
		config.headers = {
			"Content-Type": "application/x-www-form-urlencoded"
		};
		_exec(config);
	}
		
	function DELETE(config) {
		config.method = "DELETE";
		_exec(config);
	}
	
	
	// 상태 누적
//	window.addEventListener("popstate", function(e) {
//		if (e.state) {
//			location.load(e.state.url);
//		}
//	}.bind(this), false);
	
	// 공개 메서드 노출
	CAGE.ajax = {
		GET: GET,
		POST: POST,
		PUT: PUT,
		DELETE: DELETE
//		_exec: _exec
	};
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = CAGE;
		// browser export
	} else {
		window.CAGE = CAGE;
	}    	

}(this));
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
//    	debugger;
		//console.log(event);
		if(event.propertyName === "-webkit-transform" && this.status.data === false){	
			
			
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
(function(window) {
	'use strict';
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var CAGE = window.CAGE || {};
	CAGE.ui = CAGE.ui || {};
	
	function Parallax(){
		this.wrapperCollections = [];
		this.itemCollections = [];
		this.init();
		this.setEvent();
	}
	
	Parallax.prototype.init = function(){
		// 랩퍼들을 저장
		var parallaxWrappers = document.querySelectorAll(".parallax-wrapper");
		var wrapperCollections = this.wrapperCollections;
	
		[].forEach.call(
			parallaxWrappers, 
			function(el){
				wrapperCollections.push(el);
				
			}
		);
		// 모든 아이템의 기본 좌표를 저장
		for(var i in wrapperCollections) {
			[].forEach.call(
				wrapperCollections[i].querySelectorAll(".parallax-item"), 
				function(el){
					el.style.transform="translateY(0px)";
					var elStyle = window.getComputedStyle(el);
					el.setAttribute("data-initialTopOffset", getOffset(el).top);
					el.setAttribute("data-initialLeftOffset", getOffset(el).left);
					
					el.setAttribute("data-initialTop", elStyle.top);
					el.setAttribute("data-initialLeft", elStyle.left);
					el.setAttribute("data-initialMarginLeft", elStyle.marginLeft);
				}
			);
		}
		

	};
	
	Parallax.prototype.setEvent = function(){
		document.addEventListener("mousemove", mousemoveHandler, false);
		window.addEventListener("resize", resizeHandler, false);
		 
		function mousemoveHandler(event) {
			var parallaxItems = document.querySelector(".parallax-wrapper").querySelectorAll(".parallax-item");
			[].forEach.call(
				parallaxItems, 
				function(targetEl){
					parallax_set(targetEl, event);
				}
			);	
		}
		
		function parallax_set(targetEl, event){
			var xRange = parseInt(targetEl.getAttribute("data-rangex")) || 0;
			var yRange = parseInt(targetEl.getAttribute("data-rangey")) || 0;
			var reverse = (targetEl.parentNode.getAttribute("class").indexOf("parallax-bg") >- 1)||(targetEl.hasAttribute("data-reverse"))?-1:1;
			var bodyStyle = window.getComputedStyle(document.body);	
			var xPosition = event.x?event.x/parseInt(window.innerWidth):0.5;
			var yPosition = event.y?event.y/parseInt(window.innerHeight):0.5;
			
			//if(targetEl.getAttribute("src").indexof("404msg") > -1) {
				//console.log(xPosition);
			//}
			
			targetEl.style.left = (parseInt(targetEl.getAttribute("data-initialLeftOffset")) + reverse*xRange*(xPosition-0.5)) + "px";
			targetEl.style.marginLeft = "0";
			targetEl.style.top = (parseInt(targetEl.getAttribute("data-initialTopOffset")) + reverse*yRange*(yPosition-0.5) - 40) + "px";
			targetEl.style.marginTop = "0";
		}
		
		function resizeHandler(event) {
			var parallaxItems = document.querySelector(".parallax-wrapper").querySelectorAll(".parallax-item");
			
			[].forEach.call(
				parallaxItems, 
				function(targetEl){
					parallax_reset(targetEl);
				}
			);
		}
		function parallax_reset(targetEl){
			// top, left, margin-left 를 원래대로 되돌리기 
			targetEl.setAttribute("style","");
			/*
			targetEl.style.left = targetEl.getAttribute("data-initialLeft");
			targetEl.style.marginLeft = targetEl.getAttribute("data-initialMarginLeft");
			targetEl.style.top = targetEl.getAttribute("data-initialTop");
			*/
			targetEl.setAttribute("data-initialTopOffset", getOffset(targetEl).top);
			targetEl.setAttribute("data-initialLeftOffset", getOffset(targetEl).left);			
		}
	}
	
	function getOffset( el ) {
	    var _x = 0,
	    _y = 0;
	    while( el && el.tagName.toLowerCase() != 'body' && !isNaN( el.offsetLeft ) && !isNaN(el.offsetTop ) ) {
	        _x += el.offsetLeft - el.scrollLeft;
	        _y += el.offsetTop - el.scrollTop;
	        el = el.offsetParent;
	    }
	    return { top: _y, left: _x };
	}
		
	CAGE.ui.parallax = Parallax;

	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = CAGE;
		// browser export
	} else {
		window.CAGE = CAGE;
	}    	

}(this));