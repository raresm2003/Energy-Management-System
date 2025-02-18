package ro.tuc.ds2020.dtos.builders;

import ro.tuc.ds2020.dtos.MessageDTO;
import ro.tuc.ds2020.entities.Message;

public class MessageBuilder {

    private MessageBuilder() {
    }

    public static MessageDTO toMessageDTO(Message message) {
        return new MessageDTO(message.getId(), message.getDeviceId(), message.getTimestamp(), message.getMeasurementValue());
    }

    public static MessageDTO toMessageDetailsDTO(Message message) {
        return new MessageDTO(message.getId(), message.getDeviceId(), message.getTimestamp(), message.getMeasurementValue());
    }

    public static Message toEntity(MessageDTO messageDetailsDTO) {
        return new Message(messageDetailsDTO.getDeviceId(), messageDetailsDTO.getTimestamp(), messageDetailsDTO.getMeasurementValue());
    }
}