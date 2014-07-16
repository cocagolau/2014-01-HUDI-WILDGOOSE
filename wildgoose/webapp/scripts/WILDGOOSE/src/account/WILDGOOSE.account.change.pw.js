(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.account = WILDGOOSE.account || {};
	WILDGOOSE.account.change = WILDGOOSE.account.change || {};
	WILDGOOSE.account.change.pw = WILDGOOSE.account.change.pw || {};

	// 의존성 주입.
	var Account = WILDGOOSE.account.super_type;
	
	function ChangePw(args) {
		Account.call(this, args);
	};
	
	ChangePw.prototype = new Account();
	ChangePw.prototype.constructor = ChangePw;
	ChangePw.prototype._getPayload = function() {
		var email = escape(document.getElementById("userId").textContent);
		var oldPassword = SHA256(SHA256(escape(this.selectedEl.oldPassword.value)) + this.randNum);
		var newPassword = SHA256(escape(this.selectedEl.newPassword.value));
		var payload = "email=" + email + "&old_pw=" + oldPassword + "&new_pw="+newPassword;
		return payload;
	};

	
	WILDGOOSE.account.change.pw = ChangePw;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}    	

}(this));