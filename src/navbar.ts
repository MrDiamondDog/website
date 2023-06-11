const navbar = document.createElement("div");
navbar.classList.add("navbar");
navbar.id = "navbar";

navbar.innerHTML = `
    <a href="/" class="nav-item">Home</a>
    <a class="nav-item" id="gen-dropdown">Generators</a>
    <div class="dropdown-content" id="gen-content">
        <a href="/generators/discordjs-embed/" class="dropdown-item">Discord.js Embed</a>
        <a href="/generators/oneblock/" class="dropdown-item">Minecraft Oneblock Command</a>
    </div>
    <a href="./" class="nav-item" id="game-dropdown">Games</a>
    <div class="dropdown-content" id="game-content">
        <a href="/games/logic-gate/" class="dropdown-item">Logic Gate Sim</a>
    </div>
`;

document.body.appendChild(navbar);
if (window.location.pathname == "/" || window.location.pathname == "/index.html") {
    navbar.style.opacity = "0";
}

const googleFonts = document.createElement("link");
googleFonts.rel = "stylesheet";
googleFonts.href =
    "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200";

document.head.appendChild(googleFonts);

function dropdown(dropdownId: string, dropdownContentId: string) {
    const dropdown = document.getElementById(dropdownId);
    const dropdownContent = document.getElementById(dropdownContentId);

    if (dropdown == null || dropdownContent == null) {
        throw new Error("Dropdown not found");
    }

    dropdown.innerHTML += `<span class="material-symbols-outlined dropdown">expand_more</span>`;

    dropdownContent.style.left = `${dropdown.offsetLeft}px`;
    dropdownContent.style.width = `${dropdown.offsetWidth}px`;

    dropdown.addEventListener("mouseover", () => {
        dropdownContent.classList.toggle("show");
    });

    dropdownContent.addEventListener("mouseleave", () => {
        dropdownContent.classList.remove("show");
    });

    dropdownContent.addEventListener("click", () => {
        dropdownContent.classList.remove("show");
    });
}

dropdown("gen-dropdown", "gen-content");
dropdown("game-dropdown", "game-content");
