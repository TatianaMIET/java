package controller;


import codes.ResultCode.ResultCodes;
import com.google.common.collect.ImmutableMap;
import entity.User;
import model.RegistrationModel;
import org.dozer.Mapper;
import security.CookieAuthenticationService;
import serviсes.UserService;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

@RequestScoped
@Path("/")
public class RootController {


    @GET
    @Produces(MediaType.TEXT_HTML)
    public Object getMainPage(@Context HttpServletRequest request, @Context HttpServletResponse response)
            throws ServletException, IOException {

        RequestDispatcher view =
                request.getRequestDispatcher("/index.html");
        view.forward(request, response);

        return response;
    }


    @GET
    @Path("/logout")
    public Response logout(@Context HttpServletRequest request, @Context HttpServletResponse response) throws URISyntaxException {

        cookieAuthenticationService.logout(request, response);

        return Response.temporaryRedirect(new URI("/")).build();
    }

    @POST
    @Path("/registration")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Object registration(RegistrationModel registrationModel) {

        User newUser = mapper.map(registrationModel,  User.class);
        if (userService.createUser(newUser) == ResultCodes.SUCCESSFUL){
            return ImmutableMap.of("resultCode", ResultCodes.SUCCESSFUL,
                    "resultText", "OK");
        }
        else {
            return ImmutableMap.of("resultCode", ResultCodes.IS_REGISTERED,
                    "resultText", "Пользователь уже зарегистрирован!");
        }
    }

    @Inject
    CookieAuthenticationService cookieAuthenticationService;

    @Inject
    UserService userService;

    @Inject
    Mapper mapper;

}
