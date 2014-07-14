<%@ page language="java" contentType="text/html; charset=UTF-8"%>
<%@taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<div class="card-section card-section-article">
	<a href="${ article.url }" target="_blank"><span></span></a>
	<div class="article-title">
		<h1>${ article.title }</h1>
	</div>
	<div class="article-preview">
		<p>${ article.content }</p>
	</div>
</div>
<div class="card-section card-section-footer">
	<a href="/reporters/${ article.authorId }"><span>${ article.name } 기자</span></a>
	<c:set var="date" value="${fn:split(article.datetime, ' ')}" />
	의 ${ date[0] }일자 기사입니다
</div>
