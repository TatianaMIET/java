package persistence;

import entity.MeetingInform;

import java.util.List;

public class MeetingInformDAO extends BaseDAO<MeetingInform> {

    public List<MeetingInform> getAllMeetings(int id){

        return entities.createNamedQuery("Meeting.getAll", MeetingInform.class)
                .setParameter("userId", id)
                .getResultList();
    }

}
