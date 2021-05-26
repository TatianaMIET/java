package model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateSerializer;

import java.time.LocalDate;

public class AuthenticationModel {


/*    public AuthenticationModel(){}

    public AuthenticationModel(int userId, String name, String surname, Date birthDay, String email, String phoneNumber) {
        this.userId = userId;
        this.name = name;
        this.surname = surname;
        this.birthDay = birthDay;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }*/

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

    private int userId;
    private String name;
    private String surname;

    @JsonSerialize(using = LocalDateSerializer.class)
    private LocalDate birthDay;
    private String email ;
    private String phoneNumber;

}
