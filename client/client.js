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

const sendGetOrHead = async (url, method) => {
    const response = await fetch(url, {
        method: method,
    });

    handleResponse(response, method);
}

// sends a post request to /addUser based on form data
const sendPost = async (formName) => {
    const url = formName.getAttribute('action');
    const method = formName.getAttribute('method');
    let formData;
    console.log(url);

    if (url === '/reviewBook') {
        const title = document.querySelector("#reviewTitleField").value;
        const review = document.querySelector("#ratingField").value;
        formData = JSON.stringify({ title, review });
    }

    else {
        const title = document.querySelector("#addTitleField").value;
        const author = document.querySelector("#addAuthorField").value;
        const language = document.querySelector("#addLanguageField").value;
        const year = document.querySelector("#addDateField").value;
        const genre = document.querySelector("#addGenreField").value;
        formData = JSON.stringify({ title, author, language, year, genre });
    }

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

const constructRequestInfo = async (paramName1 = "all", paramName2 = "") => {
    const method = document.querySelector(`#${paramName1}MethodSelect`).value;
    let url = '/getBooks';

    // if query parameters are given, add them to the request url
    if (paramName1 !== "all") {
        const paramValue1 = document.querySelector(`#${paramName1}Field`).value;
        // url = /getParam?param=paramValue
        url = `/get${paramName1.charAt(0).toUpperCase() + paramName1.slice(1)}`;
        if (paramValue1) {
            url += `?${paramName1}=${paramValue1}`;
        }
    }

    if (paramName2) {
        const paramValue2 = document.querySelector(`#${paramName2}Field`).value;
        if (paramValue2) {
            url += `&${paramName2}=${paramValue2}`;
        }
    }

    // send fetch request w/ retrieved form data
    sendGetOrHead(url, method);
}

// sends a get or head request to a given page based on form data
const requestAllBooksData = async () => {
    constructRequestInfo();
}

const requestTitleData = async () => {
    constructRequestInfo('title');
}

const requestAuthorData = async () => {
    constructRequestInfo('author');
}

const requestLanguageData = async () => {
    constructRequestInfo('language');
}

const requestGenreData = async () => {
    constructRequestInfo('genre');
}

const requestYearData = async () => {
    constructRequestInfo('year', 'end');
}

const cancelFormAction = (e, func) => {
    e.preventDefault();
    func();
    return false;
}

// adds submit event listeners to both forms
const init = () => {
    const getBooksForm = document.querySelector("#allBooksForm");
    const getTitleForm = document.querySelector("#titleForm");
    const getAuthorForm = document.querySelector("#authorForm");
    const getLanguageForm = document.querySelector("#languageForm");
    const getYearForm = document.querySelector("#yearForm");
    const getGenreForm = document.querySelector("#genreForm");

    const addBookForm = document.querySelector("#addBookForm");
    const addReviewForm = document.querySelector("#reviewBookForm");

    const addBook = (e) => {
        e.preventDefault();
        sendPost(addBookForm);
        return false;
    }

    const reviewBook = (e) => {
        e.preventDefault();
        sendPost(addReviewForm);
        return false;
    }

    getBooksForm.addEventListener('submit', (e) => { cancelFormAction(e, requestAllBooksData) });
    getTitleForm.addEventListener('submit', (e) => { cancelFormAction(e, requestTitleData) });
    getAuthorForm.addEventListener('submit', (e) => { cancelFormAction(e, requestAuthorData) });
    getLanguageForm.addEventListener('submit', (e) => { cancelFormAction(e, requestLanguageData) });
    getYearForm.addEventListener('submit', (e) => { cancelFormAction(e, requestYearData) });
    getGenreForm.addEventListener('submit', (e) => { cancelFormAction(e, requestGenreData) });

    addBookForm.addEventListener('submit', addBook);
    addReviewForm.addEventListener('submit', reviewBook);
}

window.onload = init;
