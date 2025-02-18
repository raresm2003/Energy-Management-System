package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.MessageDTO;
import ro.tuc.ds2020.dtos.builders.MessageBuilder;
import ro.tuc.ds2020.entities.Message;
import ro.tuc.ds2020.repositories.MessageRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MessageService {
    private static final Logger LOGGER = LoggerFactory.getLogger(MessageService.class);
    private final MessageRepository messageRepository;

    @Autowired
    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public List<MessageDTO> findMessages() {
        List<Message> messageList = messageRepository.findAll();
        return messageList.stream()
                .map(MessageBuilder::toMessageDTO)
                .collect(Collectors.toList());
    }

    public MessageDTO findMessageById(UUID id) {
        Optional<Message> messageOptional = messageRepository.findById(id);
        if (!messageOptional.isPresent()) {
            LOGGER.error("Message with id {} was not found in db", id);
            throw new ResourceNotFoundException(Message.class.getSimpleName() + " with id: " + id);
        }
        return MessageBuilder.toMessageDetailsDTO(messageOptional.get());
    }

    public UUID insert(MessageDTO messageDTO) {
        Message message = MessageBuilder.toEntity(messageDTO);
        message = messageRepository.save(message);
        LOGGER.debug("Message with id {} was inserted in db", message.getId());
        return message.getId();
    }
}