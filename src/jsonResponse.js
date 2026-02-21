const helper = require('./helper.js');
const path = require('path');
const jsonPath = path.join(__dirname, '../data', 'books.json');
const bookJSON = require(jsonPath);

/*
    Get all books
Filter by:
    genre
    language
    year (plus ability to do start and end date)
    author
Add book
Review book
*/

// creates and sends all json-based responses
const jsonResponses = (request, response, status, content) => {
    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8')
    });
    // add a body only if the request should have a body
    if (request.method !== 'HEAD' && status !== 204) {
        response.write(content);
    }
    // send response
    response.end();
}

// sends user data as a response
const getBooks = (request, response) => {
    jsonResponses(request, response, 200, JSON.stringify(bookJSON));
}

const getAuthor = (request, response) => {
    let statusCode = 400;
    let message = "Author query parameter is required";
    let id = "missingParams";
    let content = {message, id};

    // ensures an author is given
    if (request.query.author){
        const authorWorks = helper.iterateThroughJSON(bookJSON, "author", request.query.author);
        // if that author appears in the list, send a request
        if (authorWorks.length != 0){
            statusCode = 200;
            content = authorWorks;
            // return jsonResponses(request, response, 200, JSON.stringify(authorWorks));
        }
        else {
            statusCode = 404;
            content.message = "No author with that name found";
            content.id = "notFound";
        }
    }

    jsonResponses(request, response, statusCode, JSON.stringify(content));
}

const getLanguage = (request, response) => {
    // ensures an author is given
    if (request.query.language){
        const languageBooks = helper.iterateThroughJSON(bookJSON, "language", request.query.language);
        // if that author appears in the list, send a request
        if (languageBooks.length != 0){
            jsonResponses(request, response, 200, JSON.stringify(languageBooks));
        }
    }
}

const getGenre = (request, response) => {
    // ensures an author is given
    if (request.query.genre){
        const genreBooks = helper.iterateThroughNestedJSON(bookJSON, "genres", request.query.genre);
        // if that author appears in the list, send a request
        if (genreBooks.length != 0){
            jsonResponses(request, response, 200, JSON.stringify(genreBooks));
        }
    }
}

// sends a 404 error message as a response
const notReal = (request, response) => {
    let message = "The page you are looking for was not found";
    let id = "notFound";
    message = JSON.stringify({message, id});
    // no real content
    jsonResponses(request, response, 404, message);
}

// adds or modifies user data and sends an appropriate response
const addBook = (request, response) => {
    let message = "Name and age are both required";
    const {name, age} = request.body;

    // responds if request is missing name or body parameters
    if (!name || !age) {
        const id = "missingParams";
        message = JSON.stringify({message, id})
        return jsonResponses(request, response, 400, message);
    }

    let responseCode = 204;
    // create user if they don't already exist
    // if (!users[name]){
    //     responseCode = 201;
    //     users[name] = {name: name,};
    // }
    // users[name].age = age;

    // responds if a new user has been created
    if (responseCode == 201) {
        message = "Created successfully";
        message = JSON.stringify({message});
        return jsonResponses(request, response, responseCode, message);
    }
    // responds if a user has been modified
    jsonResponses(request, response, responseCode, JSON.stringify({message}));
}

module.exports = {
    getBooks,
    getAuthor,
    getLanguage,
    getGenre,
    notReal,
    addBook
}