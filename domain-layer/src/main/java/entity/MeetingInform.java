package entity;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "meetinginform")
public class MeetingInform {

    @Id
    @Column(name= "id")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "meetinginform_id_seq")
    @SequenceGenerator(name = "meetinginform_id_seq", sequenceName = "meetinginform_id_seq", allocationSize = 1)
    private int meetingId;

    @Column(name = "time_from")
    private LocalDateTime timeFrom;

    @Column(name = "time_to")
    private LocalDateTime timeTo;

    @Column
    private String description;

    public int getMeetingId() {
        return meetingId;
    }

    public void setMeetingId(int meetingId) {
        this.meetingId = meetingId;
    }

    public LocalDateTime getTimeFrom() {
        return timeFrom;
    }

    public void setTimeFrom(LocalDateTime timeFrom) {
        this.timeFrom = timeFrom;
    }

    public LocalDateTime getTimeTo() {
        return timeTo;
    }

    public void setTimeTo(LocalDateTime timeTo) {
        this.timeTo = timeTo;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

