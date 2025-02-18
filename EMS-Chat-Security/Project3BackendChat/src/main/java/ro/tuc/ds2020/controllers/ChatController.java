package ro.tuc.ds2020.controllers;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import ro.tuc.ds2020.entities.Message;

@Controller
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // Handle messages from users or the admin
    @MessageMapping("/sendMessage/{userId}")
    public void handleMessage(Message message) {
        // Check if the message is from a user or admin and route accordingly
        if ("user".equals(message.getSenderRole())) {
            // If message is from a user, it goes to the admin
            String adminId = "31000000-0000-0000-0000-000000000000";
            messagingTemplate.convertAndSend("/topic/messages/" + adminId, message); // Send to admin
        } else if ("admin".equals(message.getSenderRole())) {
            // If message is from admin, it goes to the specific user
            messagingTemplate.convertAndSend("/topic/messages/" + message.getReceiverId(), message); // Send to user
        }
    }
}
