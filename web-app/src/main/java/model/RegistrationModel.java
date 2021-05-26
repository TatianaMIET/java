package model;

import org.apache.commons.lang3.StringUtils;

import javax.validation.constraints.Future;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;


public class RegistrationModel {

    public RegistrationModel(){}

    public RegistrationModel(String name, String surname, LocalDate birthDay, String email, String phoneNumber, String password) {
        this.name = name;
        this.surname = surname;
        this.birthDay = birthDay;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.password = password;
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

    public void setBirthDay(String birthDay) {

        if(StringUtils.isEmpty(birthDay)) {
            this.birthDay = null;
        }
        this.birthDay = LocalDate.parse(birthDay);
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

    private String name;
    private String surname;
    private LocalDate birthDay;
    private String email ;
    private String phoneNumber;
    private String password;


}
