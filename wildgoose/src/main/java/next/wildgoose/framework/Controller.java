package next.wildgoose.framework;

import javax.servlet.http.HttpServletRequest;

import next.wildgoose.dto.result.Result;

public interface Controller {
	public Result execute(HttpServletRequest request);
}
