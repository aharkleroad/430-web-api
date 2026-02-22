// adds info to index page (after a request has been made) based on the response it recieves
const handleResponse = async (response, method) => {
    const content = document.querySelector("#content");

    switch (response.status) {
        case 200:
            content.innerHTML = '<b>Success</b>';
            break;
        case 204:
            content.innerHTML = '<b>Updated (No Content)</b>';
            break;
        case 201:
            content.innerHTML = '<b>Created</b>';
            break;
        case 400:
            content.innerHTML = '<b>Bad Request</b>';
            break;
        case 404:
            content.innerHTML = '<b>Not Found</b>';
            break;
        default:
            content.innerHTML = '<b>Error code not implemented</b>';
            break;
    }

    // only gets the response body (and displays something from it) if the response has a body
    if (method === "get" || (method === "post" && response.status !== 204)) {
        const responseText = await response.json();
        content.innerHTML += `<p>${JSON.stringify(responseText)}</p>`;
    }
}

// sends a post request to /addUser based on form data
const sendPost = async (formName) => {
    const url = formName.getAttribute('action');
    const method = formName.getAttribute('method');
    console.log(url);

    const name = document.querySelector("#nameField").value;
    const age = document.querySelector("#ageField").value;
    const formData = JSON.stringify({ name, age });
    console.log(formData);

    // send fetch request w/ data retrieved from form
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': formData.length,
        },
        body: formData,
    });

    handleResponse(response, method);
}

// sends a get or head request to a given page based on form data
const requestAllBooksData = async () => {
    const method = document.querySelector("#allMethodSelect").value;

    // send fetch request w/ retrieved form data
    const response = await fetch('/getBooks', {
        method: method,
    });

    handleResponse(response, method);
}

const requestOneQueryParam = async (paramName) => {
    const method = document.querySelector( `#${paramName}MethodSelect`).value;
    const paramValue = document.querySelector(`#${paramName}Field`).value;
    // url = /getParam?param=paramValue
    const url = `/get${paramName.charAt(0).toUpperCase() + paramName.slice(1)}?${paramName}=${paramValue}`;

    // send fetch request w/ retrieved form data
    const response = await fetch(url, {
        method: method,
    });

    handleResponse(response, method);
}

const requestAuthorData = async () => {
    requestOneQueryParam('author');
}

const requestLanguageData = async () => {
    requestOneQueryParam('language');
}

const requestGenreData = async () => {
    requestOneQueryParam('genre');
}

const requestYearData = async () => {
    const method = document.querySelector("#yearMethodSelect").value;
    const startValue = document.querySelector(`#startField`).value;
    const endValue = document.querySelector(`#endField`).value;

    url = `/getYear?start=${startValue}`;
    if (endValue) {
        url += `&end=${endValue}`;
    }

    const response = await fetch(url, {
        method: method,
    });

    handleResponse(response, method);
}

const cancelFormAction = (e, func) => {
    e.preventDefault();
    func();
    return false;
}

// adds submit event listeners to both forms
const init = () => {
    const getBooksForm = document.querySelector("#allBooksForm");
    const getAuthorForm = document.querySelector("#authorForm");
    const getLanguageForm = document.querySelector("#languageForm");
    const getYearForm = document.querySelector("#yearForm");
    const getGenreForm = document.querySelector("#genreForm");

    const addBookForm = document.querySelector("#addBookForm");
    const addReviewForm = document.querySelector("#reviewForm");

    const getAllBooks = (e) => {
        cancelFormAction(e, requestAllBooksData);
    }

    const getAuthorBooks = (e) => {
        cancelFormAction(e, requestAuthorData);
    }

    const getLanguageBooks = (e) => {
        cancelFormAction(e, requestLanguageData);
    }

    const getYearBooks = (e) => {
        cancelFormAction(e, requestYearData);
    }

    const getGenreBooks = (e) => {
        cancelFormAction(e, requestGenreData);
    }

    const addBook = (e) => {
        e.preventDefault();
        sendPost(addUserForm);
        return false;
    }

    getBooksForm.addEventListener('submit', getAllBooks);
    getAuthorForm.addEventListener('submit', getAuthorBooks);
    getLanguageForm.addEventListener('submit', getLanguageBooks);
    getYearForm.addEventListener('submit', getYearBooks);
    getGenreForm.addEventListener('submit', getGenreBooks);

    addBookForm.addEventListener('submit', addBook);
}

window.onload = init;
