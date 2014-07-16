/**
 * 외부에서는 WILDGOOSE.drag.exe(args)로 드래스 함수에 접근할 수 있다.
 * 전달해야 하는 인자 args는 dictionary로 인자는 3개이
 * 
 * 1. target: 드래그 되어야 하는 DOM들을 담고있는 DOM 		ex.ul
 * 2. tagName: 드래가 되는 DOM의 태그이름 				ex."LI"(태그이름은 모두 대문자임을 주의)
 * 3. movedClassName: 드래그 중인 DOM의 클래스명. 드래그 중의 CSS를 위한 것. 	ex. 드래그 중인 DOM은 투명도를 조절 함  
 * 
 * */

(function(window){

'use strict';
var document = window.document;
var console = window.console;

var WILDGOOSE = window.WILDGOOSE || {};
WILDGOOSE.drag = WILDGOOSE.drag || {};

var User = WILDGOOSE.user;
	
var values = {sourceEle : null, destEle : null};

		function _dragStart(e){
			var tar = e.target;
			tar.classList.add(values.movedClassName);
			
			e.dataTransfer.effectAllowed = 'move';
			if(tar.tagName == values.tagName){
				values.sourceEle = tar;
			}
		}
		
		function _dragOver(e){
			if(e.preventDefault){
				e.preventDefault();
			}
			e.dataTransfer.dropEffect = 'move'; //cursor 모양
			
			return false;
		}
		
		function _drop(e){
			var tar = e.target;
			if(e.stopPropagation){
				e.stopPropagation(); //browser redirecting 방지
			}
			
			while(true){
				if(tar.tagName == values.tagName){
					values.destEle = tar;
					break;
				}
				tar = tar.parentNode;
			}
			
			return false;
		}
		
		function _dragEnd(e){
			e.preventDefault();
			var tar = e.target;
			if(tar.className.indexOf(values.movedClassName) != -1){
				tar.classList.remove(values.movedClassName);
			}
			
			if(values.destEle != null &&values.sourceEle != null){
				values.destEle.insertAdjacentElement('afterend',values.sourceEle);
			}
			
			_localSave();
		}
		
		function _addEvent(target){
			if (target !== null) {
				var children = target.children;
				[].forEach.call(children, function(child){
					child.draggable = "true";
					child.addEventListener('dragstart', function(e){ _dragStart(e);}, false);
					child.addEventListener('dragover', function(e){ _dragOver(e);}, false);
					child.addEventListener('drop', function(e){ _drop(e);}, false);
					child.addEventListener('dragend', function(e){ _dragEnd(e);}, false);
//					child.style.transition = "all 2s";
//					child.style.WebkitTransition = "all 2s";
					
				});
			}
		}
		
		function execute(args){
			values.target = args.body;
			values.tagName = args.tagName;
			values.movedClassName = args.movedClassName;
			
			_addEvent(args.body);
			_myAuthorOrder();

			
		}
		
		//test
		function _localSave(){
			var testString ="";
			var child = values.target.children;
			for(var i=0; i < child.length-1; i++){ // 빈 리스트 때문에 -1을 해 줌
				testString = testString+child[i].firstElementChild.getAttribute('data-reporter_id')+" ";
			}
			
			localStorage.setItem(User.getId(), testString);
		}
		
		function _myAuthorOrder(){
			var ul = document.querySelector('.dashboard-left ul');
			
			if (ul !== null) {
				var child = ul.children;
				if(localStorage.getItem(User.getId()) == undefined) return;
				var numLi = localStorage.getItem(User.getId()).split(" ");
				numLi.pop(); // 빈 값("") 때문에 -1을 해 줌
				
				for(var j=0; j<numLi.length; j++){ 
					for(var i=0; i<child.length-1; i++){ // 빈 리스트 때문에 -1을 해 줌
						if(child[i].firstElementChild != null){
							if(child[i].firstElementChild.getAttribute('data-reporter_id')==numLi[j]){
								ul.appendChild(child[i]);
							}
						}
					}
				}
				
				var lastCard = document.querySelector('.card-last');
				ul.appendChild(lastCard);
			}
		}

		
		WILDGOOSE.drag = {
			exe : execute
		};

	// 글로벌 객체에 모듈을 프로퍼티로 등록한다.
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = WILDGOOSE;
		// browser export
	} else {
		window.WILDGOOSE = WILDGOOSE;
	}	   	

}(this));