package model;

import org.dozer.Mapping;

public class FriendModel {

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    @Mapping("friend.name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    @Mapping("friend.userId")
    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    @Mapping("friend.surname")
    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }


    private int userId;
    private String surname;
    private String name;
    private int status;

}
