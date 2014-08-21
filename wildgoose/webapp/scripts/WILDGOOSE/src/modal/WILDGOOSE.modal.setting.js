(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.modal = WILDGOOSE.modal || {};
	WILDGOOSE.modal.setting = WILDGOOSE.modal.setting || {};

	// 의존성 선언
	var Ajax = CAGE.ajax; 
	var Popup = CAGE.ui.popup.super_type;
	var Template = CAGE.util.template;
	
	var Withdraw = WILDGOOSE.account.withdraw;
	var ChangePw = WILDGOOSE.account.change.pw;
	var User = WILDGOOSE.user;
	
	var SettingModal = {
		init: function() {
			this.button = {
				setting: document.querySelector("#setting"),
				withdraw: null,
				changePw: null
			};
			
			if (this.button.setting !== null) {
				this.cache = {
					settingHandler: this._settingHandler.bind(this),
					submitHandler: this._submitHandler.bind(this),
					openPopup: this._openPopup.bind(this),
					closePopup: this._closePopup.bind(this),
					withdraw: this._withdraw.bind(this),
					changePw: this._changePw.bind(this)
				};
				
				this.template = {
					setting: Template.get({"url":"/api/v1/templates/setting.html"}),
					withdraw: null,
					changePw: null
				};
				
				this.account = {
					withdraw: null,
					changePw: null
				}
				
				this.settingPopup = new Popup({
					element: this.button.setting,
					template: this.template.setting
				});
				
				this.settingPopup.afteropen.add(this.cache.openPopup);
			}
			
		},		
		
		_openPopup: function() {
			this._addClickEvent();
			this._getTemplates();
		},
		
		_closePopup: function() {
			this._removeClickEvent();
			this.settingPopup.afterclose.add(function() {location.reload();});
			this.settingPopup.close();
		},
		
		_settingHandler: function(evt) {
			var targetEl = evt.target;
			console.log(targetEl);
			this._selectUI(targetEl.name);
		},
		
		_addClickEvent: function() {
			this.button.withdraw = document.querySelector("#withdraw");
			this.button.changePw = document.querySelector("#changePw");
			
			this.button.withdraw.addEventListener("click", this.cache.settingHandler, false);
			this.button.changePw.addEventListener("click", this.cache.settingHandler, false);
		},
		
		_removeClickEvent: function() {
			this.button.withdraw.removeEventListener("click", this.cache.settingHandler, false);
			this.button.changePw.removeEventListener("click", this.cache.settingHandler, false);
		},
		
		_selectUI: function(name) {
			var template = this.template[name];
			var popupContent = document.querySelector(".popup-content");
			if (template !== null) {
				popupContent.innerHTML = template;
				// account init				
				this._accountInit(name);
			}
		},
		
		
		_accountInit: function(name) {
			// init
			this.cache[name]();
			
			// afterclose
			this.settingPopup.afterclose.add(this.account[name].stop.bind(this.account[name]));
			
			// submitEl init
			var submitEl = document.querySelector(".form-container button[name=submit]");
			submitEl.addEventListener("click", this.cache.submitHandler, false);
			
			
			// focus first input element
			var partialSelector = (name == "changePw")?"oldP":"p";
			var firstInputEl = document.querySelector(".form-container input[name=" + partialSelector + "assword]");
			firstInputEl.focus();
		},

		_submitHandler: function(evt) {
			var targetEl = evt.target
			var name = targetEl.form.name;
			
			this.account[name].exec(this.cache.closePopup);
		},
		
		_withdraw: function() {
			this.account.withdraw = new Withdraw({
				method: "POST",
				url: "/api/v1/accounts/",
				form: ".form-container",
				rule: {
					password: {
						type: "password"
					},
					confirm: {
						type: "confirm",
						target: "password"
					}
				},
				randNum: User.getRandomNumber()
			});
		},
		
		_changePw: function() {
			this.account.changePw = new ChangePw({
				method: "PUT",
				url: "/api/v1/accounts/",
				form: ".form-container",
				rule: {
					oldPassword: {
						type: "password",
						extend: {
							exist: [ function(inputEl, callback) {
								Ajax.POST({
									isAsync: false,
									url: "/api/v1/session",
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
									},
									data: (function() {
										var email = User.getId();
										var password = SHA256(SHA256(escape(inputEl.value)) + User.getRandomNumber());
										return "email=" + email + "&password=" + password;
									}())
								});
							}, "비밀번호가 다릅니다."]
						}
					},
					newPassword:{
						type: "password"
					},
					newConfirm: {
						type: "confirm",
						target: "newPassword"
					}
				},
				randNum: User.getRandomNumber()
			});
		},
		
		
		_getTemplates: function() {
			if (this.template.withdraw === null) {
				var template = Template.get({"url":"/api/v1/templates/withdraw.html"});
				var compiler = Template.getCompiler(template);
				this.template.withdraw = compiler({
					"email": User.getId()
				}, template);
			}
			
			if (this.template.changePw === null) {				
				var template = Template.get({"url":"/api/v1/templates/changePassword.html"});
				var compiler = Template.getCompiler(template);
				this.template.changePw = compiler({
					"email": User.getId()
				}, template);
			}
		}
	}
	

	WILDGOOSE.modal.setting = SettingModal;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}
}(this));
