# CAGE library
-----

### cage.js
 - cage libaray가 유지될 수 있도록
   1. 전역객체의 네임스페이스를 확보
   2. 등록되는 객체 인스턴스를 관리
   3. log 가능하도록 static 함수 구현 
 - 의존성
   1. cage.env.js
   2. cage.lang.js

```
/*
	네임스페이스가 존재하지 않는 경우 생성, 존재하는 경우 참조값 반환
	네임스페이스 확보를 편하게 하기위해 static 메소드 생성
*/
static Object namespace ( property-package )

parameters
 - property-package: <String> 생성할 객체 프로퍼티의 문자열 이름

return
 - Object: 마지막 생성된 객체의 참조
 - 실패시 null

```

```
/*	
	log메소드 메시지 출력
	interface화하여 상황에 따라 출력방법을 바꿀 수 있도록 유연성 확보
*/
static Boolean log ( msg )

parameters
 - msg: <String> 출력할 메시지 내용
 
return
 - 성공시 true
 - 실패시 false
```

```
/*
	
*/
static void register ( name, mainClass, data );

parameters
  - name
  - mainClass
  - data
  
return
  - 성공: 
  - 실패:  
```


-----

### cage.env.js
