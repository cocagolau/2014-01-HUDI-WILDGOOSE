(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.modal = WILDGOOSE.modal || {};
	WILDGOOSE.modal.login = WILDGOOSE.modal.login || {};

	// 의존성 선언
	var Ajax = CAGE.ajax; 
	var Template = CAGE.util.template;
	var Popup = CAGE.ui.popup.super_type;
	
	var TemplateUtil = CAGE.util.template;
//	var LoginAccount = WILDGOOSE.account.login;
	var Login = WILDGOOSE.account.login;
	var User = WILDGOOSE.user;
	
	
	var LoginModal = {
		init: function() {
			this.loginBtn = document.querySelector("#login");
			this.template = Template.get({"url":"/api/v1/templates/login.html"});
			
			this.loginPopup = new Popup({
				element: this.loginBtn,
				template: this.template
			});
			
			// 가입창에 스크립트를 적용한다.
			// Ajax로 불러온 팝업창에는 스크립트를 넣을 수 없기 때문이다.
			this.loginPopup.afteropen.add(this._openPopup.bind(this));
		},
		
		_openPopup: function() {
			this._accountInit();
			var btn = arguments[0].querySelector("#create");
			btn.addEventListener("click", this._clickHandler.bind(this), false);
			
			var emailDom = document.querySelector(".form-container input[name=email]");
			emailDom.focus();
		},
		
		_closePopup: function() {			
			this.loginPopup.afterclose.add(function() {location.reload();});
			this.loginPopup.close();
		},
		
		_accountInit: function() {
			var randNum = User.getRandomNumber();
			this.loginAccount = new Login({
				method: "POST",
				url: "/api/v1/session/",
				form: ".form-container",
				rule: {
					email: {
						type: "email",
						extend: {
							usable: [ function(inputEl, callback) {
								Ajax.GET({
									isAsync: false,
									url: "/api/v1/session?email=" + inputEl.value,
									success: function(responseObj) {
										console.log("Success!");
										var validity = true;
										var isProgressing = true;
										callback(validity, isProgressing);
									},
									failure: function(responseObj) {
										console.log("Failure!");
										var validity = false;
										var isProgressing = true;
										callback(validity, isProgressing);
									},
									error: function(responseObj) {
										console.log("Error!")
									}
								});
							}, "가입되지 않은 이메일입니다."]
						}
					},
					password: {
						type: "password"
					}
				},
				randNum: randNum
			});
			this.loginPopup.afterclose.add(this.loginAccount.stop.bind(this.loginAccount));
		},
		
		_clickHandler: function(evt) {
			this.loginAccount.exec(this._closePopup.bind(this), function() {
				var messageDiv = document.getElementById("result-msg");
				messageDiv.innerText = "비밀번호가 틀렸습니다.";
			});
		}
	}
	
	WILDGOOSE.modal.login = LoginModal;

	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}
	
}(this));
