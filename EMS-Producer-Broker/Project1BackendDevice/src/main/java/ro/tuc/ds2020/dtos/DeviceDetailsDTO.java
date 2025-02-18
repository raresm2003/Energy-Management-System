package ro.tuc.ds2020.dtos;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Objects;
import java.util.UUID;

public class DeviceDetailsDTO {

    private UUID id;

    @NotNull(message = "Description cannot be null")
    @Size(min = 1, max = 100, message = "Description must be between 5 and 100 characters")
    private String description;

    @NotNull(message = "Address cannot be null")
    @Size(min = 1, max = 100, message = "Address must be between 5 and 100 characters")
    private String address;

    @NotNull(message = "Max usage cannot be null")
    private int maxhusage;

    private UUID userid;

    public DeviceDetailsDTO() {}

    public DeviceDetailsDTO(String description, String address, int maxhusage, UUID userid) {
        this.description = description;
        this.address = address;
        this.maxhusage = maxhusage;
        this.userid = userid;
    }

    public DeviceDetailsDTO(UUID id, String description, String address, int maxhusage, UUID userid) {
        this.id = id;
        this.description = description;
        this.address = address;
        this.maxhusage = maxhusage;
        this.userid = userid;
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

    public UUID getUserid() {
        return userid;
    }

    public void setUserid(UUID userid) {
        this.userid = userid;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DeviceDetailsDTO that = (DeviceDetailsDTO) o;
        return maxhusage == that.maxhusage &&
                Objects.equals(id, that.id) &&
                Objects.equals(description, that.description) &&
                Objects.equals(address, that.address);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, description, address, maxhusage);
    }
}
