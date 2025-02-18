package ro.tuc.ds2020.dtos;

import org.springframework.hateoas.RepresentationModel;

import java.util.Objects;
import java.util.UUID;

public class DeviceDTO extends RepresentationModel<DeviceDTO> {
    private UUID id;
    private String description;
    private String address;
    private int maxhusage;
    private UUID userid;

    public DeviceDTO() {}

    public DeviceDTO(UUID id, String description, String address, int maxhusage, UUID userid) {
        this.id = id;
        this.description = description;
        this.address = address;
        this.maxhusage = maxhusage;
        this.userid = userid;
    }

    public DeviceDTO(UUID id, String description, String address, int maxhusage) {
        this.id = id;
        this.description = description;
        this.address = address;
        this.maxhusage = maxhusage;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public int getMaxhusage() {
        return maxhusage;
    }

    public void setMaxhusage(int maxhusage) {
        this.maxhusage = maxhusage;
    }

    public UUID getUserid() {return  userid;}

    public void setUserid(UUID userid) {this.userid = userid;}

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DeviceDTO deviceDTO = (DeviceDTO) o;
        return Objects.equals(id, deviceDTO.id) &&
                Objects.equals(description, deviceDTO.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, description);
    }


    @Override
    public String toString() {
        return "DeviceDTO{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", address='" + address + '\'' +
                ", maxhusage=" + maxhusage +
                ", userid=" + userid +
                '}';
    }
}
