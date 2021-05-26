package serviсes;


import codes.FriendCodes.FriendCodes;
import codes.ResultCode.ResultCodes;
import com.google.common.collect.ImmutableMap;
import entity.Friend;
import entity.User;
import persistence.FriendDAO;
import persistence.UserDAO;

import javax.inject.Inject;
import java.util.List;

public class FriendService {

    public Object makeFriends(int friendId, int userId){

        User user = userDAO.read(userId);
        User friend = userDAO.read(friendId);

        //добавляем запись к текущему юзеру что мы подписались на какого-то пользователя
        friendDAO.add(new Friend(friend, FriendCodes.SUBSCRIBER, userId));
        //добавляем запись к другому пользователю, что мы подали заявку в друзья к нему
        friendDAO.add(new Friend(user, FriendCodes.REQUEST, friendId));

        return ImmutableMap.of("resultCodes", ResultCodes.SUCCESSFUL);
    }


    public List<Friend> getAllFriends(int userId){

        return friendDAO.getFriends(userId);
    }

    public List<Friend> getOnlyFriends(int userId) {

        return friendDAO.getOnlyFriends(userId);
    }

    public int setFriendStatus(int status, int userId, int friendId){

        try {
            friendDAO.setStatus(status, userId, friendId);
            return ResultCodes.SUCCESSFUL;
        }
        catch (ArithmeticException e){
            return ResultCodes.GENERIC_ERROR;
        }
    }




    @Inject
    FriendDAO friendDAO;

    @Inject
    UserDAO userDAO;


}
