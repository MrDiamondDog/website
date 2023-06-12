const bg = document.createElement("div") as HTMLDivElement;
bg.id = "footer-bg";

bg.innerHTML = `
<div class="footer-content">
    <div class="footer-col">
        <a href="https://github.com/MrDiamondDog/website">
            <img src="/images/git.png" alt="logo" class="clickable" />
        </a>
    </div>
    <div class="footer-col">
        <h2>Generators</h2>
        <p><a href="/generators/discordjs-embed/">Discord.js Embed</a></p>
        <p><a href="/generators/oneblock/">Minecraft One Block</a></p>
    </div>
    <div class="footer-col">
        <h2>Games</h2>
        <p><a href="/games/logic-gate/">Logic Gate Sim</a></p>
    </div>
</div>
`;

document.body.appendChild(bg);
