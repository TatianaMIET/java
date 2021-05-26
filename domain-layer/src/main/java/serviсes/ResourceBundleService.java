package serviсes;

import entity.ResourceBundle;
import entity.ResourceMessage;
import persistence.ResourceBundleDAO;

import javax.inject.Inject;
import java.util.List;

public class ResourceBundleService {


    public List<ResourceMessage> getResourceBundle(String lang) {
        ResourceBundle resourceBundle = resourceBundleDAO.read(lang);

        if (resourceBundle != null)
            return resourceBundle.getMessages();

        //TODO: Бросать ошибку, что локаль не найдена
        // Добавить после реализации возврата своих ошибок
        return null;
    }


    @Inject
    private ResourceBundleDAO resourceBundleDAO;

}
