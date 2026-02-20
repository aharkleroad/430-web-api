const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const css = fs.readFileSync(`${__dirname}/../hosted/style.css`);
const bundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);

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

// serves the index JS
const getBundle = (request, response) => {
    httpResponses(request, response, bundle, 'application/javascript');
}

module.exports = {
    getIndex,
    getCss,
    getBundle
}