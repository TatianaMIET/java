package api;

import codes.ResultCode.ResultCodes;
import com.google.common.collect.ImmutableMap;
import entity.Friend;
import entity.Meeting;
import entity.MeetingInform;
import model.NewMeetingModel;
import org.dozer.Mapper;
import security.AppPrincipal;
import serviсes.MeetingInformService;
import serviсes.MeetingService;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.persistence.Column;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;

@RequestScoped
@Path("/meeting")
public class MeetingResource {

    @GET
    @Path("/get-all-meetings")
    @Produces(MediaType.APPLICATION_JSON)
    public Object getAllMeetings() {

        return ImmutableMap.of("resultCode", ResultCodes.SUCCESSFUL,
                "meetings", meetingService.getAllMeetings(principal.getUserId()));
    }

    @POST
    @Path("/create-new-meeting")
    @Produces(MediaType.APPLICATION_JSON)
    public Object createNewMeeting(NewMeetingModel model) {

        MeetingInform meetingInform = mapper.map(model, MeetingInform.class);
        if (meetingInformService.createNewMeetingInform(meetingInform) == ResultCodes.SUCCESSFUL) {

            List<Meeting> meetings = new ArrayList<>(model.getFriends().size());
            for (int id : model.getFriends()) {
                meetings.add(new Meeting(false, id, meetingInform));
            }
            meetings.add(new Meeting(true, principal.getUserId(), meetingInform));

            if (meetingService.createNewMeeting(meetings) == ResultCodes.SUCCESSFUL)
                return ImmutableMap.of("resultCode", ResultCodes.SUCCESSFUL);
            else return ImmutableMap.of("resultCode", ResultCodes.GENERIC_ERROR);
        } else {
            return ImmutableMap.of("resultCode", ResultCodes.GENERIC_ERROR);
        }
    }

    @POST
    @Path("/set-meeting-status")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Object setMeetingStatus(int userId, int meetingId, int status){

        int result = meetingService.setMeetingStatus(userId, meetingId, status);
        if (result == ResultCodes.GENERIC_ERROR){
            return ImmutableMap.of("resultCode", ResultCodes.GENERIC_ERROR);
        }
        return ImmutableMap.of("resultCode", ResultCodes.SUCCESSFUL);
    }

    @Inject
    private AppPrincipal principal;

    @Inject
    private MeetingService meetingService;

    @Inject
    private MeetingInformService meetingInformService;

    @Inject
    private Mapper mapper;
}