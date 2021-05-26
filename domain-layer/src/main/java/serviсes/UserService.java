package serviсes;

import codes.ResultCode.ResultCodes;
import entity.User;
import org.apache.commons.lang3.StringUtils;
import persistence.UserDAO;

import javax.inject.Inject;
import java.util.List;


public class UserService {



    public User getUser(int id) {
        return userDAO.read(id);
    }

    public int createUser(User user) {

        User newUser = userDAO.readByEmail(user.getEmail());
        if (newUser == null) {
            userDAO.add(user);
            return ResultCodes.SUCCESSFUL;
        } else
            return ResultCodes.IS_REGISTERED;
    }

    public User readByEmail(String email) {
        return userDAO.readByEmail(email);
    }

    public boolean checkUser(String login, String password) {

        if (StringUtils.isEmpty(password)
                && StringUtils.isEmpty(login))
            return false;

        User user = userDAO.readByEmail(login);
        //TODO сдедать возврат кода ошибки
        return user != null && user.getPassword().equals(password);
    }

    public List<User> getAllUsers(int id) {
        return userDAO.getAllUsers(id);
    }

    @Inject
    private UserDAO userDAO;
}
