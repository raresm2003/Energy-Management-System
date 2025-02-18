function performRequest(request, callback) {
    fetch(request)
        .then(function (response) {
            if (response.ok) {
                response.text().then(text => {
                    const json = text ? JSON.parse(text) : null;
                    callback(json, response.status, null);
                }).catch(err => callback(null, response.status, err));
            } else {
                response.text().then(text => {
                    const error = text ? JSON.parse(text) : null;
                    callback(null, response.status, error);
                }).catch(err => callback(null, response.status, err));
            }
        })
        .catch(function (err) {
            callback(null, 1, err);
        });
}

module.exports = {
    performRequest
};
