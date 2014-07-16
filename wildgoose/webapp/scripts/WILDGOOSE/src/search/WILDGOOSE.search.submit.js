(function() {	
	// 자주 사용하는 글로벌 객체 레퍼런스 확보
	var document = window.document;
	var console = window.console;

	// 사용할 네임 스페이스 확보	
	var WILDGOOSE = window.WILDGOOSE || {};
	WILDGOOSE.search = WILDGOOSE.search || {};
	WILDGOOSE.search.submit = WILDGOOSE.search.submit || {};

	// 의존성 주입
	var String = CAGE.util.string;
	
	var Submit = {
		init: function(args) {
			this.box = args.box;
			this.form = this.box.form;
			this.submit = args.box;
			
			if (this.form !== undefined) {
				this.form.addEventListener("submit", this._handler.bind(this), false);
			}
		},
		
		_handler: function(evt) {
			if (String.trim(this.box.value) === "") {
				evt.preventDefault();
			}
		}
	}
	
	// 공개 메서드 노출
	WILDGOOSE.search.submit = Submit;
})();
