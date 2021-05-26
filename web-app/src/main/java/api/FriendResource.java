package api;


import codes.ResultCode.ResultCodes;
import collections.DozerUtilities;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.collect.ImmutableMap;
import model.FriendModel;
import org.dozer.Mapper;
import security.AppPrincipal;
import serviсes.FriendService;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@RequestScoped
@Path("/friends")
public class FriendResource {

    @POST
    @Path("/make-friends")
    @Produces(MediaType.APPLICATION_JSON)
    public Object makeFriends(String friendId){

        int intFriendId = Integer.parseInt(friendId);
        friendService.makeFriends(intFriendId, principal.getUserId());

        return ImmutableMap.of("resultCode", ResultCodes.SUCCESSFUL);
    }

    @GET
    @Path("/get-all-friends")
    @Produces(MediaType.APPLICATION_JSON)
    public Object getAllFriends(){

        List<FriendModel> friends = DozerUtilities.map(mapper, friendService.getAllFriends(principal.getUserId()), FriendModel.class);

        return ImmutableMap.of("resultCode", ResultCodes.SUCCESSFUL,
                "friends", friends);
    }

    @POST
    @Path("/set-new-status/{status}")
    @Produces(MediaType.APPLICATION_JSON)
    public Object setNewStatus(@PathParam("status") int status, String friendId){

        int id = Integer.parseInt(friendId);

        if (friendService.setFriendStatus(status, principal.getUserId(), id) == ResultCodes.GENERIC_ERROR){
            return ImmutableMap.of("resultCode", ResultCodes.GENERIC_ERROR);
        }
        return ImmutableMap.of("resultCode", ResultCodes.SUCCESSFUL);
    }

    @GET
    @Path("/get-only-friends")
    @Produces(MediaType.APPLICATION_JSON)
    public Object getOnlyFriends(){

        List<FriendModel> friends = DozerUtilities.map(mapper, friendService.getOnlyFriends(principal.getUserId()), FriendModel.class);

        return ImmutableMap.of("resultCode", ResultCodes.SUCCESSFUL,
                "friends", friends);

    }

    @Inject
    private FriendService friendService;

    @Inject
    private AppPrincipal principal;

    @Inject
    private Mapper mapper;

    @Inject
    private ObjectMapper objectMapper;
}
