//https://stackoverflow.com/questions/26107125/cannot-read-property-addeventlistener-of-null
document.addEventListener('DOMContentLoaded', () => {
let form = document.getElementById("searchbtn");
let user_input = document.getElementById("user_input");
let display = document.getElementById("content");

function access() {
    event.preventDefault(); 
    user_input = document.getElementById("user_input").value;
    //referenced 330 Rapid Prototype Dev and Creative Programming
    fetch(`https://api.harvardartmuseums.org/object?title=${user_input}&size=20&apikey=a0f5135b-1831-4015-add9-776026930825`)
        .then(response => response.json())
        .then(data => {
            const records = data.records;
            
            display.innerHTML = '';
            records.forEach(record => {
                let item = document.createElement("div");
                item.classList.add("item");

                let img = document.createElement("img");
                img.classList.add("image");
                img.src = `${record.primaryimageurl}?height=300&width=300`;
                img.alt = "Image not Available";
                console.log(record.imageid);
                item.appendChild(img);

                let author = document.createElement("div");
                author.classList.add("author");
                author.innerHTML = `${record.people[0].displayname}`;
                item.appendChild(author);

                let gap = document.createElement("br");
                item.appendChild(gap);
                let name = document.createElement("div");
                name.classList.add("name");
                name.innerHTML = `${record.title}`;
                item.appendChild(name);

                let year = document.createElement("div");
                year.classList.add("year");
                year.innerHTML = `${record.accessionyear}`;
                item.appendChild(year);

                if(record.description != null){
                    item.appendChild(gap);
                    let description = document.createElement("div");
                    description.classList.add("description");
                    description.innerHTML = `${record.description}`;
                    item.appendChild(description);
                }

                display.appendChild(item);
            });
            console.log(data);
        })
        .catch(error => console.error(error));
}

form.addEventListener("click", access);
});