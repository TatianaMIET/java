package utils;

import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.PersistenceContext;

@ApplicationScoped
public class EntityManagerUtil {


    @PreDestroy
    public synchronized void destroy() {
        entityManagerFactory.close();
    }

    @PersistenceContext
    private static EntityManagerFactory getEntityManagerFactory() {
        if (entityManagerFactory == null) {
            try {
                entityManagerFactory = Persistence.createEntityManagerFactory("page");
            } catch (Exception e) {
                System.out.println(e);
            }

        }
        return entityManagerFactory;
    }

    @Produces
    public static EntityManager getEntityManager() {
        return getEntityManagerFactory().createEntityManager();
    }

    private static EntityManagerFactory entityManagerFactory;
}









