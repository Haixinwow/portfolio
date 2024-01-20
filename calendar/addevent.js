function addeventAjax(event) {
    const date = document.getElementById("eventDateInput").value; // Get the date from the form
    const time = document.getElementById("eventTimeInput").value; // Get the time from the form
    const text = document.getElementById("eventNameInput").value; // Get the event info from the form
    const token = document.getElementsByName("token")[0].value;

    // Make a URL-encoded string for passing POST data:
    let tag = document.getElementsByName("tag");
    tag.forEach(element => {
        if (element.checked) {
            tag = element.value;
        }
    });

    const data = { 'date': date, 'time': time, 'text': text, 'token': token, 'tag': tag };

    fetch("addevent.php", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'content-type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                updateCalendar();
            } else {
                document.getElementById("ErrorMessage").innerHTML = data.message;
            }
        })
        .catch(err => {
            console.error(err);
        });
}

document.getElementById("eventInputButton").addEventListener("click", addeventAjax, false); // Bind the AJAX call to button click