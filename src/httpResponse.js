const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// creates and sends all file-based responses
const httpResponses = (request, response, content, type) => {
    response.writeHead(200, {
        'Content-Type': type,
        'Content-Length': Buffer.byteLength(content, 'utf8')
    });
    response.write(content);
    response.end();
}

// serves the index HTML page
const getIndex = (request, response) => {
    httpResponses(request, response, index, 'text/html');
}

// serves the index CSS
const getCss = (request, response) => {
    httpResponses(request, response, css, 'text/css');
}

module.exports = {
    getIndex,
    getCss
}