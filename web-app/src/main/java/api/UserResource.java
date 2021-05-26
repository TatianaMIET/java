package api;

import codes.ResultCode.ResultCodes;
import collections.DozerUtilities;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableMap;
import entity.User;
import model.AuthenticationModel;
import model.LoginModel;
import model.ManModel;
import model.UserInfoModel;
import org.apache.log4j.Logger;
import org.dozer.Mapper;
import security.AppPrincipal;
import security.CookieAuthenticationService;
import serviсes.UserService;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.util.List;

@RequestScoped
@Path("/home")
public class UserResource {

    @GET
    @Path("/get-profile")
    @Produces(MediaType.APPLICATION_JSON)
    public UserInfoModel getUser() {

        UserInfoModel user =
                mapper.map(userService.getUser(principal.getUserId()), UserInfoModel.class);
        return user;
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Object authenticate(LoginModel model, @Context HttpServletResponse response)
            throws IOException {
        log.info("authenticate, login:" + model.getEmail());

        //Проверка пользователя по логину и паролю
        if (!userService.checkUser(model.getEmail(), model.getPassword())) {
            return ImmutableMap.of("codes/ResultCode", ResultCodes.RESULT_FORBIDDEN,
                    "ResultText", "Неверный логин или пароль");
        }

        //Успешно
        final User user = userService.readByEmail(model.getEmail());
        UserInfoModel userInfoModel = mapper.map(user, UserInfoModel.class);
        AuthenticationModel authenticationModel = mapper.map(user, AuthenticationModel.class);

        cookieAuthenticationService
                .addCookieTicket(response, objectMapper.writeValueAsString(authenticationModel));

        userInfoModel.setResultCode(0);
        userInfoModel.setResultText("OK");

        return userInfoModel;
    }

    @GET
    @Path("/get-all-people")
    @Produces(MediaType.APPLICATION_JSON)
    public Object getAllPeople(){

        List<ManModel> people =
                DozerUtilities.map(mapper, userService.getAllUsers(principal.getUserId()), ManModel.class);

        return ImmutableMap.of("people", people,
                "resultCode", ResultCodes.SUCCESSFUL,
                "resultText", "OK");
    }



    @Inject
    private AppPrincipal principal;

    @Inject
    private Mapper mapper;

    @Inject
    private UserService userService;

    @Inject
    private ObjectMapper objectMapper;

    @Inject
    private CookieAuthenticationService cookieAuthenticationService;

    private static final Logger log = Logger.getLogger(UserResource.class);
}
