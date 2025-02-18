import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/auth-service';
import DeviceContainer from '../device/device-container';
import { Button, Col, Row } from 'reactstrap';

const UserComponent = () => {
    const { userRole, userId, setUserRole, setUserId } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setUserRole(null);
        setUserId(null);
        navigate('/login');
    };

    return (
        <div style={{ position: 'relative' }}>
            <Button
                onClick={handleLogout}
                color="danger"
                style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '10px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Logout
            </Button>

            <div>
                <DeviceContainer userId={userId} userRole={userRole} />
            </div>

            <div style={{ padding: '20px' }}>
                <Row>
                    <Col sm={{ size: '8', offset: 1 }}>
                        <Button
                            onClick={() => navigate(`/chat/${userId}`)}
                            color="primary"
                        >
                            Chat
                        </Button>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default UserComponent;
