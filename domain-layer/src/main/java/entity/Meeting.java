package entity;

import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.*;
import java.util.Objects;

/**
 * Entity entity.Task
 */
@Entity

@Table(name = "meetings")

@NamedQueries({
        @NamedQuery(name = "Meeting.getAll", query = "SELECT i FROM MeetingInform i WHERE i.meetingId IN " +
                "(SELECT m.meetingInform.meetingId FROM Meeting m WHERE m.userId = :userId) ORDER BY i.timeFrom"),
        @NamedQuery(name = "Meeting.updateMeetingStatus", query = "UPDATE Meeting m SET m.status = :status WHERE " +
                "m.userId =: userId AND m.meetingInform.id = :meetingId")
})
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "meetings_id_seq")
    @SequenceGenerator(name = "meetings_id_seq", sequenceName = "meetings_id_seq", allocationSize = 1)
    private int id;

    @Column(name = "status")
    private boolean status;

    @Column(name = "user_id")
    private int userId;

    @ManyToOne
    @JoinColumn(name = "meeting_id")
    private MeetingInform meetingInform;


    public Meeting(boolean status, int userId, MeetingInform meetingInform) {
        this.status = status;
        this.userId = userId;
        this.meetingInform = meetingInform;
    }

    public Meeting(){}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public MeetingInform getMeetingInform() {
        return meetingInform;
    }

    public void setMeetingInform(MeetingInform meetingInform) {
        this.meetingInform = meetingInform;
    }
}
