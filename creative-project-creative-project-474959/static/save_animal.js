function save_animal(id, heart) {
    console.log("id: ", id)
     fetch("/save_animal", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id:id})
    })
    .then(res => res.json())
        .then(data => {
            if(data.success){
                if (data.liked) {
                    heart.classList.add("saved");
                } else {
                    heart.classList.remove("saved");
                }
            } 
    })
    .catch(error => {
        console.error("Fetch error:", error);
        alert("Network error while adding event.");
    });
}