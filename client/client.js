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
        console.log(responseText);
        // displays if request was made to get users
        if (responseText.users) {
            content.innerHTML += `<p>${JSON.stringify(responseText.users)}</p>`;
        }
        else if (responseText.message) {
            content.innerHTML += `<p>Message: ${JSON.stringify(responseText.message)}</p>`;
        }
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
const sendGetOrHead = async () => {
    const url = document.querySelector("#urlField").value;
    const method = document.querySelector("#methodSelect").value;

    // send fetch request w/ retrieved form data
    const response = await fetch(url, {
        method: method,
    });

    handleResponse(response, method);
}

// adds submit event listeners to both forms
const init = () => {
    const addUserForm = document.querySelector("#nameForm");
    const getPageForm = document.querySelector("#userForm");

    const addUser = (e) => {
        e.preventDefault();
        sendPost(addUserForm);
        return false;
    }

    const fetchPage = (e) => {
        e.preventDefault();
        sendGetOrHead();
        return false;
    }

    addUserForm.addEventListener('submit', addUser);
    getPageForm.addEventListener('submit', fetchPage);
}

window.onload = init;
