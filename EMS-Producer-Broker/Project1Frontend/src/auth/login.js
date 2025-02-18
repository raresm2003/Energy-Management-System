import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth-service';
import { Button, Container, Jumbotron, Form, FormGroup, Label, Input } from 'reactstrap';
import BackgroundImg from '../commons/images/green-energy.jpg';

const backgroundStyle = {
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: "100%",
    height: "100vh",
    backgroundImage: `url(${BackgroundImg})`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const textStyle = { color: 'white' };

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(username, password);

        if (result) {
            const { userRole, userId } = result;
            if (userRole === 'admin') {
                navigate(`/admin/${userId}`);
            } else if (userRole === 'user') {
                navigate(`/user/${userId}`);
            }
        } else {
            alert("Invalid credentials");
        }
    };

    return (
        <div>
            <Jumbotron fluid style={backgroundStyle}>
                <Container fluid style={{ maxWidth: '400px', padding: '20px', backgroundColor: 'rgba(0, 0, 0, 0.6)', borderRadius: '8px' }}>
                    <h2 className="display-5" style={textStyle}>Login</h2>
                    <Form onSubmit={handleSubmit}>
                        <FormGroup>
                            <Label for="username" style={textStyle}>Username</Label>
                            <Input
                                type="text"
                                name="username"
                                id="username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="password" style={textStyle}>Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormGroup>
                        <Button color="primary" type="submit">Log In</Button>
                    </Form>
                </Container>
            </Jumbotron>
        </div>
    );
};

export default Login;
