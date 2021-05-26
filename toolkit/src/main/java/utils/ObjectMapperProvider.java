package utils;

import com.fasterxml.jackson.databind.ObjectMapper;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;
import javax.ws.rs.ext.ContextResolver;
import javax.ws.rs.ext.Provider;

/**
 * Настроенный {@link ObjectMapper} для использования в JAX-RS.
 */
@Provider
@Dependent
public class ObjectMapperProvider implements ContextResolver<ObjectMapper> {

    @Inject
    private ObjectMapper objectMapper;
	
	public ObjectMapperProvider() {
	}
	
	public ObjectMapperProvider(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}
	
    @Override
    public ObjectMapper getContext(Class<?> type) {
        return objectMapper;
    }
}