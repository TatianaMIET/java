package persistence;

import com.google.common.collect.Iterables;
import entity.ResourceBundle;

public class ResourceBundleDAO extends BaseDAO<java.util.ResourceBundle> {

    public ResourceBundle read(String lang){

        return Iterables.getOnlyElement(entities
                .createNamedQuery("ResourceBundle.findByLang", ResourceBundle.class)
                .setParameter("lang", lang)
                .getResultList(), null);
    }

}
