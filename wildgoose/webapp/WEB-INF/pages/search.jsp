<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<!DOCTYPE html>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-zoom=1, user-scalable=no">

<link type="text/css" rel="stylesheet" href="/stylesheet/base.css" />
<link type="text/css" rel="stylesheet" href="/stylesheet/basic_layout.css" />
<link type="text/css" rel="stylesheet" href="/stylesheet/search.css" />
<link type="text/css" rel="stylesheet" href="/stylesheet/card.css" />
<link type="text/css" rel="stylesheet" href="/stylesheet/card-media.css" />

<title>Wildgoose</title>

<div class="wrap">
	<header class="header">
		<%@ include file ="/WEB-INF/pages/header.jsp" %>
	</header>
	<div class="container">
		<div class="logo">
			<a href="/"><img src="image/logo.png" alt="wildgoose logo" class="logo-image"/></a>
		</div>
		<div class="search search-column">
			<form class="search_form" action="./search" method="get">
			<ul class="search-column-box">
				<li class="search-query-entry">
					<input type="search" id="query-entry" autocomplete="off" name="q" placeholder="기자 검색" value="${ requestScope.data.searchQuery }" />
				</li>
				<li class="search-button">
					<input type="submit" id="search-action" value ="검색"/>
				</li>
			</ul>
			<%-- 자동완성 --%>
			<ul class="auto-completion-list"></ul>
			</form>
		</div>
		<div class="search-result">
			<ul>
				<c:choose>

				<%-- message 존재시 --%>
				<c:when test="${ requestScope.data.status == 500 }">
					<span>${ requestScope.data.message }</span>
				</c:when>

				<%-- searchQuery 존재시 --%>
				<c:when test="${ not empty requestScope.data.searchQuery }">
					<c:if test="${ empty requestScope.data.reporters }">
					<span>${ requestScope.data.searchQuery }에 대한 검색 결과가 없습니다.</span>
					</c:if>
					<%-- searchResult 표시부 --%>
					<c:forEach var="reporter" items="${ requestScope.data.reporters }" ><li class="card card-reporter">
						<%@ include file = "/WEB-INF/templates/jsp/reporterCard.jsp" %>
					</li></c:forEach>
				</c:when>

				</c:choose>
			</ul>
		</div>
		<%-- searchQuery 존재시 and 검색 결과가 더 많을 때 --%>
		<c:if test = "${ not empty requestScope.data.searchQuery }" >
		<div class="search-more">
			<button class="search-button-ajax">더보기</button>
			<div class="search-state search-state-hidden">
				<span class="state-search-curNum hidden">${ requestScope.data.reporters.size() }</span>
				<span class="state-search-query hidden">${ requestScope.data.searchQuery }</span>
				<span class="state-search-totalNum hidden">${ requestScope.data.totalNum }</span>
			</div>
		</div>
		</c:if>
		<c:if test="${ initParam.debuggerMode eq 'on' }">
			mode on
		</c:if>
	</div>
	<footer class="footer"></footer>
</div>
<c:choose>
	<c:when test="${ initParam.debuggerMode eq 'on' }">
		<script type="text/javascript" src="/scripts/WILDGOOSE/user/WILDGOOSE.user.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/ui/WILDGOOSE.ui.favorite.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/more/WILDGOOSE.more.super_type.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/more/WILDGOOSE.more.search.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/search/WILDGOOSE.search.auto_complement.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/search/WILDGOOSE.search.submit.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/search/WILDGOOSE.search.js"></script>
				
		<script type="text/javascript" src="/scripts/APP/APP.page.search.js"></script>
	</c:when>
	<c:otherwise>
		<script type="text/javascript" src="/scripts/CAGE/src/CAGE.min.js"></script>
		<script type="text/javascript" src="/scripts/WILDGOOSE/WILDGOOSE.min.js"></script>
		<script type="text/javascript" src="/scripts/APP/APP.min.js"></script>
	</c:otherwise>
</c:choose>

<script>
window.addEventListener("load", function(evt){
	APP.page.search.init();
}, false);
</script>
