package entity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@NamedQueries({
        @NamedQuery(name = "ResourceBundle.findByLang", query = "SELECT e FROM ResourceBundle e WHERE e.lang = :lang")
})
@Table(name = "resource_bundle")
public class ResourceBundle {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "resource_bundle_bundle_id_seq")
    @SequenceGenerator(name = "resource_bundle_bundle_id_seq", sequenceName = "resource_bundle_bundle_id_seq", allocationSize = 1)
    @Column(name = "bundle_id")
    private int bundleId;

    @Column(name = "lang")
    private String lang;

    @OneToMany
    @JoinColumn(name="bundle_id")
    private List<ResourceMessage> messages = new ArrayList<>();


    public ResourceBundle(String lang) {
        this.lang = lang;
    }

    public ResourceBundle() {

    }

    public int getBungleId() {
        return bundleId;
    }

    public void setBungleId(int bundleId) {
        this.bundleId = bundleId;
    }

    public List<ResourceMessage> getMessages() {
        return messages;
    }

    public void setMessages(List<ResourceMessage> messages) {
        this.messages = messages;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }
}
