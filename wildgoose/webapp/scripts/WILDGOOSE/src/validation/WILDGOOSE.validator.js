(function(window) {
	'use strict';
	var document = window.document;
	var console = window.console;
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.validator = WILDGOOSE.validator || {};
	
	var Extend = CAGE.util.object.extend;
	var Dom = CAGE.util.dom;
	var Ajax = CAGE.ajax;
	
	function Validator(form, rule) {
		this.rule = rule;
		this.myLogics = {};
		this.mySequence = {};
		
		this.UI.form = form;
		
		this.defineLogics();
//		defineSequence();
	};
	
	Validator.prototype = {
		constructor: "Validator",
		defineLogics: function() {
			for (var name in this.rule) {
				var curRule = this.rule[name];
				var curType = curRule.type;
				this.myLogics[name] = Extend({}, this.normLogics[curType]);
				
				this.defineSequence(name, curType, this.rule[name].extend);
				this.defineFunction(name, this.rule[name].extend);

				if (curType == "confirm") {
					this.myLogics[name].target = this.rule[name].target;						
				}
			}
		},
		
		defineSequence: function(name, type, extendObj) {
			this.mySequence[name] = [].concat(this.normSequence[type]);
			
			// extendObj가 존재할 경우만 concat
			if (extendObj !== undefined) {
				var extendSeq = Object.keys(extendObj);
				for(var i=0; i<extendSeq.length; ++i) {
					var curSeq = extendSeq[i];
					if (this.mySequence[name].indexOf(curSeq) == -1) {
						this.mySequence[name].push(curSeq);
					}
				}
			}
		},
		
		defineFunction: function(name, extendObj) {
			for (var i in this.mySequence[name]) {
				var curSeq = this.mySequence[name][i];
				// curSeq가 확장되었을 경우., extendObj에 존재.

				if (extendObj !== undefined && extendObj.hasOwnProperty(curSeq)) {
					this.myLogics[name][curSeq] = extendObj[curSeq];
				}
				else if (this.myLogics[name][curSeq] !== undefined && this.myLogics[name][curSeq][0] === null){
					this.myLogics[name][curSeq][0] = this.normFunction[curSeq];
				}
			}
		},
		
		
		check: function(inputEl) {
			var fieldName = inputEl.name;
			var logics = this.myLogics[fieldName];
			var sequence = this.mySequence[fieldName];
			var state = true;
			
			for ( var i = 0; i<sequence.length; ++i) {
				var curSeq = sequence[i];
				var logic = logics[curSeq][0];
				var alertMsg = logics[curSeq][1];

				if (!this._isValid(logic, inputEl)) {
					state = false;
					break;
				}
			}
			
			this.UI.update(state, inputEl, alertMsg);
			return state;
		},
		
		_isValid: function(logic, inputEl) {
			var name = inputEl.name;
			var value = inputEl.value;
			
			if (logic instanceof RegExp) {
				return logic.test(value);
			}
			else if (logic instanceof Function) {
				var validState = false;
				logic.call(this.myLogics[name], inputEl, function(validity, isProgressing) {
					if (isProgressing) {
						Dom.removeClass(inputEl, "isProgressing");
					}
					validState = validity;
				});
				return validState;
			}
			return false;
		},
		
		
		normFunction: {
			usable: function(inputEl, callback) {
				Ajax.GET({
					isAsync: false,
					url: "/api/v1/accounts?email=" + inputEl.value,
					success: function(responseObj) {
						var validity = true;
						var isProgressing = true;
						callback(validity, isProgressing);
					},
					failure: function(responseObj) {
						var validity = false;
						var isProgressing = true;
						callback(validity, isProgressing);
					}
				});
//					Dom.addClass(inputEl, "isProgressing");
			},
			equal: function(inputEl, callback) {
				var parent = inputEl.form;
				var targetEl = document.querySelector("." + parent.className + " input[name=" + this.target + "]");
				callback(inputEl.value == targetEl.value);
			}
			
		},
		
		
		normSequence: {
			email: [ "required", "format", "usable" ],
			password: [ "required", "letter", "size", "ampleNumber", "ampleLetter" ],
			confirm: [ "required", "equal" ]
		},
		
		normLogics: {
			email : {
				required : [ /.+/, "email을 입력해주세요" ],
				format : [ /^[\w\.-_\+]+@[\w-]+(\.\w{2,4})+$/, "email형식을 지켜주세요" ],
				usable : [ null, "이미 등록된 email입니다" ]
			},
			password : {
				required : [ /.+/, "비밀번호를 입력해주세요" ],
				letter : [
						/[a-zA-Z0-9\`\~\!\@\#\$\%\^\&|*\(\)\-\_\=\=\+\\\|\,\.\<\>\/\?\[\]\{\}\;\:\'\"]/,
						"숫자, 영문자 대소문자, 특수문자만 사용해주세요" ],
				size : [ /^.{8,15}$/, "8~15자 사이로 입력해주세요" ],
				ampleNumber : [ /(.*\d{1}.*){4,}/, "숫자는 4자리 이상 포함되어야 합니다" ],
				ampleLetter : [ /(.*\D{1}.*){4,}/, "문자는 4자리 이상 포함되어야 합니다" ]
			},
			
			confirm : {
				required : [ /.+/, "다시 입력해주세요" ],
				equal : [ null, "다시 확인해주세요" ]
			}
			
			
		},
		
		UI: {
			update: function(condition, inputEl, alertMsg) {
				if (!condition) {
					this._warn(inputEl, alertMsg);
					this._invalidStyle(inputEl);
				}
				else {
					this._unwarn(inputEl);
					this._validStyle(inputEl);
				}
			},
			/*
			 * 상태에 따른 변경될 style을 모음 
			 */
			_validStyle: function(inputEl) {
				var inputColumnEl = inputEl.parentNode.parentNode.parentNode;
//				Dom.removeClass(inputColumnEl, "status-denied");
				Dom.removeClass(inputColumnEl, "is-invalid");
//				Dom.addClass(inputColumnEl, "status-approved");
				Dom.addClass(inputColumnEl, "is-valid");
			},
			
			_invalidStyle: function(inputEl) {
				var inputColumnEl = inputEl.parentNode.parentNode.parentNode;
//				Dom.removeClass(inputColumnEl, "status-approved");
				Dom.removeClass(inputColumnEl, "is-valid");
//				Dom.addClass(inputColumnEl, "status-denied");
				Dom.addClass(inputColumnEl, "is-invalid");
			},

			/*
			 * 사용에게 메시지를 전달하기 위한 함수 
			 */
			_warn: function(inputEl, _warningMsg) {
				var name = inputEl.name;
				var target = this.form.querySelector(".msg-" + name);

				target.innerText = _warningMsg;
			},

			_unwarn: function(inputEl) {
				var name = inputEl.name;
				var target = this.form.querySelector(".msg-" + name);

				target.innerText = "";
			}
		}
		
	};
	
	WILDGOOSE.validator = Validator;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}	

}(this));
