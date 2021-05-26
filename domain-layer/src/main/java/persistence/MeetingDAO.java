package persistence;

import entity.Meeting;
import entity.MeetingInform;

import javax.persistence.Query;
import javax.persistence.TypedQuery;

public class MeetingDAO extends BaseDAO<Meeting> {

    public int updateStatus(int userId, int meetingId, int status) {

        boolean statusForQuery = false;
        if (status == 1) {
            statusForQuery = true;
        }
        entities.getTransaction().begin();
        Query query = entities.createNamedQuery("Meeting.updateMeetingStatus")
                .setParameter("status", statusForQuery)
                .setParameter("userId", userId)
                .setParameter("meetingId", meetingId);
        entities.flush();
        int count = query.executeUpdate();
        entities.getTransaction().commit();
        return count;
    }

}
