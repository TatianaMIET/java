package converter;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.deser.std.StdScalarDeserializer;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.StdScalarSerializer;
import org.apache.commons.lang3.StringUtils;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Java8TimeModule extends SimpleModule {

	private static final long serialVersionUID = 1L;
	
	public Java8TimeModule() {			
		
		addSerializer(LocalDateTime.class, new StdScalarSerializer<LocalDateTime> (LocalDateTime.class) {
			 
			private static final long serialVersionUID = 1L;

			@Override
			public void serialize(LocalDateTime value, JsonGenerator gen, SerializerProvider provider)
					throws IOException {
				if(value != null) {
					gen.writeString(value.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
				} else {
					gen.writeNull();
				}
			}
		 });
		
		 addDeserializer(LocalDateTime.class, new StdScalarDeserializer<LocalDateTime> (LocalDateTime.class) {
			 
			 private static final long serialVersionUID = 1L;
			 
			 public LocalDateTime deserialize(JsonParser p, DeserializationContext ctxt)
					 throws IOException, JsonProcessingException {
				 if (p.getCurrentToken() == JsonToken.VALUE_STRING) {
					 final String localDateAsString = p.getValueAsString();
					 if(StringUtils.isNotEmpty(localDateAsString)) {
						 final LocalDateTime parsedDate =
								 LocalDateTime.parse(localDateAsString, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
						 return parsedDate;
					 }
				 }
				 return null;
			 }
		 });
		
	}
}
