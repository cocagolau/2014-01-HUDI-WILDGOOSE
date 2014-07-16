(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.more = WILDGOOSE.more || {};
	WILDGOOSE.more.super_type = WILDGOOSE.more.super_type || {};

	// 의존성 주입
	var Ajax = CAGE.ajax;
	var EventEmitter = CAGE.event.emitter;
	var Template = CAGE.util.template;
	var User = WILDGOOSE.user;
	
	function More (args) {
		this._more(args);
	};
	
	More.prototype = {
		constructor: "More",
		_more: function(args) {
			if (args !== undefined) {
				this.presuccess = new EventEmitter("presuccess");
				this.postsuccess = new EventEmitter("postsuccess")
				
				this.moreBtnEl = args.more.button;
				this.container = args.container;
				this.requestNum = args.requestNum;
				this.template = args.template;
				this.templateCompiler = Template.getCompiler();
				
				this.metadata = {
					curNum : args.more.curNum,
					totalNum: args.more.totalNum,
					updatedNum: 0,
					keyword: args.keyword
				};
				
				this.cache = {
					exec: this._exec.bind(this),
					scrollingHandler: this._scrollingHandler.bind(this)
				};
				
				this.status = {
					exec: true
				};
				
				// 더보기 버튼 클릭이벤트 설정
				if (this.moreBtnEl != null) {
					this.moreBtnEl.addEventListener("click", this.cache.exec, false);
					this.moreBtnEl.addEventListener("approachPageEnd", this.cache.exec, false);
					this._updateUI();
				}
			}
		},
		
		_exec: function(evt) {
			// 현재함수 사용 가능여부 확인
			if (this.status.exec) {
				// 사용 못하도록 방지				
				this.status.exec = false;

				// search
				Ajax.GET({
					"url": this.getURL(),
					"success" : this._successHandler.bind(this),
					"failure" : this.failure,
					"error" : this.error
				});
			}
		},
		
		_addPageEndEvent: function() {
			window.addEventListener("scroll", this.cache.scrollingHandler, false);
		},
		_removePageEndEvent: function() {
			window.removeEventListener("scroll", this.cache.scrollingHandler, false);
		},
		
		_scrollingHandler: function(evt) {
			if (this.getApproachEventCondition()) {
				var approachPageEndEvt = new CustomEvent("approachPageEnd");
				this.moreBtnEl.dispatchEvent(approachPageEndEvt);
			}
		},
		
		_successHandler: function(responseObj) {
			var dataObj = this.success(responseObj);
			
			// response data가 존재할 경우만 실행
			if (dataObj !== undefined && dataObj.length != 0) {
				
				// template화 하기전.
				this.presuccess.dispatch(dataObj);
				
				var dataArr = this._moldDataIntoTempate(dataObj);
				this._attachRecievedData(dataArr);
				
				// template화하여 화면에 붙인
				this.postsuccess.dispatch(this.container);
				
				this._updateMetaData(dataArr.length);
				this._updateUI();
				
				// 사용 가능하도록 설정 변경
				this.status.exec = true;
				
			}
		},
		
		getApproachEventCondition: function() {
			/*
			 * interface
			 * do-something
			 */
			return false;
		},
		
		getURL: function() {
			/*
			 * interface
			 * do-something
			 */
			return "";
		},
		
		getMoldedData: function(data, templateCompiler, template) {
			/*
			 * interface
			 * do-something
			 */
			return "";
		},
		
		success: function(responseObj) {
			/*
			 * interface
			 * do-something
			 */
		},
		
		failure: function(responseObj) {
			/*
			 * interface
			 * do-something
			 */
		},
		
		error: function(responseObj) {
			/*
			 * interface
			 * do-something
			 */
		},
		
		// 현재 card의 개수를 업데이트
		_updateMetaData: function(updatedNum) {
			this.metadata.updatedNum = updatedNum;
			this.metadata.curNum += updatedNum;
		},
		
		// 더보기 버튼을 보여줄지 말지를 결정
		_updateUI: function() {
			var totalNum = this.metadata.totalNum;
			var curNum = this.metadata.curNum;
			this._addPageEndEvent();
			
			if (totalNum == 0 || totalNum <= curNum) {
				this._removePageEndEvent();
				this.moreBtnEl.setAttribute("style", "display: none;");
			}
		},
		
		_moldDataIntoTempate: function(dataObj) {			
			var dataLength = dataObj.length;
			var dataArr = [];
		
			// card template을 cards array에 담음
			for (var i=0; i<dataLength; i++) {
				var data = dataObj[i];
				var moldedData = this.getMoldedData(data, this.templateCompiler, this.template);
				dataArr.push(moldedData);
			}
			
			return dataArr;
		},
				
		_attachRecievedData: function(dataArr) {
			this.container.innerHTML += dataArr.join("");
		}
	};

	// 공개 메서드 노출
	WILDGOOSE.more.super_type = More;
	
	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}    
})();
