import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/auth-service';
import DeviceContainer from '../device/device-container';
import PersonContainer from '../person/person-container';
import { Button, Col, Row } from 'reactstrap';

const AdminComponent = () => {
    const { userId, setUserRole, setUserId, token } = useContext(AuthContext);
    const navigate = useNavigate();

    const deviceContainerRef = useRef(null);

    const handlePersonDelete = () => {
        console.log('A person was deleted!');
        if (deviceContainerRef.current) {
            deviceContainerRef.current.reloadAll();
        }
    };

    const handleLogout = async () => {
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
                Log Out
            </Button>

            <div>
                <DeviceContainer ref={deviceContainerRef} reloadHandler={handlePersonDelete} />
                <hr />
                <PersonContainer reloadHandler={handlePersonDelete} token={token}/>
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

export default AdminComponent;
