/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/client.js"
/*!**************************!*\
  !*** ./client/client.js ***!
  \**************************/
() {

eval("{// adds info to index page (after a request has been made) based on the response it recieves\r\nconst handleResponse = async (response, method) => {\r\n    const content = document.querySelector(\"#content\");\r\n\r\n    switch (response.status) {\r\n        case 200:\r\n            content.innerHTML = '<b>Success</b>';\r\n            break;\r\n        case 204:\r\n            content.innerHTML = '<b>Updated (No Content)</b>';\r\n            break;\r\n        case 201:\r\n            content.innerHTML = '<b>Created</b>';\r\n            break;\r\n        case 400:\r\n            content.innerHTML = '<b>Bad Request</b>';\r\n            break;\r\n        case 404:\r\n            content.innerHTML = '<b>Not Found</b>';\r\n            break;\r\n        default:\r\n            content.innerHTML = '<b>Error code not implemented</b>';\r\n            break;\r\n    }\r\n\r\n    // only gets the response body (and displays something from it) if the response has a body\r\n    if (method === \"get\" || (method === \"post\" && response.status !== 204)) {\r\n        const responseText = await response.json();\r\n        content.innerHTML += `<p>${JSON.stringify(responseText)}</p>`;\r\n    }\r\n}\r\n\r\n// sends a post request to /addUser based on form data\r\nconst sendPost = async (formName) => {\r\n    const url = formName.getAttribute('action');\r\n    const method = formName.getAttribute('method');\r\n    console.log(url);\r\n\r\n    const name = document.querySelector(\"#nameField\").value;\r\n    const age = document.querySelector(\"#ageField\").value;\r\n    const formData = JSON.stringify({ name, age });\r\n    console.log(formData);\r\n\r\n    // send fetch request w/ data retrieved from form\r\n    const response = await fetch(url, {\r\n        method: method,\r\n        headers: {\r\n            'Content-Type': 'application/json',\r\n            'Content-Length': formData.length,\r\n        },\r\n        body: formData,\r\n    });\r\n\r\n    handleResponse(response, method);\r\n}\r\n\r\n// sends a get or head request to a given page based on form data\r\nconst requestAllBooksData = async () => {\r\n    // const url = formName.getAttribute('action');\r\n    const method = document.querySelector(\"#allMethodSelect\").value;\r\n\r\n    // send fetch request w/ retrieved form data\r\n    const response = await fetch('/getBooks', {\r\n        method: method,\r\n    });\r\n\r\n    handleResponse(response, method);\r\n}\r\n\r\nconst requestAuthorData = async () => {\r\n    const method = document.querySelector(\"#authorMethodSelect\").value;\r\n    const author = document.querySelector(\"#authorField\").value;\r\n\r\n    // send fetch request w/ retrieved form data\r\n    const response = await fetch('/getAuthor', {\r\n        method: method,\r\n    });\r\n\r\n    handleResponse(response, method);\r\n}\r\n\r\n// adds submit event listeners to both forms\r\nconst init = () => {\r\n    const getBooksForm = document.querySelector(\"#allBooksForm\");\r\n    const getPageForm = document.querySelector(\"#addBookForm\");\r\n\r\n    const addBook = (e) => {\r\n        e.preventDefault();\r\n        sendPost(addUserForm);\r\n        return false;\r\n    }\r\n\r\n    const getAllBooks = (e) => {\r\n        e.preventDefault();\r\n        requestAllBooksData();\r\n        return false;\r\n    }\r\n\r\n    const getAuthorBooks = (e) => {\r\n        e.preventDefault();\r\n        requestAllBooksData();\r\n        return false;\r\n    }\r\n\r\n    getBooksForm.addEventListener('submit', getAllBooks);\r\n    getPageForm.addEventListener('submit', addBook);\r\n}\r\n\r\nwindow.onload = init;\r\n\n\n//# sourceURL=webpack://http-api-assignment-ii/./client/client.js?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./client/client.js"]();
/******/ 	
/******/ })()
;