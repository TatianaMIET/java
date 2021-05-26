package serviсes;

import codes.ResultCode.ResultCodes;
import entity.MeetingInform;
import persistence.MeetingInformDAO;

import javax.inject.Inject;
import javax.persistence.PersistenceException;
import java.sql.SQLException;

public class MeetingInformService {


    public int createNewMeetingInform(MeetingInform meetingInform){

        try {
            meetingInformDAO.add(meetingInform);
            return ResultCodes.SUCCESSFUL;
        }
        catch (PersistenceException e){
            return ResultCodes.GENERIC_ERROR;
        }
    }

    @Inject
    private MeetingInformDAO meetingInformDAO;

}
