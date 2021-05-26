package utils;

import org.apache.log4j.Logger;

import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Produces;
import javax.enterprise.inject.spi.InjectionPoint;

@Dependent
public class LoggerProducer {

    @Produces
    private Logger getLogger(InjectionPoint injectionPoint){
        return Logger.getLogger(injectionPoint.getMember().getDeclaringClass().getName());
    }
}
