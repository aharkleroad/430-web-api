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
    // const url = formName.getAttribute('action');
    const method = document.querySelector("#allMethodSelect").value;

    // send fetch request w/ retrieved form data
    const response = await fetch('/getBooks', {
        method: method,
    });

    handleResponse(response, method);
}

const requestAuthorData = async () => {
    const method = document.querySelector("#authorMethodSelect").value;
    const author = document.querySelector("#authorField").value;

    // send fetch request w/ retrieved form data
    const response = await fetch(`/getAuthor?author=${author}`, {
        method: method,
    });

    handleResponse(response, method);
}

const requestLanguageData = async () => {
    const method = document.querySelector("#languageMethodSelect").value;
    const language = document.querySelector("#languageField").value;

    // send fetch request w/ retrieved form data
    const response = await fetch(`/getLanguage?language=${language}`, {
        method: method,
    });

    handleResponse(response, method);
}

// adds submit event listeners to both forms
const init = () => {
    const getBooksForm = document.querySelector("#allBooksForm");
    const getAuthorForm = document.querySelector("#authorForm");
    const getLanguageForm = document.querySelector("#languageForm");

    const getPageForm = document.querySelector("#addBookForm");

    const getAllBooks = (e) => {
        e.preventDefault();
        requestAllBooksData();
        return false;
    }

    const getAuthorBooks = (e) => {
        e.preventDefault();
        requestAuthorData();
        return false;
    }

    const getLanguageBooks = (e) => {
        e.preventDefault();
        requestLanguageData();
        return false;
    }

     const addBook = (e) => {
        e.preventDefault();
        sendPost(addUserForm);
        return false;
    }

    getBooksForm.addEventListener('submit', getAllBooks);
    getAuthorForm.addEventListener('submit', getAuthorBooks);
    getLanguageForm.addEventListener('submit', getLanguageBooks);

    getPageForm.addEventListener('submit', addBook);
}

window.onload = init;
