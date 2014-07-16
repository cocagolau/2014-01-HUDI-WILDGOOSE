(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.modal = WILDGOOSE.modal || {};
	WILDGOOSE.modal.join = WILDGOOSE.modal.join || {};

	// 의존성 선언
	var Ajax = CAGE.ajax; 
	var Template = CAGE.util.template;
	var Popup = CAGE.ui.popup.super_type;
//	var JoinAccount = WILDGOOSE.account.join;
	var Join = WILDGOOSE.account.join;

	
	var JoinModal = {
		init: function() {
			// 회원가입 버튼을 찾는다
			this.joinBtn = document.querySelector("#join");
			
			// 버튼에 가입창을 연결시킨다
			this.template = Template.get({"url":"/api/v1/templates/join.html"});
			
			this.joinPopup = new Popup({
				element: this.joinBtn,
				template: this.template
			});
			
			// 가입창에 스크립트를 적용한다.
			// Ajax로 불러온 팝업창에는 스크립트를 넣을 수 없기 때문이다.
			this.joinPopup.afteropen.add(this._openPopup.bind(this));
		},
		
		_openPopup: function() {
			this._accountInit();
			var btn = arguments[0].querySelector("#create");
			btn.addEventListener("click", this._clickHandler.bind(this), false);
			
			var emailDom = document.querySelector(".form-container input[name=email]");
			emailDom.focus();
		},
		
		_closePopup: function() {
			this.joinPopup.afterclose.add(function() {location.reload();});
			this.joinPopup.close();
		},
		
		_accountInit: function() {
		
			// Join객체를 생성한다.
			this.joinAccount = new Join({
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
			});
			
			// joinPopup이 딷히면 JoinAccount.stop()을 호출하여 this.selectedEl에 붙어있던 keyup event를 해제한다.
			this.joinPopup.afterclose.add(this.joinAccount.stop.bind(this.joinAccount));
		},
		
		_clickHandler: function(evt) {

			/*
			 * submit 버튼을 누르면
			 * JoinAccount의 exec()함수를 호출하여 ajax 통신을 한다.
			 * 
			 * exec()함수에 아래의 callback 함수를 전달하여
			 * exec()함수가 호출되면 joinPopup이 닫히도록 한다.
			 */ 
			this.joinAccount.exec(this._closePopup.bind(this));
		}
	}
	
	WILDGOOSE.modal.join = JoinModal;

	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}
	
}(this));
