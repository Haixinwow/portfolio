function signupAjax(event) {
    const username = document.getElementById("usernameInput").value; // Get the username from the form
    const password = document.getElementById("passwordInput").value; // Get the password from the form
    const token = document.getElementsByName("token")[0].value;

    // Make a URL-encoded string for passing POST data:
    const data = { 'username': username, 'password': password, 'token': token};

    fetch("signup_ajax.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loginStatus").innerText = "Logged in as " + data.username;
                updateCalendar();
            } else {
                document.getElementById("ErrorMessage").innerHTML = data.message;
            }
        })

    .catch(err => console.error(err));
}

document.getElementById("signup_btn").addEventListener("click", signupAjax, false); // Bind the AJAX call to button click