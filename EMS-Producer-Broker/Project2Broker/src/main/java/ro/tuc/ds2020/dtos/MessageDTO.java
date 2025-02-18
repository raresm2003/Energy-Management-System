package ro.tuc.ds2020.dtos;

import org.springframework.hateoas.RepresentationModel;

import java.util.Objects;
import java.util.UUID;

public class MessageDTO extends RepresentationModel<MessageDTO> {
    private UUID id;
    private UUID deviceId;
    private long timestamp;
    private float measurementValue;

    public MessageDTO() {
    }

    public MessageDTO(UUID id, UUID deviceId, long timestamp, float measurementValue) {
        this.id = id;
        this.deviceId = deviceId;
        this.timestamp = timestamp;
        this.measurementValue = measurementValue;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(UUID deviceId) {
        this.deviceId = deviceId;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public float getMeasurementValue() {
        return measurementValue;
    }

    public void setMeasurementValue(float measurementValue) {
        this.measurementValue = measurementValue;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        MessageDTO messageDTO = (MessageDTO) o;
        return timestamp == messageDTO.timestamp &&
                Float.compare(messageDTO.measurementValue, measurementValue) == 0 &&
                Objects.equals(deviceId, messageDTO.deviceId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(deviceId, timestamp, measurementValue);
    }
}