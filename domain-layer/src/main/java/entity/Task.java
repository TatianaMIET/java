package entity;


import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@NamedQueries({
        @NamedQuery(name = "Task.getAllTasks", query = "SELECT e FROM Task e WHERE e.userId = :id ORDER BY e.timeFrom")
})
@Table(name = "timetable")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "timetables_timetableid_seq")
    @SequenceGenerator(name = "timetables_timetableid_seq", sequenceName = "timetables_timetableid_seq", allocationSize = 1)
    @Column(name = "id")
    private int taskId;

    @Column(name = "time_from")
    private LocalDateTime timeFrom;

    @Column(name = "time_to")
    private LocalDateTime timeTo;

    @Column(name = "description")
    private String description;

    @Column(name = "status")
    private int status;

    @Column(name = "user_id")
    private int userId;

    public void setTaskId(int taskId) {
        this.taskId = taskId;
    }

    public void setUserId(int user) {
        this.userId = user;
    }

    public int getTaskId() {
        return taskId;
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

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getUserId() {
        return userId;
    }

}

