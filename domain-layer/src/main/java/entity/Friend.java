package entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;


@Entity
@NamedQueries({
        @NamedQuery(name = "Friend.getAllFriends", query = "SELECT f FROM Friend f WHERE f.userId = :id"),
        @NamedQuery(name = "Friend.setFriendStatus", query = "SELECT f FROM Friend f WHERE f.userId = :userId AND f.friend.userId = :friendId"),
        @NamedQuery(name = "Friend.getOnlyFriends", query = "SELECT f FROM Friend f WHERE f.userId = :id AND f.status = 0")
})
@Table(name = "friends")
public class Friend {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "friend_id", referencedColumnName = "id")
    @JsonManagedReference
    private User friend;

    @Column(name = "status")
    private int status;

    @Column(name = "user_id")
    private int userId;

    public Friend() {
    }

    public Friend(User friend, int status, int user) {
        this.friend = friend;
        this.status = status;
        this.userId = user;
    }

    public int getId() {
        return id;
    }

    public User getFriend() {
        return friend;
    }

    public void setFriend(User friends) {
        this.friend = friends;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int user) {
        this.userId = user;
    }
}
