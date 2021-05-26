package security;

import java.io.IOException;
import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

import javax.annotation.Priority;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.inject.Named;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.ConstrainedTo;
import javax.ws.rs.Priorities;
import javax.ws.rs.RuntimeType;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.container.PreMatching;
import javax.ws.rs.core.Context;
import javax.ws.rs.ext.Provider;

import org.apache.commons.lang3.StringUtils;

import com.fasterxml.jackson.databind.util.ISO8601DateFormat;
import org.jasypt.encryption.pbe.PBEStringEncryptor;

/**
 * Фильтр web-запроса для аутентификации пользователей с помощью зашифрованного cookie.
 */
@Provider
@Dependent
@PreMatching
@ConstrainedTo(RuntimeType.SERVER)
@Priority(Priorities.AUTHENTICATION)
public class CookieAuthenticationFilter implements ContainerRequestFilter, ContainerResponseFilter {

    /**
     * Свойство запроса - установка дополнительных cookie в ответ.
     */
    public static final String RESPONSE_COOKIES_PROPERTY = CookieAuthenticationFilter.class + ".responseCookies";

    @Override
    public void filter(final ContainerRequestContext context) {

        final javax.ws.rs.core.Cookie authCookie = context.getCookies().get("authFriends");
        final String authValue = authCookie != null ? authCookie.getValue() : StringUtils.EMPTY;


        if (!StringUtils.isEmpty(authValue)) {

            final String[] parts;
            try {
                parts = encryptorProvider.get().decrypt(authValue).split("\0");
            } catch (Throwable e) {
                return;
            }
            if (parts.length == 3) {
                Date date = null;
                try {
                    date = new ISO8601DateFormat().parse(parts[2]);

                    if (date.getTime() + TimeUnit.SECONDS.toMillis(7 * 24 * 60 * 60) > new Date().getTime()) {
                        String userName = serviceProvider.setupSecurityContext(context, parts[0], parts[1], date);
                    }
                } catch (ParseException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext)
            throws IOException {
        @SuppressWarnings("unchecked") final List<Cookie> cookies = (List<Cookie>) requestContext.getProperty(RESPONSE_COOKIES_PROPERTY);
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (!responseContext.getCookies().containsKey(cookie.getName())) {
                    response.addCookie(cookie);
                }
            }
        }
    }


    @Inject
    @Named(AuthorizationServiceImpl.ENCRYPT_NAME)
    private Instance<PBEStringEncryptor> encryptorProvider;

    @Inject
    private AuthorizationServiceImpl serviceProvider;

    @Context
    private HttpServletResponse response;

}