package next.wildgoose.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import next.wildgoose.dao.ReporterDAO;
import next.wildgoose.dto.Reporter;
import next.wildgoose.dto.result.Result;
import next.wildgoose.dto.result.SearchResult;
import next.wildgoose.framework.Controller;
import next.wildgoose.framework.utility.Utility;
import next.wildgoose.utility.Constants;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("search")
public class SearchController implements Controller {
	
	private static final Logger LOGGER = LoggerFactory.getLogger(SearchController.class.getName());
	
	@Autowired
	private ReporterDAO reporterDao;
	
	@Override
	public Result execute(HttpServletRequest request) {
		String searchQuery = request.getParameter("q");
		boolean autoComplete = (request.getParameter("autocomplete") != null)? Boolean.parseBoolean(request.getParameter("autocomplete")) : false;
		int howMany = (request.getParameter("how_many") != null)? Integer.parseInt(request.getParameter("how_many")) : Constants.NUM_OF_CARDS;
//		int startPage = (request.getParameter("start_page") != null)? Integer.parseInt(request.getParameter("start_page")) : -1;
		int startItem = (request.getParameter("start_item") != null)? Integer.parseInt(request.getParameter("start_item")) : -1;
		
		SearchResult searchResult = checkQuery(searchQuery);
		// 결과 반환
		// 에러 혹은 root인 경우 반환
		if (searchResult != null) {
			searchResult.setPageName("home");
			return searchResult;
		}
		if (autoComplete) {
			// 자동완성 반환
			LOGGER.debug("searchQuery: " + searchQuery + ", autocompete: " + request.getParameter("autocomplete"));
			searchResult = getAutoCompleteResult(request, searchQuery, howMany);
			
		} else if (startItem != -1) {
			// 결과를 특정 부분부터 반환
			searchResult = getSearchResult(request, searchQuery, startItem, howMany);
			
		} else {
			// 결과를 처음부터 반환
			searchResult = getSearchResult(request, searchQuery, howMany);
		}
		searchResult.setPageName("home");
		
		return searchResult;
	}
	
	
	private SearchResult getAutoCompleteResult(HttpServletRequest request, String searchQuery, int howMany) {
		SearchResult searchResult = new SearchResult();
		LOGGER.debug("searchQueru: " + searchQuery + ",  howMany: " + howMany);

		List<Reporter> reporters = reporterDao.getSimilarNames(searchQuery, howMany);
		
		searchResult.setStatus(200);
		searchResult.setMessage("OK");
		searchResult.setReporters(reporters);
		searchResult.setSearchQuery(searchQuery);
		
		return searchResult;
		
	}
	
	private SearchResult getSearchResult (HttpServletRequest request, String searchQuery, int start, int howMany) {
		SearchResult searchResult = new SearchResult();
		List<Reporter> reporters = null;
		
		if (start == 0) {
			int numOfResult = getNumOfResult(reporterDao, searchQuery);
			searchResult.setTotalNum(numOfResult);
		}
		
		reporters = getReporters(reporterDao, searchQuery, start, howMany);
		searchResult.setStatus(200);
		searchResult.setMessage("OK");
		searchResult.setReporters(reporters);
		searchResult.setSearchQuery(searchQuery);
		
		return searchResult;
	}

	private SearchResult getSearchResult(HttpServletRequest request, String searchQuery, int howMany) {
		
		return getSearchResult(request, searchQuery, 0, howMany);
	}
	
	
	private int getNumOfResult(ReporterDAO reporterDao, String searchQuery) {
		String type = null;
		
		// searchQuery의 검색 type설정
		type = Utility.isURL(searchQuery) ? "url" : "name";

		return reporterDao.findNumberOfReportersByType(type, searchQuery);
	}
	

	private List<Reporter> getReporters(ReporterDAO reporterDao, String searchQuery, int start, int howMany) {
		String type = null;
		
		// searchQuery의 검색 type설정
		type = Utility.isURL(searchQuery) ? "url" : "name";

		return reporterDao.findReportersByType(type, searchQuery, start, howMany);
	}
	
	private SearchResult checkQuery(String searchQuery) {
		SearchResult searchResult = null;
		
		if (searchQuery == null) {
			searchResult = new SearchResult();
			searchResult.setStatus(200);
			searchResult.setMessage("OK");
			return searchResult;
		}
				
		// searchQuery 에러 검사
		searchQuery.replaceAll("%", "");
		String trimmedQuery = searchQuery.trim();
		if ("".equals(trimmedQuery)) {
			searchResult = new SearchResult();
			searchResult.setMessage(Constants.MSG_WRONG_QUERY);
			return searchResult;
		}
		
		return null;
	}
}
