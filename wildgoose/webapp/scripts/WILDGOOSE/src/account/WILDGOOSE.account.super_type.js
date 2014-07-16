(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.account = WILDGOOSE.account || {};
	WILDGOOSE.account.super_type = WILDGOOSE.account.super_type || {};

	// 의존성 주입
	var Dom = CAGE.util.dom;
	var Ajax = CAGE.ajax;
	var Validator = WILDGOOSE.validator;
	
	/*
	 * Account라는 superType를 정의합니다.
	 * Join, Login, Logout, withdraw, change.pw와 같은 subType객체는 결국 Account라는 속성에 포함되고
	 * 궁극적으로 동등한 method를 공유할 수 있기 때문에
	 * subType이 superType을 상속받는 방법이 훨씬 효율적이라고 생각했습니다.
	 * 
	 * 기본적은 args는 객체이며 아래와 같은 형태입니다.
	  						{
								method: "POST",
								url: "/api/v1/accounts/",
								form: ".form-container",
								rule: {
									email: {
										type: "email"
									},
									password: {
										type: "password"
									},
									confirm: {
										type: "confirm",
										target: "password"
									}
								}
							};
	 * 
	 * 한 페이지 내에서 Account라는 type이 다양하게 생성될 수 있고,
	 * type이 각자의 method를 가지기보다는 prototype을 이용하여 공유하는 편이 훨씬 효율적이라고 생각하여
	 * Account객체를 생성자와 prototype패턴을 이용하게 되었습니다.
	 * 
	 * Account객체는 다음과 같은 property (member 변수)를 가지게 됩니다.
	 *   - this.form   : 자신이 관리할 form element
	 *   - this.method : ajax통신 방법
	 *   - this.url    : ajax통신 목적지
	 *   
	 *   - this.submitEl : this.form의 submit 기능을 하는 element (그 타입이 반드시 submit일 필요는 없고, name만 "submit"이면 됩니다.)
	 *   - this.randNum  : 만약 암호화된 정보를 전달하기 위해 template을 받을 때부터 얻는 randomNumber를 담는 공간
	 *   
	 *   - this.validator : this.form의 validation작업을 수행하기 위해 가지게 되는 WILDGOOSE.validator 객체
	 *   - this.rule      : validation 작업을 수행하기 위한 규칙을 담은 객체
	 *   					아래와 같은 형식을 가지게 된다.
	 *   					key값은    this.form 내부에 있는 input element의 name
	 *   					value값은  input element의 field값이 수행되어야할 validation작업의 type을 의미함
	 *    							  type엔 email, password, confirm이 존재함.
	 *    							  추가적으로 extend라는 이름의 객체로 validation작업을 확장할 수 있음 (지금은 function만 가능)
	 *   
							rule: {
								email: {
									type: "email"
								},
								password: {
									type: "password"
								},
								confirm: {
									type: "confirm",
									target: "password"
								}
							}
	 *   
	 *   
	 *   - this.names      : this.rule 객체의 key를 담은 배열
	 *   - this.selectedEl : this.names와 관련있는 input element를 담은 객체
	 *   					 key: name
	 *   					 value: key를 name으로 가지는 input element
	 *   
	 *   -this.cache : 어떤 event발생시 callback 함수를 this 스코프내에서 실행하기 위해 참조를 가진 변수
	 */
	
	function Account(args) {
		this.selectedEl = {};
		this.submitEl = null;
		this.randNum = null;
		this.method = null;
		this.rule = null;
		this.names = null;
		this.form = null;
		this.url = null;
		this.validator = null;
		this.cache = {
			keyEvtHandler: this._keyEvtHandler.bind(this)
		};
		
		/*
		 * account의 init
		 * java의 constructor의 느낌을 따라하기위해 객체의 이름과 동등하게 설정함.
		 */ 
		this._account(args);
	};

	Account.prototype = {
		constructor: "Account",
		
		/*
		 * Account 객체가 생성될 때 수행.
		 * Account 객체를 초기화하는 역할
		 */
		_account: function(args) {
			/*
			 * args가 존재하는 경우 args에 담긴 property를 this (Account)에 등록
			 */
			if (args !== undefined) {
				this.method = args.method;
				this.rule = args.rule;
				this.form = document.querySelector(args.form);
				this.url = args.url;
				this.randNum = args.randNum;
				
				/*
				 * 추가적으로 this.rule property가 존재하는 경우
				 * 반드시 validation 작업이 필요하므로 validation에 필요한 작업을 수행함.
				 */
				if (this.rule !== undefined) {
					/*
					 * this.names에 this.rule의 key값을 배열 형태로 저장함.
					 */
					this.names = Object.keys(this.rule);
					/*
					 * this.form에서 validation작업을 수행할 대상 element를 this.selectedEl에 Obj형태로 저장
					 * this.form의 submit을 담당하는 element를 this.submitEl에 저장 
					 */
					this._extract();
					this.validator = new Validator(this.form, this.rule);
					
					/*
					 * this.selectedEl에 관리하고 있는 element의 field에 keyup 이벤트가 발생했을때만
					 * validation작업과 submitEl의 UI 업데이트가 수행된다.
					 * 
					 * this.selectedEl에 keyup 이벤트를 설정하기 위한 메소드임.
					 */
					this._addKeyEvent();
					
					/*
					 * issue 488해결하기위한 함수
					 */
					this._init();
				}
			}
		},
		/*
		 * exec()함수를 호출할 때 중요한 부분이다.
		 * 만약 payload가 필요한 Ajax통신인 경우 
		 * subperType을 상속받은 subType에 _getPayload()함수만 overriding하여 새로 정의해 사용해야한다.
		 * 이렇게 interface만 정의해둔다면
		 * Account를 상속받는 Join, Login, Logout, ChangePw, Withdraw의 경우 _getPayload()함수만 정의하기만 하면 충분하다.
		 */
		_getPayload: function() {
			/*
			 * interface
			 * subType에서 _getPayload를 구현해야함.
			 */ 
			return null;
		},
		
		/*
		 * Account가 종료될 때
		 * this.selectedEl에 관리하는 element의 keyup event를 삭제하여 js의 효율을 높인다.
		 */
		stop: function() {
			this._removeKeyEvent();
		},
		
		exec: function(callback, failCallback) {
		/*
		 * 만약 validation을 위한 this.rule이 없거나, this.submitEl이 비활성화된 경우 ajax를 실행하지 않는다.
		 */
			if (this.rule !== undefined && Dom.hasClass(this.submitEl, "disable")) {
				console.log("누르지마 바보야");
			}
			else {
				Ajax[this.method]({
					"url": this.url,
					"success": function() {
						callback();
						console.log("Success!");
					},
					"failure": function() {
						if (failCallback !== undefined) {
							failCallback();
						}
						console.log("FAIL!");
					},
					"data": this._getPayload()
				});
			}
		},
		
		// 기존에 저장된 정보가 있는 경에도 validation이 가능토록하는 로직
		_init: function() {
			for (var name in this.selectedEl) {
				var el = this.selectedEl[name];
				if (el.value != "") {
					this._validateField(el, false);
				}
			}
		},
		
		/*
		 * 관리가 필요한 element를 this.form에서 추출함.
		 */
		_extract: function() {
			for (var i = this.form.length - 1; i >= 0; --i) {
				var el = this.form[i];
				/*
				 * element의 name이 submit인 경우 this.submitEl에 저장
				 */
				if (el.name == "submit") {
					this.submitEl = el;
					continue;
				}
				
				/*
				 * this.names를 이용하여
				 * this.selectedEl에 { name : element } 형태로 저장  
				 */
				if (this.names !== undefined && this.names.indexOf(el.name) != -1) {
					this.selectedEl[el.name] = el;
				}
			}
		},
		
		/*
		 * this.selectedEl에 있는 element에게 keyup이벤트를 부여하고
		 * callback함수를 this.cache.keyEvtHandler로 설정.
		 */
		_addKeyEvent: function() {
			for (var name in this.selectedEl) {
				var el = this.selectedEl[name];
				el.addEventListener("keyup", this.cache.keyEvtHandler, false);
			}
		},
		
		/*
		 * this.selectedEl에 this.cache.keyEvtHandler가 callback함수로 되어있는 keyup이벤트를 삭제
		 */
		_removeKeyEvent: function() {
			for (var name in this.selectedEl) {
				var el = this.selectedEl[name];
				el.removeEventListener("keyup", this.cache.keyEvtHandler, false);
			}
		},
		
		/*
		 * keyup 이벤트가 발생시 호출되는 callback function
		 * 
		 *  기본적인 목적은
		 *  1. 현재 눌린 키가 enter키인지 확인
		 *  2. 키가 눌린 targetEl의 vaidation 작업을 수행.
		 *  3. enter 키가 눌린 경우 this.submitEl에 click event를 발생시킴.
		 *     ajax 요청을 보내는 exec() 함수를 직접 실행하지 않고, custom event를 수행하는 이유는 
		 *     click시 얻을 수 있는 callback 함수를 받아오기 위함이다.
		 */
		_keyEvtHandler: function(evt) {
			var enter = (evt.keyCode == 13)? true : false;
			
			this._validateField(evt.target, enter);
			
			if (enter) {
				/*
				 * custom event의 특징은 detail이라는 Obj에 원하는 정보를 함께 전달할 수 있다는 점이다.
				 * 같은 click event라고 하더라도 detail.enter가 ture여부에 따라 enter를 눌러 실행했는지, 아니면 정말 click을 했는지 구별할 수 있기 때문에 사용하였다.
				 */
				var clickEvt = new CustomEvent("click", {detail: {"enter": enter}});
				this.submitEl.dispatchEvent(clickEvt);
			}
		},
		
		/*
		 * _keyEvtHandler가 호출되면 무조건 _validationField()함수를 호출한다.
		 * this.validator의 check함수를 통해 targetEl의 field가 유효한 정보인지를 확인한다.
		 * 그리고 submitEl의 UI를 disable로 할지 able로 할지 결정하는 _updateUI()함수를 호출하게된다.
		 */
		_validateField: function(targetEl, pressedEnterKey) {
			this.validator.check(targetEl);
			this._updateUI(this._ckeckSubmitStatus(pressedEnterKey));
		},
		
		/*
		 * submitEl이 활성화가될지 말지를 boolean값으로 확인해주는 함수이다.
		 * 만약 in-valid가 없거나 is-invalid class를 가지고 있지 않다면
		 * submitEl은 비활성화이어야하기 때문에 false를 반환한다.
		 */
		_ckeckSubmitStatus: function(enter) {
			var flag = true;
			for(var name in this.selectedEl) {
				var el = this.selectedEl[name].parentNode.parentNode.parentNode;
				if (!Dom.hasClass(el, "is-valid") || Dom.hasClass(el, "is-invalid")) {
					flag = false;
					break;
				}
			}
			return flag;
		},
		
		/*
		 * _checkSubmitStatus()의 결과에 따라 submitEl에 class를 부여하는 작업을 한다.
		 */
		_updateUI: function(flag) {
			if (flag) {
				Dom.removeClass(this.submitEl, "disable");
				Dom.addClass(this.submitEl, "enable");
			}
			else {
				Dom.removeClass(this.submitEl, "enable");
				Dom.addClass(this.submitEl, "disable");
			}
		}
	};
	
	
	WILDGOOSE.account.super_type = Account;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}

}(this));

