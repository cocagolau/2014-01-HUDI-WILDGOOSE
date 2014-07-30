package next.wildgoose.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import next.wildgoose.dao.ReporterDAO;
import next.wildgoose.dto.Reporter;
import next.wildgoose.framework.Controller;
import next.wildgoose.framework.utility.Utility;
import next.wildgoose.utility.Constants;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component("search")
public class SearchController implements Controller {
	
	@Autowired
	private ReporterDAO reporterDao;
	
	@Override
	public String execute(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model) {
		String searchQuery = request.getParameter("q");
		boolean autoComplete = (request.getParameter("autocomplete") != null)? Boolean.parseBoolean(request.getParameter("autocomplete")) : false;
		int howMany = (request.getParameter("how_many") != null)? Integer.parseInt(request.getParameter("how_many")) : Constants.NUM_OF_CARDS;
		int startItem = (request.getParameter("start_item") != null)? Integer.parseInt(request.getParameter("start_item")) : -1;
		String view = null;
		
		// 결과 반환
		// 에러 혹은 root인 경우 반환
		model.put("pageName", "home");
		
		view = checkQuery(searchQuery, model);
		if (view != null) {
			
			return view;
			
		}
		
		// 자동완성 반환
		if (autoComplete) {
			view = getAutoCompleteResult(request, response, model, searchQuery, howMany);
			
			return view;
			
		// 결과를 특정 부분부터 반환
		} else if (startItem != -1) {
			view = getSearchResult(request, response, model, searchQuery, startItem, howMany);
			
			return view;
			
		// 결과를 처음부터 반환
		} else {
			view = getSearchResult(request, response, model, searchQuery, howMany);
			
			return view;
			
		}
		
	}
	
	private String checkQuery(String searchQuery, Map<String, Object> model) {
		int status = 500;
		String message = "failure";
		
		if (searchQuery == null) {			
			status = 200;
			message = "OK";
			
			model.put("status", status);
			model.put("message", message);
			
			return "search";

		}
				
		// searchQuery 에러 검사
		searchQuery.replaceAll("%", "");
		String trimmedQuery = searchQuery.trim();
		if ("".equals(trimmedQuery)) {
			status = 400;
			message = Constants.MSG_WRONG_QUERY;
			
			model.put("status", status);
			model.put("message", message);
			
			return "search";
			
		}
		
		return null;
		
	}
		
	
	private String getAutoCompleteResult(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model, String searchQuery, int howMany) {
		int status = 200;
		String message = "OK";
		List<Reporter> reporters = reporterDao.getSimilarNames(searchQuery, howMany);
		
		model.put("status", status);
		model.put("message", message);
		model.put("reporters", reporters);
		model.put("searchQuery", searchQuery);
		
		return null;
		
	}
		
	
	private String getSearchResult (HttpServletRequest request, HttpServletResponse response, Map<String, Object> model, String searchQuery, int start, int howMany) {
		int status = 200;
		String message = "OK";
		List<Reporter> reporters = null;
		
		if (start == 0) {
			int numOfResult = getNumOfResult(reporterDao, searchQuery);
			
			model.put("totalNum", numOfResult);
		}
		
		reporters = getReporters(reporterDao, searchQuery, start, howMany);
		
		model.put("status", status);
		model.put("message", message);
		model.put("reporters", reporters);
		model.put("searchQuery", searchQuery);
		
		return "search";
		
	}
	

	private String getSearchResult(HttpServletRequest request, HttpServletResponse response, Map<String, Object> model, String searchQuery, int howMany) {
		
		return this.getSearchResult(request, response, model, searchQuery, 0, howMany);
		
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
}
	

