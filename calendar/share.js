function shareAjax(event) {
    const recipient_name = document.getElementById("shareCalusername").value; // Get the date from the form

    const token = document.getElementsByName("token")[0].value;

    // Make a URL-encoded string for passing POST data:
    const data = { 'recipient_name': recipient_name, 'token': token };

    fetch("shareEntire.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log(data);
                updateCalendar();
            } else {
                console.log(data);
                document.getElementById("ErrorMessage").innerHTML = data.message;
            }
        })
        .catch(err => {
            console.error(err);
        });



}


document.getElementById("sharecalendar").addEventListener("click", shareAjax, false); // Bind the AJAX call to button click