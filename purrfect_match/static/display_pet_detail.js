function display_pet_detail(id) {
    fetch('/get_animals_dynamic', {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({id:id})
    })
    .then(res => res.json())
    .then(data => {
            // console.log(data); 
            console.log(data[0]);
            console.log(data[0].url)
            
            document.getElementById("content").innerHTML = "";
            let info = document.createElement("div");
            info.classList.add("detail_info");

            let picture = document.createElement("img");
            picture.id = "current_pic";
            picture.src = data[0].url[0];
            picture.alt = "picture not yet available";

            let name = document.createElement("h1");
            name.innerHTML = data[0].name;
            name.id = "current_name";

            let breed = document.createElement("p");
            breed.innerHTML = `<strong>Breed: </strong> ${data[0].breed}<br>`;
            breed.id = "current_breed";

            let description = document.createElement("p");
            description.id = "current_description";
            description.innerHTML = data[0].description;

            info.appendChild(picture);
            info.appendChild(name);
            info.appendChild(breed);
            info.appendChild(description);

            document.getElementById("content").appendChild(info);
    });
}