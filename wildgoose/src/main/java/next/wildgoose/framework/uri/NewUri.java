package next.wildgoose.framework.uri;

import javax.servlet.http.HttpServletRequest;

import next.wildgoose.framework.utility.Uri;

public class NewUri {
	
//	public Uri analyze(HttpServletRequest request) {
//		
//		
//		RequestUri requestUri = new RequestUri();
//		String uri = request.getRequestURI();
//		String trimmedUri = trimUri(requestUri, uri);
//		
//		
////		return new Uri(request);
//	}
//	
//	private String trimUri (RequestUri requestUri, String uri) {
//		int startIdx = 0;
//		int endIdx = uri.length();
//		
//		if ("/".equals(uri)) {
//			return "";
//		}
//		if (uri.indexOf('/') == 0) {
//			startIdx++;
//		}
//		if (uri.startsWith("/api/v1/")) {
//			requestUri.setAPI();
//			startIdx += 7;
//		}
//		if (uri.lastIndexOf('/') == endIdx-1) {
//			endIdx--;
//		}
//		return uri.substring(startIdx, endIdx);
//	}
}
