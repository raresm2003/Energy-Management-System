import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../auth/auth-service';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs/esm5';
import { Container, Row, Col, Input, Button, Card, CardHeader, CardBody, ListGroup, ListGroupItem } from 'reactstrap';

const Chat = () => {
    const { userRole, userId } = useContext(AuthContext);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [client, setClient] = useState(null);
    const [activeChat, setActiveChat] = useState(null);
    const [users, setUsers] = useState([]);
    const adminId = '31000000-0000-0000-0000-000000000000';

    useEffect(() => {
        const socket = new SockJS('http://chat-demo.localhost/chat');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                if (userRole === 'admin') {
                    stompClient.subscribe(`/topic/messages/${adminId}`, (message) => {
                        const newMessage = JSON.parse(message.body);
                        setMessages((prev) => [...prev, { ...newMessage, isAdmin: newMessage.senderId === adminId }]);

                        // Add user to the active users list if not already present
                        if (!users.some((user) => user.id === newMessage.senderId)) {
                            setUsers((prev) => [
                                ...prev,
                                { id: newMessage.senderId, name: `User ${newMessage.senderId}` },
                            ]);
                        }
                    });
                } else {
                    stompClient.subscribe(`/topic/messages/${userId}`, (message) => {
                        const newMessage = JSON.parse(message.body);
                        setMessages((prev) => [...prev, { ...newMessage, isAdmin: newMessage.senderRole === 'admin' }]);
                    });
                }
            },
        });

        stompClient.activate();
        setClient(stompClient);

        return () => stompClient.deactivate();
    }, [userId, userRole, users]);

    const sendMessage = () => {
        if (client && input.trim()) {
            const message = {
                senderId: userId,
                senderRole: userRole,
                receiverId: userRole === 'admin' ? activeChat : adminId,
                receiverRole: userRole === 'admin' ? 'user' : 'admin',
                content: input,
            };

            const destination =
                userRole === 'admin'
                    ? `/app/sendMessage/${activeChat}`
                    : `/app/sendMessage/${adminId}`;

            client.publish({
                destination,
                body: JSON.stringify(message),
            });

            // Add the sent message to the messages state
            setMessages((prev) => [...prev, { ...message, isAdmin: userRole === 'admin' }]);
            setInput('');
        }
    };

    const getFilteredMessages = () => {
        if (userRole === 'admin' && activeChat) {
            return messages.filter(
                (msg) =>
                    (msg.senderId === activeChat && msg.receiverId === adminId) ||
                    (msg.senderId === adminId && msg.receiverId === activeChat)
            );
        }
        return messages;
    };

    const filteredMessages = getFilteredMessages();

    return (
        <Container className="mt-5">
            <Row>
                {userRole === 'admin' && (
                    <Col md="4">
                        <Card>
                            <CardHeader className="bg-secondary text-white">Active Users</CardHeader>
                            <ListGroup flush>
                                {users.map((user) => (
                                    <ListGroupItem
                                        key={user.id}
                                        action
                                        active={user.id === activeChat}
                                        onClick={() => setActiveChat(user.id)}
                                    >
                                        {user.name}
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        </Card>
                    </Col>
                )}
                <Col md={userRole === 'admin' ? '8' : '12'}>
                    <Card>
                        <CardHeader className="bg-primary text-white">
                            <h4 className="mb-0">
                                Chat with {userRole === 'admin' ? `User ${activeChat || '-'}` : 'Admin'}
                            </h4>
                        </CardHeader>
                        <CardBody>
                            <div
                                style={{
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    padding: '10px',
                                    height: '300px',
                                    overflowY: 'auto',
                                    marginBottom: '15px',
                                }}
                            >
                                {filteredMessages.length > 0 ? (
                                    filteredMessages.map((msg, idx) => (
                                        <p
                                            key={idx}
                                            style={{
                                                margin: 0,
                                                wordWrap: 'break-word',
                                                color: msg.isAdmin ? 'blue' : 'black',
                                            }}
                                        >
                                            {msg.senderId === userId
                                                ? `You: ${msg.content}`
                                                : msg.isAdmin
                                                    ? `Admin: ${msg.content}`
                                                    : `User: ${msg.content}`}
                                        </p>
                                    ))
                                ) : (
                                    <p className="text-muted text-center">No messages yet</p>
                                )}
                            </div>
                            <Row>
                                <Col xs="9">
                                    <Input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type a message"
                                        disabled={userRole === 'admin' && !activeChat}
                                    />
                                </Col>
                                <Col xs="3">
                                    <Button
                                        color="primary"
                                        block
                                        onClick={sendMessage}
                                        disabled={userRole === 'admin' && !activeChat}
                                    >
                                        Send
                                    </Button>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Chat;
