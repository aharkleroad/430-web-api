const http = require('http');
const httpHandler = require('./httpResponse.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
const urlStruct = {
    '/': httpHandler.getIndex,
    '/style.css': httpHandler.getCss,
    default: httpHandler.getIndex
}

// responds to POST requests made to the server
const handlePostRequests = (request, response, url) => {

}

// responds to other (GET & HEAD) requests made to the server
const handleOtherRequests = (request, response, url) => {
    const handler = urlStruct[url.pathname];
    if (handler) {
        handler(request, response);
    }
    else {
        urlStruct.default(request, response);
    }
}

const onRequest = (request, response) => {
    // get url
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedURL = new URL(`${protocol}://${request.headers.host}`);

    // check what kind of request
    if (request.method === 'POST'){
        handlePostRequests(request, response, parsedURL);
    }
    else {
        handleOtherRequests(request, response, parsedURL);
    }
}

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on port 127.0.0.1:${port}`);
});