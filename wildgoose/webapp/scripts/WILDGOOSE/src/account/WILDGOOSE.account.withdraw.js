(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.account = WILDGOOSE.account || {};
	WILDGOOSE.account.withdraw = WILDGOOSE.account.withdraw || {};

	// 의존성 주입.
	var Account = WILDGOOSE.account.super_type;
	
	function Withdraw(args) {
		Account.call(this, args);
	};
	
	Withdraw.prototype = new Account();
	Withdraw.prototype.constructor = Withdraw;
	Withdraw.prototype._getPayload = function() {
		var email = escape(document.getElementById("userId").textContent);
		var password = SHA256(SHA256(escape(this.selectedEl.password.value)) + this.randNum);
		var payload = "email=" + email + "&password=" + password + "&check=withdraw";
		return payload;
	};
	
	WILDGOOSE.account.withdraw = Withdraw;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}    	

}(this));