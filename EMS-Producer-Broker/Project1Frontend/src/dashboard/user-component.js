import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/auth-service';
import DeviceContainer from '../device/device-container';
import { Button } from 'reactstrap';

const UserComponent = () => {
    const { id } = useParams();
    const { userRole, userId, setUserRole, setUserId } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        /*const fetchUserData = async () => {
            const response = await fetch(`http://localhost:8081/api/auth/user/${id}`, {
                method: "GET",
                credentials: "include",
            });

            if (response.status === 403) {
                navigate('/login');
            } else if (response.ok) {
                const data = await response.json();
                setUserData(data);
            }
        };

        if (userRole && userId && (userRole === "admin" || userId === id)) {
            fetchUserData();
        } else {
            navigate('/login');
        }*/
        setUserData(null);
    }, [id, navigate]);

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
                <DeviceContainer userId={userData.id} userRole={userRole} />
            </div>

        </div>
    );
};

export default UserComponent;
