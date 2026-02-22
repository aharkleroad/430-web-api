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

const getBasicList = (request, response, paramName, notFoundMessage) => {
    let statusCode = 400;
    let message = `${paramName} query parameter is required`;
    let id = "missingParams";
    let content = { message, id };

    // ensures an author is given
    if (request.query[paramName]) {
        const bookList = helper.iterateThroughJSON(bookJSON, paramName, request.query[paramName]);
        // if that author appears in the list, send a request
        if (bookList.length != 0) {
            statusCode = 200;
            content = bookList;
        }
        else {
            statusCode = 404;
            content.message = notFoundMessage;
            content.id = "notFound";
        }
    }

    jsonResponses(request, response, statusCode, JSON.stringify(content));
}

const getTitle = (request, response) => {
    getBasicList(request, response, "title", "No books with that title found");
}

const getAuthor = (request, response) => {
    getBasicList(request, response, "author", "No books by that author found");
}

const getLanguage = (request, response) => {
    getBasicList(request, response, "language", "No books written in that language found");
}

const getYear = (request, response) => {
    let statusCode = 400;
    let message = "Start year query parameter is required";
    let id = "missingParams";
    let content = { message, id };

    // ensures a start date is given
    if (request.query.year) {
        let yearBooks;
        // checks if an end date was given too
        if (request.query.end) {
            // if the end date is before the start date, respond w/ an error
            if (request.query.end < request.query.year) {
                content.message = "End date must be greater than start date";
                content.id = "badRequest";
                return jsonResponses(request, response, statusCode, JSON.stringify(content));
            }
            else {
                yearBooks = helper.findNumericRangeJSON(bookJSON, "year", request.query.year, request.query.end);
            }
        }
        else {
            yearBooks = helper.iterateThroughJSON(bookJSON, "year", request.query.year);
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
    message = { message, id };
    // no real content
    jsonResponses(request, response, 404, JSON.stringify(message));
}

// adds or modifies user data and sends an appropriate response
const addBook = (request, response) => {
    let statusCode = 400;
    let message = "All fields are required";
    let id = "missingParams";
    let content = { message, id };

    const { title, author, language, year, genre } = request.body;

    // responds if request is missing name or body parameters
    if (title && author && language && year && genre) {
        statusCode = 204;
        const bookList = helper.iterateThroughJSON(bookJSON, 'title', request.query[title]);
        // create book if it doesn't already exist
        if (bookList.length === 0) {
            statusCode = 201;
            content = { title, author, language, year, genre }
            bookJSON += content;
        }
        else {
            helper.updateJSON(bookJSON, 'title', request.query[title], { title, author, language, year, genre })
        }

        // responds if a new user has been created
        if (statusCode == 201) {
            message = "Created successfully";
            content = {message};
        }
    }

    // responds if a user has been modified
    jsonResponses(request, response, statusCode, JSON.stringify(content));
}

// adds or modifies user data and sends an appropriate response
const addReview = (request, response) => {
    let statusCode = 400;
    let message = "All fields are required";
    let id = "missingParams";
    let content = { message, id };

    const { title, review } = request.body;

    // responds if request is missing name or body parameters
    if (title && review) {
        let statusCode = 204;
        const bookList = helper.iterateThroughJSON(bookJSON, 'title', request.query[title]);
        // create book if it doesn't already exist
        if (bookList.length === 0) {
            statusCode = 404;
            content.message = "Book not found";
            content.id = "notFound";
        }
        else {
            helper.updateJSON(bookJSON, 'title', request.query[title], { title, rating });
            message = "Created successfully";
            content = {message};
        }
    }

    // responds if a user has been modified
    jsonResponses(request, response, statusCode, JSON.stringify(content));
}

module.exports = {
    getBooks,
    getTitle,
    getAuthor,
    getLanguage,
    getYear,
    getGenre,
    notReal,
    addBook,
    addReview
}