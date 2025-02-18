import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    device: '/device'
};

function handleApiResponse(response, callback) {
    if (!response.ok) {
        response.json()
            .catch(() => null)
            .then((error) => callback(null, response.status, error || "An error occurred"));
    } else {
        if (response.status === 204) {
            callback(null, response.status, null);
        } else {
            response.json()
                .then((data) => callback(data, response.status, null));
        }
    }
}

function getDevices(callback) {
    const request = new Request(HOST.backend_api_devices + endpoint.device, {
        method: 'GET',
    });
    RestApiClient.performRequest(request, callback);
}

function getDeviceById(params, callback) {
    const request = new Request(HOST.backend_api_devices + endpoint.device + '/' + params.id, {
        method: 'GET',
    });
    RestApiClient.performRequest(request, callback);
}

function postDevice(device, callback) {
    const request = new Request(HOST.backend_api_devices + endpoint.device, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(device),
    });
    RestApiClient.performRequest(request, callback);
}

function putDevice(deviceId, device, callback) {
    if (!deviceId) {
        console.error("Error: deviceId is undefined");
        return;
    }

    const request = new Request(HOST.backend_api_devices + endpoint.device + '/' + deviceId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(device),
    });

    console.log("Updating device at:", request.url);

    RestApiClient.performRequest(request, callback);
}

function deleteDevice(deviceId, callback) {
    if (!deviceId) {
        console.error("Error: deviceId is undefined");
        return;
    }

    const request = new Request(HOST.backend_api_devices + endpoint.device + '/' + deviceId, {
        method: 'DELETE',
    });

    fetch(request)
        .then((response) => handleApiResponse(response, callback))
        .catch((error) => callback(null, 500, error));
}

async function getUserDevices(userId, callback) {
    try {
        const response = await fetch(`${HOST.backend_api_devices}/device/user-devices?userId=${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        handleApiResponse(response, callback);
    } catch (error) {
        callback(null, 500, error);
    }
}

async function deleteDevicesByUserId(userId, callback) {
    try {
        const response = await fetch(`${HOST.backend_api_devices}/device/user-devices/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        handleApiResponse(response, callback);
    } catch (error) {
        callback(null, 500, error);
    }
}


export {
    getDevices,
    getDeviceById,
    postDevice,
    putDevice,
    deleteDevice,
    getUserDevices,
    deleteDevicesByUserId,
};
