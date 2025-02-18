import { HOST } from '../../commons/hosts';
import RestApiClient from "../../commons/api/rest-client";

const endpoint = {
    person: '/person'
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

function getPersons(token, callback) {
    const request = new Request(HOST.backend_api_users + endpoint.person, {
        method: 'GET',
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
        },
    });
    RestApiClient.performRequest(request, callback);
}

function getPersonById(params, callback) {
    const request = new Request(HOST.backend_api_users + endpoint.person + '/' + params.id, {
        method: 'GET',
    });
    RestApiClient.performRequest(request, callback);
}

function postPerson(person, callback) {
    const request = new Request(HOST.backend_api_users + endpoint.person, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(person),
    });
    RestApiClient.performRequest(request, callback);
}

function putPerson(personId, person, callback) {
    if (!personId) {
        console.error("Error: personId is undefined");
        return;
    }

    const request = new Request(HOST.backend_api_users + endpoint.person + '/' + personId, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(person),
    });

    console.log("Updating person at:", request.url);

    RestApiClient.performRequest(request, callback);
}

function deletePerson(personId, callback) {
    if (!personId) {
        console.error("Error: personId is undefined");
        return;
    }

    const request = new Request(HOST.backend_api_users + endpoint.person + '/' + personId, {
        method: 'DELETE',
    });

    fetch(request)
        .then((response) => handleApiResponse(response, callback))
        .catch((error) => callback(null, 500, error));
}

async function getUserPersons(userId, callback) {
    try {
        const response = await fetch(`${HOST.backend_api_users}/person/user-persons?userId=${userId}`, {
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

export {
    getPersons,
    getPersonById,
    postPerson,
    putPerson,
    deletePerson,
    getUserPersons,
};
