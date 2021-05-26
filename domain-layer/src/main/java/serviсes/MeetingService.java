package serviсes;

import codes.ResultCode.ResultCodes;
import entity.Meeting;
import entity.MeetingInform;
import persistence.MeetingDAO;
import persistence.MeetingInformDAO;

import javax.inject.Inject;
import javax.persistence.PersistenceException;
import java.util.List;


public class MeetingService {

    public List<MeetingInform> getAllMeetings(int id) {
        try {
            return meetingInformDAO.getAllMeetings(id);
        } catch (PersistenceException e) {
            return null;
        }
    }

    public int createNewMeeting(List<Meeting> meetings) {

        try {
            for (Meeting meeting : meetings)
                meetingDAO.add(meeting);
            return ResultCodes.SUCCESSFUL;
        } catch (PersistenceException e) {
            return ResultCodes.GENERIC_ERROR;
        }
    }

    public int setMeetingStatus(int userId, int meetingId, int status) {

        try {
            if (meetingDAO.updateStatus(userId, meetingId, status) != 1)
                return ResultCodes.GENERIC_ERROR;
            return ResultCodes.SUCCESSFUL;
        } catch (PersistenceException e) {
            return ResultCodes.GENERIC_ERROR;
        }
    }


    @Inject
    MeetingDAO meetingDAO;

    @Inject
    MeetingInformDAO meetingInformDAO;
}
