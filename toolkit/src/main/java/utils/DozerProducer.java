package utils;

import org.dozer.DozerBeanMapper;

import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class DozerProducer {

        @PreDestroy
        public void destroy() {
            beanMapper.destroy();
        }

        @Produces
        @ApplicationScoped
        public DozerBeanMapper getDozerBeanMapper() {
            List<String> mappingFiles = new ArrayList();
            mappingFiles.add("dozerJdk8Converters.xml");
            beanMapper.setMappingFiles(mappingFiles);
            return beanMapper;
        }

        private final DozerBeanMapper beanMapper = new DozerBeanMapper();
    }

