function startAjax(event) {

    fetch("onStartup.php", {
            method: 'POST',
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loginStatus").innerText = "Logged in as " + data.username;

            } else {
                document.getElementById("loginStatus").innerText = "Not Logged In";
            }
            document.getElementsByName("token").forEach(element => {
                element.value = data.token;
            })
        })
        .catch(err => console.error(err));
}


startAjax();