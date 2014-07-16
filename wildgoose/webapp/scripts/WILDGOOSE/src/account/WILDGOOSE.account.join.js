(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.account = WILDGOOSE.account || {};
	WILDGOOSE.account.join = WILDGOOSE.account.join || {};

	// 의존성 주입.
	var Account = WILDGOOSE.account.super_type;
	
	/*
	 * Account superType를 상속받는 subType
	 * 기생 조합 상속을 이용한다.
	 */
	function Join(args) {
		// join 생성시 Account를 this context에서 호출하고, 받았던 args인자를 다시 전달한다.
		Account.call(this, args);
	};
	
	/*
	 * Account 객체를 Join.prototype에 저장하고
	 * Join.prototype의 constructor를 Join으로 바꾸어 생성자를 분명히한다.
	 */
	Join.prototype = new Account();
	Join.prototype.constructor = Join;
	/*
	 * Account에 interface로만 존재했던
	 * _getPayload()를 overriding한다.
	 */
	Join.prototype._getPayload = function(){
		var email = escape(this.selectedEl.email.value);
		var password = SHA256(escape(this.selectedEl.password.value));
		var payload = "email=" + email + "&password=" + password;
		return payload;
	};
	
	WILDGOOSE.account.join = Join;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}    	

}(this));