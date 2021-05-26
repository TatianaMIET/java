package entity;

import javax.persistence.*;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.HashCodeBuilder;

import java.io.Serializable;

@Entity
@Table(name = "resource_message")
@IdClass(ResourceMessage.PK.class)

public class ResourceMessage implements Serializable {

    @Id
    @Column(name = "bundle_id")
    private int bundleId;

    @Id
    @Column(name = "mes_key")
    private String mesKey;

    @Column(name = "mes_value")
    private String mesValue;

    public int getBungleId() {
        return bundleId;
    }

    public void setBungleId(int bungleId) {
        this.bundleId = bungleId;
    }

    public String getMesKey() {
        return mesKey;
    }

    public void setMesKey(String mesKey) {
        this.mesKey = mesKey;
    }

    public String getMesValue() {
        return mesValue;
    }

    public void setMesValue(String mesValue) {
        this.mesValue = mesValue;
    }

    public static class PK implements Serializable{

        private String mesKey;
        private int bundleId;

        public PK() {
        }

        public String getKey() {
            return mesKey;
        }

        public void setKey(String mesKey) {
            this.mesKey = mesKey;
        }

        public int getBungleId() {
            return bundleId;
        }

        public void setBungleId(int bundleId) {
            this.bundleId = bundleId;
        }

        @Override
        public boolean equals(Object other) {
            if (this == other) {
                return true;
            }
            if (!(other instanceof PK)) {
                return false;
            }
            PK castOther = (PK)other;
            return
                    (StringUtils.equals(this.mesKey, castOther.mesKey))
                            && (this.bundleId == castOther.bundleId);
        }

        @Override
        public int hashCode() {
            return new HashCodeBuilder(17, 31)
                    .append(mesKey)
                    .append(bundleId)
                    .toHashCode();
        }

        private static final long serialVersionUID = 1L;
    }

    private static final long serialVersionUID = 1L;
}


