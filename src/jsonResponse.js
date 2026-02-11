const jsonResponses = (request, response, status, content, message) => {
    // add header info
    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8')
    });
    // if request is a get request, add body and error message
    if (request.method === 'GET'){
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
    jsonResponses(request, response, 200, content, message);
}

const notReal = (request, response) => {
    jsonResponses(request, response, 404, content, message);
}

const addUser = (request, response) => {

}

module.exports = {
    getUsers,
    notReal,
    addUser
}