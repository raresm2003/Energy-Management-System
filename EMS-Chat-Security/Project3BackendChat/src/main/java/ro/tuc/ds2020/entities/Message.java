package ro.tuc.ds2020.entities;

public class Message {
    private String senderId;
    private String senderRole;
    private String receiverId;
    private String content;

    public Message(String senderId, String senderRole, String receiverId, String content) {
        this.senderId = senderId;
        this.senderRole = senderRole;
        this.receiverId = receiverId;
        this.content = content;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getSenderRole() {
        return senderRole;
    }

    public void setSenderRole(String senderRole) {
        this.senderRole = senderRole;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}

