package next.wildgoose.controller;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import next.wildgoose.framework.utility.Uri;
import next.wildgoose.utility.Constants;

import org.springframework.stereotype.Component;

@Component
public class JspMapping {
	
//	private static final Logger LOGGER = LoggerFactory.getLogger(JspMapping.class.getName());
	private Map<Uri, String> jspMapping = new HashMap<Uri, String>();
	
	public JspMapping() {
		jspMapping.put(new Uri(""), Constants.PAGE_SEARCH);
		jspMapping.put(new Uri("search"), Constants.PAGE_SEARCH);
		jspMapping.put(new Uri("reporters/[reporter_id]"), Constants.PAGE_REPORTERS);
		jspMapping.put(new Uri("me/[user_id]"), Constants.PAGE_ME);
		jspMapping.put(null, Constants.PAGE_ERROR);
	}
	
	public String findJsp(Uri uri) {
		Uri keyUri = findKeyUri(uri);
		
		return this.jspMapping.get(keyUri);
	}
	
	
	private Uri findKeyUri(Uri uri) {
		Set<Uri> keySet = this.jspMapping.keySet();
		Uri keySchema = null;
		Iterator<Uri> schemaIr = keySet.iterator();
		
		while (keySchema == null && schemaIr.hasNext()) {
			Uri schema = schemaIr.next();
			if (schema == null) {
				continue;
			}
			for (int i=schema.size()-1; i>=0; --i) {
				String subSchema = schema.get(i);
				
				if ("*".equals(subSchema)) {
					continue;
				}
				
				if (!subSchema.equals(uri.get(i))) {
					break;
				}
				
				keySchema = schema;
			}
		}
		return keySchema;
	}
	
}
