// adds info to index page (after a request has been made) based on the response it recieves
const handleResponse = async (response, method, url) => {
    // removes query parameters from the url, if they exist
    url = url.split('?')[0];

    let content;
    switch (url) {
        case "/getBooks":
            content = document.querySelector("#allContent");
            break;
        case "/getTitle":
            content = document.querySelector("#titleContent");
            break;
        case "/getAuthor":
            content = document.querySelector("#authorContent");
            break;
        case "/getLanguage":
            content = document.querySelector("#langContent");
            break;
        case "/getYear":
            content = document.querySelector("#yearContent");
            break;
        case "/getGenre":
            content = document.querySelector("#genreContent");
            break;
        case "/addBook":
            content = document.querySelector("#addBookContent");
            break;
        case "/addReview":
            content = document.querySelector("#reviewBookContent");
            break;
        default:
            content = document.querySelector("#allContent");
            console.log("Unhandled url")
            break;
    }

    let contentString = `<section class="printed-content"><p><span>Status Code:</span> ${response.status}</p>`;
    contentString += `<p><span>Content Length:</span> ${response.headers.get("Content-Length")}</p>`;

    // only gets the response body (and displays something from it) if the response has a body
    if (method === "get" || (method === "post" && response.status !== 204)) {
        const responseText = await response.json();
        contentString += `<p><span>Response Contents:</span> ${JSON.stringify(responseText)}</p>`;
    }
    contentString += `</section>`;

    content.innerHTML = contentString;
}

const sendGetOrHead = async (url, method) => {
    const response = await fetch(url, {
        method: method,
    });

    handleResponse(response, method, url);
}

// sends a post request to /addUser based on form data
const sendPost = async (formName) => {
    const url = formName.getAttribute('action');
    const method = formName.getAttribute('method');
    let formData;

    if (url === '/addReview') {
        const title = document.querySelector("#reviewTitleField").value;
        const review = document.querySelector("#ratingField").value;
        formData = JSON.stringify({ title, review });
    }

    else {
        const title = document.querySelector("#addTitleField").value;
        const author = document.querySelector("#addAuthorField").value;
        const language = document.querySelector("#addLanguageField").value;
        const year = document.querySelector("#addDateField").value;
        const genres = document.querySelector("#addGenreField").value.split(',');
        formData = JSON.stringify({ title, author, language, year, genres });
    }

    // send fetch request w/ data retrieved
    const response = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': formData.length,
        },
        body: formData,
    });

    handleResponse(response, method, url);
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

    const clearButton = document.querySelector('#clearAllContent')

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

    const clearPage = () => {
        const contentSections = document.querySelectorAll(".content");
        contentSections.forEach(section => {
            section.innerHTML = '';
        });
    }

    getBooksForm.addEventListener('submit', (e) => { cancelFormAction(e, requestAllBooksData) });
    getTitleForm.addEventListener('submit', (e) => { cancelFormAction(e, requestTitleData) });
    getAuthorForm.addEventListener('submit', (e) => { cancelFormAction(e, requestAuthorData) });
    getLanguageForm.addEventListener('submit', (e) => { cancelFormAction(e, requestLanguageData) });
    getYearForm.addEventListener('submit', (e) => { cancelFormAction(e, requestYearData) });
    getGenreForm.addEventListener('submit', (e) => { cancelFormAction(e, requestGenreData) });

    addBookForm.addEventListener('submit', addBook);
    addReviewForm.addEventListener('submit', reviewBook);

    clearButton.addEventListener('click', clearPage);
}

window.onload = init;
