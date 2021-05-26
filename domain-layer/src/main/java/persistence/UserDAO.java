package persistence;

import com.google.common.collect.Iterables;
import entity.User;

import java.util.List;

public class UserDAO extends BaseDAO<User> {

    public User read(int id) {

        return entities.find(User.class, id);
    }

    public void create(User user) {

        add(user);
    }


    public User readByEmail(String email) {
        return Iterables.getOnlyElement(entities
                .createNamedQuery("User.findByEmail", User.class)
                .setParameter("email", email)
                .getResultList(), null);
    }

    public List<User> getAllUsers(int id) {
         return entities.createNamedQuery("User.getAllPeople",  User.class)
                 .setParameter("id", id)
                 .getResultList();
    }
}
