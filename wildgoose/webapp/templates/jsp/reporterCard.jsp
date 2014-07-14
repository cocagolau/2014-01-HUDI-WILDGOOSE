<div class="card-section card-section-identity" data-reporter_id="${reporter.id}" >
	<h3 class="name">
		<a href="/reporters/${ reporter.id }">${ reporter.name }</a>
	</h3>
	<p class="email">${ reporter.email }</p>
	<div class="favorite"><div class="star<c:if test="${ empty sessionScope.userId }"> invisible</c:if>"></div></div>

	<div class="${ reporter.pressName } press-tag"></div>
</div>
<div class="card-section card-section-headline">
	<h4 class="headline">${ reporter.articleTitle }</h4>
</div>