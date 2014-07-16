(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.search = WILDGOOSE.search || {};
	WILDGOOSE.search.auto_complement = WILDGOOSE.search.auto_complement || {};

	// 의존성 주입
	var Ajax = CAGE.ajax;
	
	var AutoComplement = {
		init : function(args) {
			this.row = {
				requestCount : args.list.requestNum,
				currentCount : 0
			};
			
			// ms
			this.interval = args.list.interval;

			this.is = {
				searching : false,
				hovering : false,
				pressedEnter : false,
				listing : false,
				highlighting : false
			};	
			this.box = args.searchBox;
			this.list = args.list.element;
			
			this.cache = {
				searchedQuery : this.box.value,
				row : null,
				callbackRef : {
					notify : this.notify.bind(this),
					expired : this.expired.bind(this),
					listHandler : this.listHandler.bind(this),
					drawList : this.drawList.bind(this),
					setHovering : this.setHovering.bind(this),
					observeState : this.observeState.bind(this)
				}
			};
			this.box.addEventListener("focus", this.cache.callbackRef.notify);
			this.box.addEventListener("blur", this.cache.callbackRef.expired);
		},

		expired : function(evt) {
			if (this.is.searching != false && this.is.hovering == false) {
				// list가 지워지지 않은 경우 제거
				if (this.is.listing == true) {
					this.removeList();
				}
				// value값 탐지 해제
				clearInterval(this.is.searching);
				this.is.searching = false;
			}
		},

		notify : function(evt) {
			if (this.is.searching == false) {
				this.is.searching = setInterval(this.cache.callbackRef.observeState, this.interval);
			}
		},
		
		observeState : function() {
			var curQuery = this.box.value;
			// curQuery 값이 변했을 경우만 처리
			if (curQuery != this.cache.searchedQuery) {
				console.log("detection: " + curQuery);
				if (curQuery == "") {
					// list 종료 로직.
					this.removeList();
				}
				else {
					this.search(curQuery);
				}
			}
		},
		
		search : function(searched) {
			this.cache.searchedQuery = searched;
			var url = "/api/v1/search?autocomplete=true&q=" + searched + "&how_many=" + this.row.requestCount;
			Ajax.GET({"url":url, "callback":this.cache.callbackRef.drawList});
		},
		
		drawList : function(response) {
			this.is.pressedEnter = false;
			var data = JSON.parse(response).data.reporters;
			console.log(data);
			if (data === undefined || data.length == 0) {
				return;
			}
			
			// cache.row 초기화
			this.cache.row = null;
			// 전달받은 row개수를 기록
			this.row.currentCount = data.length;
			var li_template = "";
			for (var i = 0; i < this.row.currentCount; i++) {
				li_template += "<li><div>" + data[i]["name"] + "</div></li>";
			}
			this.list.innerHTML = li_template;
			this.addList();
		},
		
		removeList : function() {
			this.is.listing = false;
			this.row.currentCount = 0;
			this.cache.row = null;
			this.list.style.display = "none";
			this.removeMouseRader(this.list);
			this.box.removeEventListener("keydown", this.cache.callbackRef.listHandler, false);
			this.list.removeEventListener("click", this.cache.callbackRef.listHandler, false);
			this.list.removeEventListener("mousemove", this.cache.callbackRef.listHandler, false);
			
			this.is.hovering = false;
		},
		addList : function() {
			this.is.listing = true;
			this.list.style.display = "inline-block";
			this.addMouseRader(this.list);
			this.box.addEventListener("keydown", this.cache.callbackRef.listHandler, false);
			this.list.addEventListener("click", this.cache.callbackRef.listHandler, false);
			this.list.addEventListener("mousemove", this.cache.callbackRef.listHandler, false);
		},
		addMouseRader : function(el) {
			el.addEventListener("mouseover", this.cache.callbackRef.setHovering, false);
			el.addEventListener("mouseout", this.cache.callbackRef.setHovering, false);
		},
		removeMouseRader : function(el) {
			el.removeEventListener("mouseover", this.cache.callbackRef.setHovering, false);
			el.removeEventListener("mouseout", this.cache.callbackRef.setHovering, false);
		},
		setHovering : function(evt) {
			if (evt.type == "mouseover") {
				this.is.hovering = true;
			}
			else if (evt.type == "mouseout") {
				this.is.hovering = false;
			}
		},
		listHandler : function(evt) {
			var targetEl = evt.target;
			// keydown event
			if (evt.type == "keydown" && targetEl == this.box) {
				console.log("keydown");
				var keyID = evt.keyCode;
				// up, down key
				if (keyID == 38 || keyID == 40) {
					// 위쪽화살표를 움직였을 때 포인터가 왼쪽으로 가는걸 방지하기 위해 기본 이벤트 해제
					evt.preventDefault();
					this.highlightRow(39 - keyID);
				}
				// enter key
				else if (keyID == 13) {
					// 엔터를 눌렀을 때 기본 이벤트가 실행되는걸 방지하기 위해 해제
					evt.preventDefault();
					this.selectEl(this.list.children[this.cache.row]);
				}
			}
			
			// click event
			else if (evt.type == "click" && targetEl.parentNode.parentNode == this.list && this.is.hovering == true) {
				this.is.hovering = false;
				this.selectEl(evt.target);
			}
			
			// mousemove event
			else if (evt.type == "mousemove") {
				if (this.is.highlighting == true) {
					this.highlightOut(this.cache.row);
				}
			}
		},
		
		selectEl : function(el) {
			var text = null;
			// 선택된 el이 없는 경우 검색창에 입력된 query가 됨.
			if (el === undefined) { text = this.box.value; }
			else { text = el.innerText; }
			
			text = this.removeNewline(text);
			this.box.value = text;
			
			// ajax통신이 일어나지 못하도록 캐싱된 마지막 검색 query를 바꾼다.
			this.cache.searchedQuery = text;
			this.removeList();
			this.box.form.submit();
		},
		
		removeNewline : function(text) {
			var index = text.lastIndexOf("\n");
			if (index == -1) return text;
			return text.substring(0, index);
		},
		
		highlightRow : function(change) {
			// 처음 입력시
			if (this.cache.row == null) {
				this.cache.row = 0;
				change = 0;
			}
			
			var cacheRow = this.cache.row;
			var currentRow = cacheRow - change;
			
			// ajax에서 응답받은 현재 row의 수와 비교함.
			if (currentRow >= this.row.currentCount) { currentRow = 0; }
			else if (currentRow < 0) { currentRow = this.row.currentCount-1; }

			this.highlightOut(cacheRow);
			this.highlightIn(currentRow);
			this.cache.row = currentRow;
		},

		highlightIn : function(rowNum) {
			this.is.highlighting = true;
			this.list.children[rowNum].className = "highlight";
		},
		highlightOut : function(rowNum) {
			if (rowNum !== null) {
				this.is.highlighting = false;
				this.list.children[rowNum].className = "";
			}
		}
	};
	
	// 공개 메서드 노출
	WILDGOOSE.search.auto_complement = AutoComplement;
})();