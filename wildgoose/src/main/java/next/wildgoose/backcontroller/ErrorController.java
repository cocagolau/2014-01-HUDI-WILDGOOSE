package next.wildgoose.backcontroller;

import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Component;

import next.wildgoose.dto.result.SimpleResult;
import next.wildgoose.framework.BackController;
import next.wildgoose.framework.Result;

@Component("error")
public class ErrorController implements BackController {

	@Override
	public Result execute(HttpServletRequest request) {
		ServletContext context = request.getServletContext();
		Map<Integer, String> errorCodeMap = (Map<Integer, String>)context.getAttribute("errorCodeMap");
		
		Result result = new SimpleResult();
		result.setStatus(404);
		result.setMessage(errorCodeMap.get(404));
		return result;
	}

}