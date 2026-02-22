const helper = require('./helper.js');
const path = require('path');
const jsonPath = path.join(__dirname, '../data', 'books.json');
const bookJSON = require(jsonPath);

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
    let content = { message, id };

    // ensures an author is given
    if (request.query.author) {
        const authorWorks = helper.iterateThroughJSON(bookJSON, "author", request.query.author);
        // if that author appears in the list, send a request
        if (authorWorks.length != 0) {
            statusCode = 200;
            content = authorWorks;
        }
        else {
            statusCode = 404;
            content.message = "No books by that author found";
            content.id = "notFound";
        }
    }

    jsonResponses(request, response, statusCode, JSON.stringify(content));
}

const getLanguage = (request, response) => {
    let statusCode = 400;
    let message = "Language query parameter is required";
    let id = "missingParams";
    let content = { message, id };

    // ensures an author is given
    if (request.query.language) {
        const languageBooks = helper.iterateThroughJSON(bookJSON, "language", request.query.language);
        // if that author appears in the list, send a request
        if (languageBooks.length != 0) {
            statusCode = 200;
            content = languageBooks;
        }
        else {
            statusCode = 404;
            content.message = "No books written in that language";
            content.id = "notFound";
        }
    }

    jsonResponses(request, response, statusCode, JSON.stringify(content));
}

const getYear = (request, response) => {
    let statusCode = 400;
    let message = "Start year query parameter is required";
    let id = "missingParams";
    let content = { message, id };

    // ensures an author is given
    if (request.query.start) {
        let yearBooks;
        if (request.query.end) {
            if (request.query.end < request.query.start){
                content.message = "End date must be greater than start date";
                content.id = "badRequest";
                return jsonResponses(request, response, statusCode, JSON.stringify(content));
            }
            else {
                yearBooks = helper.findNumericRangeJSON(bookJSON, "year", request.query.start, request.query.end);
            }
        }
        else {
            yearBooks = helper.iterateThroughJSON(bookJSON, "year", request.query.start);
        }

        if (yearBooks.length != 0) {
            statusCode = 200;
            content = yearBooks;
        }
        else {
            statusCode = 404;
            content.message = "No books published that year";
            content.id = "notFound";
        }
    }

    jsonResponses(request, response, statusCode, JSON.stringify(content));
}

const getGenre = (request, response) => {
    let statusCode = 400;
    let message = "Genre query parameter is required";
    let id = "missingParams";
    let content = { message, id };

    // ensures an author is given
    if (request.query.genre) {
        const genreArray = request.query.genre.split(',');

        let genreBooks = [];
        for (let i = 0; i < genreArray.length; i++) {
            genreBooks.push(helper.iterateThroughNestedJSON(bookJSON, "genres", genreArray[i]));
        }
        // only include books that appear in all lists
        if (genreArray.length > 1) {
            let combinedGenreBooks = [];

            // iterates through all the items in the first list
            for (let i = 0; i < genreBooks[0].length; i++) {
                let included = true;
                // if the item doesn't exist in the other lists, don't add it to the final list
                for (let j = 1; j < genreBooks.length; j++) {
                    if (!genreBooks[j].includes(genreBooks[0][i])) {
                        included = false;
                    }
                }
                if (included) {
                    combinedGenreBooks.push(genreBooks[0][i]);
                }
            }

            genreBooks = combinedGenreBooks;
        }
        // gets rid of nested array if only one genre is selected
        else {
            genreBooks = genreBooks[0];
        }

        // if that author appears in the list, send a request
        if (genreBooks.length != 0) {
            statusCode = 200;
            content = genreBooks;
        }
        else {
            statusCode = 404;
            content.message = "No books in that genre found";
            content.id = "notFound";
        }
    }

    jsonResponses(request, response, statusCode, JSON.stringify(content));
}

// sends a 404 error message as a response
const notReal = (request, response) => {
    let message = "The page you are looking for was not found";
    let id = "notFound";
    message = JSON.stringify({ message, id });
    // no real content
    jsonResponses(request, response, 404, message);
}

// adds or modifies user data and sends an appropriate response
const addBook = (request, response) => {
    let message = "Name and age are both required";
    const { name, age } = request.body;

    // responds if request is missing name or body parameters
    if (!name || !age) {
        const id = "missingParams";
        message = JSON.stringify({ message, id })
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
        message = JSON.stringify({ message });
        return jsonResponses(request, response, responseCode, message);
    }
    // responds if a user has been modified
    jsonResponses(request, response, responseCode, JSON.stringify({ message }));
}

module.exports = {
    getBooks,
    getAuthor,
    getLanguage,
    getYear,
    getGenre,
    notReal,
    addBook
}