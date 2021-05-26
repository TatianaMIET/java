package security;

import com.fasterxml.jackson.databind.util.ISO8601DateFormat;
import org.apache.commons.codec.binary.Base64;
import org.jasypt.encryption.pbe.PBEStringEncryptor;

import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.security.SecureRandom;
import java.util.Date;

/**
 * Сервис для работы с Cookie
 */
@Dependent
public class CookieAuthenticationService {


    public CookieAuthenticationService(){}

    /**
     * Добавление cookies к ответу
     *
     * @param response - ответ с добавленым Cookie
     * @param data - данные зашифрованные в Cookie
     *
     */
    public void addCookieTicket(HttpServletResponse response, String data) {

        //Формирование "Соли"
        final SecureRandom secureRandom = new SecureRandom();
        final byte[] saltBytes = new byte[20];
        secureRandom.nextBytes(saltBytes);
        final String salt = Base64.encodeBase64String(saltBytes);

        //Текущая дата
        String nowDate = new ISO8601DateFormat().format(new Date());


        final Cookie authCookies = new Cookie(
                "authFriends",
                encryptorProvider.get().encrypt(salt + "\0" + data + "\0" + nowDate));

        authCookies.setPath("/");
        //Cookies нельзя получить из JavaScript
        authCookies.setHttpOnly(true);
        //TODO: перенести в config
        authCookies.setMaxAge(7*24*60*60);

        response.addCookie(authCookies);

    }

    public HttpServletResponse logout(HttpServletRequest request, HttpServletResponse response){

        Cookie[] cookies = request.getCookies();
        if (cookies != null)
            for (Cookie cookie : cookies) {
                cookie.setValue("");
                cookie.setPath("/");
                cookie.setMaxAge(0);
                response.addCookie(cookie);
            }
        return response;
    }

    @Inject
    @Named(AuthorizationServiceImpl.ENCRYPT_NAME)
    private Instance<PBEStringEncryptor> encryptorProvider;
}
