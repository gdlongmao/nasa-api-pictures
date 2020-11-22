const resultsNav = document.getElementById("resultsNav");
const favouritesNav = document.getElementById("favouritesNav");
const imagesContainer = document.querySelector(".images-container");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");

// NASA API
const count = 10;
const apiKey = "qgCkdAQOhBX5t6SB9nKCPbSv099FdNkhFSMpo9Jt";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favourites = {};

function showContent(page){
    window.scrollTo({top: 0, behavior: "instant"});
    if(page === "results"){
        resultsNav.classList.remove("hidden");
        favouritesNav.classList.add("hidden");
    }else{
        resultsNav.classList.add("hidden");
        favouritesNav.classList.remove("hidden");
    }
    loader.classList.add("hidden");
}

function createDOMNodes(page) {
    const currentArray = page === "results" ? resultsArray : Object.values(favourites);
    currentArray.forEach((result) => {
        //   Card Container
        const card = document.createElement("div");
        card.classList.add("card");
        // Link
        const link = document.createElement("a");
        link.href = result.hdurl;
        link.title = "View Full Image";
        link.target = "_blank";
        // Image
        const image = document.createElement("img");
        image.src = result.url;
        image.alt = "NASA Picture of the Day";
        image.loading = "lazy";
        image.classList.add("card-img-top");
        // Card Body
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        // Card Title
        const cardTitle = document.createElement("h5");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = result.title;
        // Save Text
        const saveText = document.createElement("p");
        saveText.classList.add("clickable");
        if (page === "results") {
            saveText.textContent = "Add To Favourites";
            saveText.setAttribute("onClick", `saveFavourite('${result.url}')`);
        } else {
            saveText.textContent = "Remove Favourites";
            saveText.setAttribute("onClick", `removeFavourite('${result.url}')`);
        }
        // Card Text
        const cardText = document.createElement("p");
        cardText.textContent = result.explanation;
        // Footer Container
        const footer = document.createElement("small");
        footer.classList.add("text-muted");
        // Date
        const date = document.createElement("strong");
        date.textContent = result.date;
        // Copyright
        const copyrightResult = result.copyright === undefined ? "" : result.copyright;
        const copyright = document.createElement("span");
        copyright.textContent = ` ${copyrightResult}`;
        // Append 
        footer.append(date, copyright);
        cardBody.append(cardTitle, cardText, saveText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    })
}

function updateDOM(page) {
    // Get Favourites from localStorage
    if (localStorage.getItem("nasaFavourites")) {
        favourites = JSON.parse(localStorage.getItem("nasaFavourites"));
    };
    imagesContainer.textContent = "";
    createDOMNodes(page);
    showContent(page);
}

// Get 10 Images From NASA API
async function getNasaPictures() {
    // Show Loader
    loader.classList.remove("hidden");
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM("results");
    } catch (error) {

    }
}

// Add result to favourites
function saveFavourite(itemUrl) {
    // Loop through Results Array to select Favourite
    resultsArray.forEach((item) => {
        if (item.url.includes(itemUrl) && !favourites[itemUrl]) {
            favourites[itemUrl] = item;
            // Show Save Confirmation for 2 seconds
            saveConfirmed.classList.remove("hidden");
            setTimeout(() => {
            saveConfirmed.classList.add("hidden");
            }, 2000);
            // Set Favourites in localStorage
            localStorage.setItem("nasaFavourites", JSON.stringify(favourites));
        }
    });
}

// Remove item from Favourites
function removeFavourite(itemUrl) {
    if (favourites[itemUrl]) {
        delete favourites[itemUrl];
        // Set Favourites in localStorage
        localStorage.setItem("nasaFavourites", JSON.stringify(favourites));
        updateDOM("favourites");
    }
}

// On Load
getNasaPictures();