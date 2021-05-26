package entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@NamedQueries({
        @NamedQuery(name = "User.findByEmail", query = "SELECT e FROM User e WHERE e.email = :email"),
        @NamedQuery(name = "User.getAllPeople", query = "SELECT e FROM User e WHERE e.id NOT IN (SELECT f.friend.id FROM Friend f WHERE f.userId = :id) AND e.id <> :id")
})

@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_id_seq")
    @SequenceGenerator(name = "users_id_seq", sequenceName = "users_id_seq", allocationSize = 1)
    @Column(name = "id")
    private int userId;

    @Column(name = "username")
    private String name;

    @Column(name = "usersurname")
    private String surname;

    @Column(name = "birthday")
    private LocalDate birthDay;

    @Column(name = "email")
    private String email;

    @Column(name = "phonenumber")
    private String phoneNumber;

    @Column(name = "password")
    private String password;

    @OneToMany(mappedBy = "userId", fetch = FetchType.LAZY, cascade={CascadeType.ALL}, orphanRemoval=true)
    @JsonBackReference
    private List<Task> timetable;

    @OneToMany(mappedBy = "userId", fetch = FetchType.LAZY, cascade={CascadeType.ALL}, orphanRemoval=true)
    @JsonBackReference
    private List<Friend> friends;

    @OneToMany(mappedBy = "userId", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JsonBackReference
    private List<Meeting> meetings;

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public LocalDate getBirthDay() {
        return birthDay;
    }

    public void setBirthDay(LocalDate birthDay) {
        this.birthDay = birthDay;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<Friend> getFriends() {
        return friends;
    }

    public void setFriends(List<Friend> friends) {
        this.friends = friends;
    }

    public List<Task> getTimetable() {
        return timetable;
    }

    public void setTimetable(List<Task> timetable) {
        this.timetable = timetable;
    }

    public List<Meeting> getMeetings() {
        return meetings;
    }

    public void setMeetings(List<Meeting> meetings) {
        this.meetings = meetings;
    }
}

