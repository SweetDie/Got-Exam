const URL = "https://thronesapi.com/api/v2/Characters";
let CHARACTERS;

class CharactersManager {
    async loadCharacters() {
        if(localStorage.getItem("characters") === null) {
            await this.Request();
        }
        else {
            this.characters = JSON.parse(localStorage.getItem("characters"));
            this.maxCharacters = this.characters.length;
            CHARACTERS = this.characters;
        }

        this.max = document.getElementById("maxCharacters");
        this.select = document.getElementById("select");
        this.count = parseInt(document.getElementById("select").value);
        this.btnSearch = document.getElementById("btnSearch");

        // Search
        this.btnSearch.addEventListener("click", (event) => {
            const searchField = document.getElementById("searchField");
            let searchValue = searchField.value;
            let character = CHARACTERS.filter(item => item.fullName.toLowerCase().includes(searchValue.toLowerCase().trim()));
            this.characters = character;
            this.startId = 0;
            this.countElements = this.startId + this.count;
            try {
                this.WriteCard(character[0]);
            } catch (error) {
                console.log(error);
            }
            this.clear();
            this.printCharacters();
        });

        // Selector
        this.select.addEventListener("change", (event) => {
            this.count = parseInt(event.target.value);
            this.countElements = this.startId + this.count;
            this.clear();
            this.printCharacters();
        });

        this.startId = 0;
        this.maxCharacters = this.characters.length;
        this.countElements = this.select.value;
        this.WriteCard(this.characters[0]);

        // Buttons Next Prev
        document.getElementById("btnNext").onclick = () => {
            this.Next();
        };

        document.getElementById("btnPrevious").onclick = () => {
            this.Previous();
        };
    
        this.printCharacters();
    }

    async Request() {

        const response = await fetch(URL);
        const res = await response.json();
        localStorage.setItem("characters", JSON.stringify(res));

        this.characters = JSON.parse(localStorage.getItem("characters"));
        this.maxCharacters = this.characters.length;
        CHARACTERS = this.characters;
    }

    clear() {
        let tableBody = document.getElementById("tableBody");
        while (tableBody.firstChild) {
            tableBody.removeChild(tableBody.firstChild);
        }
    }

    Next() {
        this.startId = this.startId + this.count;
        this.countElements = this.startId + this.count;
        if(this.countElements >= this.characters.length) {
            this.countElements = this.characters.length;
            document.getElementById("btnNext").disabled = true;
        }
        document.getElementById("btnPrevious").disabled = false;
        this.clear();
        this.printCharacters();
    }
    
    Previous() {
        this.startId = this.startId - this.count;
        if(this.startId <= 0) {
            this.startId = 0;
            document.getElementById("btnPrevious").disabled = true;
        }
        this.countElements = this.startId + this.count;
        document.getElementById("btnNext").disabled = false;
        this.clear();
        this.printCharacters();
    }

    updateCounter() {
        if(this.select.value !== this.countElements) {
            this.printCharacters();
        }
    }

    getCharacters() {
        return this.characters;
    }

    setCount(count) {
        this.count = count;
    }

    setStartId(startId) {
        this.startId = startId;
    }

    setCountElements(countElements) {
        this.countElements = countElements;
    }
    
    printCharacters () {
        this.PainList(this.characters);
    }

    PainList(characters) {

        let count;

        if(characters.length <= this.countElements) {
            count = characters.length;
            document.getElementById("btnNext").disabled = true;
        }
        else {
            count = this.countElements;
            document.getElementById("btnNext").disabled = false;
        }

        const tableBody = document.getElementById("tableBody");
        for (let i = this.startId; i < count; i++) {
            const tr = document.createElement("tr");
            const td1 = document.createElement("td");
            const td2 = document.createElement("td");
            const td3 = document.createElement("td");
            const image = document.createElement("img");
            
            tr.addEventListener("click", (event) => {
                let id = parseInt(event.currentTarget.firstChild.innerHTML);
                this.WriteCard(characters.find(item => item.id === id));
            });

            image.setAttribute("src", characters[i].imageUrl);
            image.setAttribute("class", "img-small img-fluid");

            td1.innerHTML = characters[i].id;
            td2.innerHTML = characters[i].firstName;
            td3.appendChild(image);

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);

            tableBody.appendChild(tr);
        }

        this.max.innerHTML = `${this.startId + 1} – ${count} of ${characters.length}`;
    }

    WriteCard(character) {
        const characterName = document.getElementById("characterName");
        const characterId = document.getElementById("ID");
        const firstName = document.getElementById("firstName");
        const lastName = document.getElementById("lastName");
        const fullName = document.getElementById("fullName");
        const title = document.getElementById("title");
        const family = document.getElementById("family");
        const image = document.getElementById("imageCard");
        const imageUrl = document.getElementById("imageUrlCard");
        const cardImage = document.getElementById("cardImage");

        cardImage.setAttribute("src", character.imageUrl);
        characterName.innerHTML = character.fullName;
        characterId.innerHTML = character.id;
        firstName.innerHTML = character.firstName;
        lastName.innerHTML = character.lastName;
        fullName.innerHTML = character.fullName;
        title.innerHTML = character.title;
        family.innerHTML = character.family;
        image.innerHTML = character.image;
        imageUrl.innerHTML = character.imageUrl;
    }
}

let cm = new CharactersManager();
cm.loadCharacters();