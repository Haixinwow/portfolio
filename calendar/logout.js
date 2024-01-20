function logoutAjax(event) {
    fetch("logout_ajax.php", {
            method: 'POST',
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loginStatus").innerText = "Not Logged In";
                updateCalendar();
                //this refreshes and recreates the token 
                startAjax();
            } else {
                console.log(data);
                document.getElementById("ErrorMessage").innerHTML = data.message;
            }

        })
        .catch(err => console.error(err));
}

document.getElementById("logout_btn").addEventListener("click", logoutAjax, false); // Bind the AJAX call to button click