(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.account = WILDGOOSE.account || {};
	WILDGOOSE.account.logout = WILDGOOSE.account.logout || {};

	// 의존성 주입.
	var Account = WILDGOOSE.account.super_type;
	
	function Logout(args) {
		Account.call(this, args);
	};
	
	Logout.prototype = new Account();
	Logout.prototype.constructor = Logout;

	WILDGOOSE.account.logout = Logout;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}    	

}(this));