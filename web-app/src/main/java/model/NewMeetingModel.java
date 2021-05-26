package model;

import java.time.LocalDateTime;
import java.util.List;

public class NewMeetingModel {

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

    public List<Integer> getFriends() {
        return friends;
    }

    public void setFriends(List<Integer> friends) {
        this.friends = friends;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    private LocalDateTime timeFrom;
    private LocalDateTime timeTo;
    private List<Integer> friends;
    private String description;
}
