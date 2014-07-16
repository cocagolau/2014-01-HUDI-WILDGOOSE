(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var APP = window.APP || {};
	APP.page = APP.page || {};
	APP.page.error = APP.page.error || {};

	// 하위 모듈 import
	var Ajax = CAGE.ajax; 
	var User = WILDGOOSE.user;
	var Join = WILDGOOSE.account.join;
	var Login = WILDGOOSE.account.login;
	
	var ErrorPage = {
		init: function(args) {
			this.accountName = args.accountName;
			
			if (args !== undefined && this.accountName !== undefined) {
				var curAccountName = "_" + this.accountName;
				this.curAccount = this[curAccountName]();
				
				
				if (this.accountName == "join") {
					var submitBtn = document.querySelector(".error-container .form-container button[name=submit]");
					submitBtn.addEventListener("click", function(evt) {
						this.curAccount.exec(function(){
							location.href="/";
						});
					}.bind(this), false);
				}
				else if (this.accountName == "login") {
					var submitBtn = document.querySelector(".error-container .form-container button[name=submit]");
					submitBtn.addEventListener("click", function(evt) {
						this.curAccount.exec(function(){
							location.reload();
						});
					}.bind(this), false);
				}
			}
			
			var emailEl = document.querySelector(".error-container .form-container input[name=email]");
			emailEl.focus();
		},
		
		_join: function() {
			return new Join({
				method: "POST",
				url: "/api/v1/accounts/",
				form: ".error-container .form-container",
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
		},
		
		_login: function() {
			return new Login({
				method: "POST",
				url: "/api/v1/session/",
				form: ".error-container .form-container",
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
				randNum: User.getRandomNumber()
			});
		}
	};

	APP.page.error = ErrorPage;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = APP;
		// browser export
	} else {
		window.APP = APP;
	}
})(this);
