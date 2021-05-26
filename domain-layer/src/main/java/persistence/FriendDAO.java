package persistence;

import codes.FriendCodes.FriendCodes;
import entity.Friend;

import java.util.List;

public class FriendDAO extends BaseDAO<Friend> {

    public List<Friend> getFriends(int userId) {

        return entities.createNamedQuery("Friend.getAllFriends", Friend.class)
                .setParameter("id", userId)
                .getResultList();
    }

    public List<Friend> getOnlyFriends(int id){

        return entities.createNamedQuery("Friend.getOnlyFriends", Friend.class)
                .setParameter("id", id)
                .getResultList();
    }

    public void setStatus(int status, int userId, int friendId) {

        //получение строки где юзер текущий пользователь
        Friend user = entities.createNamedQuery("Friend.setFriendStatus", Friend.class)
                .setParameter("userId", userId)
                .setParameter("friendId", friendId)
                .getSingleResult();

        //получение строки где пользователь это друг
        Friend friend = entities.createNamedQuery("Friend.setFriendStatus", Friend.class)
                .setParameter("userId", friendId)
                .setParameter("friendId", userId)
                .getSingleResult();


        switch (status){
            case 0: {
                user.setStatus(FriendCodes.REQUEST);
                friend.setStatus(FriendCodes.SUBSCRIBER);
                break;
            }
            case 1: {
                entities.remove(user);
                entities.remove(friend);
                break;
            }
            case 2: {
                user.setStatus(FriendCodes.FRIEND);
                friend.setStatus(FriendCodes.FRIEND);
                break;
            }
            default:{
                throw new ArithmeticException("Неверный статус");
            }
        }

        entities.getTransaction().begin();
        entities.getTransaction().commit();

    }
}
