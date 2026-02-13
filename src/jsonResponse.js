const users = {};

const jsonResponses = (request, response, status, content, message) => {
    // add header info
    if (request.method === 'HEAD') {
    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8')
    });
}
    // if request is a get request, add body and error message
    else {
        // check if I can avoid redefining everything
        response.writeHead(status, message, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8')
        });
        response.write(content);
    }
    // send response
    response.end();
}

const getUsers = (request, response) => {
    let message = "Sucess";
    message = JSON.stringify({message});
    jsonResponses(request, response, 200, JSON.stringify({users}), message);
}

const notReal = (request, response) => {
    let message = "The page you are looking for was not found";
    let id = "notFound";
    message = JSON.stringify({message, id});
    // no real content
    jsonResponses(request, response, 404, message, message);
}

const addUser = (request, response) => {
    let message = "Name and age are both required";
    const {name, age} = response.body;

    // missing name or body parameters
    if (!name || !age) {
        const id = "missingParams";
        message = JSON.stringify({message, id})
        jsonResponses(request, response, 400, message, message);
    }

    let responseCode = 204;
    // create user if they don't already exist
    if (!users[name]){
        responseCode = 201;
        users[name] = {name: name,};
    }
    users[name].age = age;

    if (responseCode == 201) {
        message = "Created successfully";
        message = JSON.stringify({message});
        return jsonResponses(request, response, responseCode, message, message);
    }

    return jsonResponses(request, response, responseCode, {}, {});
}

module.exports = {
    getUsers,
    notReal,
    addUser
}