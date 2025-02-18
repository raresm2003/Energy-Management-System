package ro.tuc.ds2020.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.tuc.ds2020.dtos.MessageDTO;
import ro.tuc.ds2020.services.MessageService;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@CrossOrigin
@RequestMapping(value = "/message")
public class MessageController {

    private final MessageService messageService;

    @Autowired
    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping()
    public ResponseEntity<List<MessageDTO>> getMessages() {
        List<MessageDTO> dtos = messageService.findMessages();
        for (MessageDTO dto : dtos) {
            Link messageLink = linkTo(methodOn(MessageController.class)
                    .getMessage(dto.getId())).withRel("messageDetails");
            dto.add(messageLink);
        }
        return new ResponseEntity<>(dtos, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<UUID> insertMessage(@Valid @RequestBody MessageDTO messageDTO) {
        UUID messageID = messageService.insert(messageDTO);
        return new ResponseEntity<>(messageID, HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<MessageDTO> getMessage(@PathVariable("id") UUID messageId) {
        MessageDTO dto = messageService.findMessageById(messageId);
        return new ResponseEntity<>(dto, HttpStatus.OK);
    }

    // TODO: Implement UPDATE, DELETE for resources
}