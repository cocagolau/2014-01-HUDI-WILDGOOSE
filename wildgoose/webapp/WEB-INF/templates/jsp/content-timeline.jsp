<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<div class="timeline-result">
	<ul>
		<c:forEach var="article" items="${ requestScope.data.articles }">
		<li class="card">
			<%@ include file = "/WEB-INF/templates/jsp/articleCard.jsp" %>
		</li>
		</c:forEach>
	</ul>
	<div class="article-more">
		<button class="article-button-ajax">더보기</button>
		<div class="article-state article-state-hidden">
			<span class="state-article-curNum hidden">${ requestScope.data.articles.size() }</span>
			<span class="state-article-totalNum hidden">${ requestScope.data.totalNum }</span>
		</div>
	</div>
</div>