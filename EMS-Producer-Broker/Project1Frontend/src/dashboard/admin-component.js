import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/auth-service';
import DeviceContainer from '../device/device-container';
import PersonContainer from '../person/person-container';
import { Button } from 'reactstrap';

const AdminComponent = () => {
    const { id } = useParams();
    const { userRole, userId, setUserRole, setUserId } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    const deviceContainerRef = useRef(null);

    useEffect(() => {
        // Commented out fetch logic
        // const fetchUserData = async () => {
        //     const response = await fetch(`http://localhost/api/auth/user/${id}`, {
        //         method: "GET",
        //         credentials: "include",
        //     });

        //     if (response.status === 403) {
        //         navigate('/login');
        //     } else if (response.ok) {
        //         const data = await response.json();
        //         setUserData(data);
        //     }
        // };

        // Commented out verification logic
        // if (userRole && userId && (userRole === "admin" || userId === id)) {
        //     fetchUserData();
        // } else {
        //     navigate('/login');
        // }

        // Directly set user data to null for now
        setUserData(null);
    }, [id, navigate]); // Removed userRole, userId dependencies

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
                <PersonContainer reloadHandler={handlePersonDelete} />
            </div>
        </div>
    );
};

export default AdminComponent;
