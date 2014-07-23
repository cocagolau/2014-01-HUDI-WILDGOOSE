(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.account = WILDGOOSE.account || {};
	WILDGOOSE.account.login = WILDGOOSE.account.login || {};

	// 의존성 주입.
	var Account = WILDGOOSE.account.super_type;
	
	function Login(args) {
		Account.call(this, args);
	};
	
	Login.prototype = new Account();
	Login.prototype.constructor = Login;
	Login.prototype._getPayload = function() {
		var email = escape(this.selectedEl.email.value);
		var password = SHA256(SHA256(escape(this.selectedEl.password.value)) + this.randNum);
		var payload = "email=" + email + "&password=" + password;
		return payload;
	};
	
	
	WILDGOOSE.account.login = Login;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}    	

}(this));