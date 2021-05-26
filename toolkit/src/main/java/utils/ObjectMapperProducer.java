package utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import converter.Java8TimeModule;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Produces;

@ApplicationScoped
public class ObjectMapperProducer {


    @Dependent
    @Produces
    private ObjectMapper getMapper() {
        mapper.registerModule(new Java8TimeModule());
        return mapper;
    }

    private ObjectMapper mapper = new ObjectMapper();
}
