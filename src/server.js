const http = require('http');
const query = require('querystring');
const httpHandler = require('./httpResponse.js');
const jsonHandler = require('./jsonResponse.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
const urlStruct = {
    '/': httpHandler.getIndex,
    '/docs': httpHandler.getDoc,
    '/style.css': httpHandler.getCss,
    '/bundle.js': httpHandler.getBundle,
    '/getBooks': jsonHandler.getBooks,
    '/getTitle': jsonHandler.getTitle,
    '/getAuthor': jsonHandler.getAuthor,
    '/getLanguage': jsonHandler.getLanguage,
    '/getYear': jsonHandler.getYear,
    '/getGenre': jsonHandler.getGenre,
    '/addBook' : jsonHandler.addBook,
    '/addReview': jsonHandler.addReview,
    default: jsonHandler.notReal
}

// parses request bodies sent to the server
const parseBody = (request, response, handler) => {
    const requestBody = [];

    // responds if there is an error while parsing
    request.on('error', (err) => {
        console.dir(err);
        response.statusCode = 400;
        response.end();
    });

    // adds saves data if body data is recieved
    request.on('data', (dataPiece) => {
        requestBody.push(dataPiece);
    });

    // sends an appropriate response (if possible) when all body data has been retrieved
    request.on('end', () => {
        const bodyString = Buffer.concat(requestBody).toString();
        
        if (request.headers['content-type'] === 'application/json'){
            request.body = JSON.parse(bodyString);
        }
        else if(request.headers['content-type'] === 'application/x-www-form-urlencoded') {
            request.body = query.parse(bodyString);
            console.log(request.body);
        }
        else {
            response.writeHead(400, {
                'Content-type': 'application/json'
            });
            response.write(JSON.stringify({error: 'Invalid data format'}));
            response.end();
        }

        handler(request, response);
    });
}

// responds to POST requests made to the server
const handlePostRequests = (request, response, url) => {
    if (url.pathname === '/addBook') {
        parseBody(request, response, jsonHandler.addBook);
    }
    else if (url.pathname === '/addReview') {
        parseBody(request, response, jsonHandler.addReview);
    }
    else {
        urlStruct.default(request, response);
    }
}

// responds to other (GET & HEAD) requests made to the server
const handleOtherRequests = (request, response, parsedURL) => {
    const handler = urlStruct[parsedURL.pathname];
    if (handler) {
        handler(request, response);
    }
    else {
        urlStruct.default(request, response);
    }
}

// sends requests to the right handler when they are recieved by the server
const onRequest = (request, response) => {
    // get url
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);
    request.query = Object.fromEntries(parsedURL.searchParams);

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