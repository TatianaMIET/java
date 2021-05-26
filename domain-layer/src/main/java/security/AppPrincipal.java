package security;

import javax.enterprise.inject.Alternative;
import java.security.Principal;
import java.time.LocalDate;

@Alternative
public class AppPrincipal implements Principal {


    public AppPrincipal() {
        this.birthDay = null;
        this.email = null;
        this.name = null;
        this.phoneNumber = null;
        this.surname = null;
        this.userId = 0;
    }

    public AppPrincipal(int userId, String name, String surname, LocalDate birthDay, String email, String phoneNumber) {
        this.userId = userId;
        this.name = name;
        this.surname = surname;
        this.birthDay = birthDay;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    @Override
    public String getName() {
        return name;
    }

    public int getUserId() {
        return userId;
    }

    public String getSurname() {
        return surname;
    }

    public LocalDate getBirthDay() {
        return birthDay;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public boolean isInRole(String role) {
        return true;
    }

    private final int userId;
    private final String name;
    private final String surname;
    private final LocalDate birthDay;
    private final String email ;
    private final String phoneNumber;

}
