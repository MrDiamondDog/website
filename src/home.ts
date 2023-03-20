const welcome = document.getElementById("welcome");
const welcomeText = document.getElementById("welcome-text");
const nav = document.getElementById("navbar");

if (welcome == null || welcomeText == null || nav == null) {
    throw new Error("stfu typescript");
}

var isNav = false;
var isTransitioning = false;

setInterval(async () => {
    const scroll = window.scrollY;

    if (scroll > 100) {
        if (!isNav) {
            if (isTransitioning) return;

            isTransitioning = true;

            welcome.style.animation = "welcome-to-nav 0.5s forwards";
            welcomeText.animate([{opacity: 1}, {opacity: 0}], {
                duration: 100,
                fill: "forwards"
            });

            isNav = true;

            await sleep(400);

            nav.style.display = "block";

            welcome.animate([{opacity: 1}, {opacity: 0}], {
                duration: 200,
                fill: "forwards"
            });
            nav.animate([{opacity: 0}, {opacity: 1}], {
                duration: 200,
                fill: "forwards"
            });

            await sleep(200);

            welcome.style.display = "none";

            isTransitioning = false;
        }
    } else if (isNav) {
        if (isTransitioning) return;

        isTransitioning = true;

        nav.animate([{opacity: 1}, {opacity: 0}], {
            duration: 200,
            fill: "forwards"
        });
        welcome.animate([{opacity: 0}, {opacity: 1}], {
            duration: 200,
            fill: "forwards"
        });

        await sleep(200);

        nav.style.display = "none";
        welcome.style.display = "block";

        welcome.style.animation = "nav-to-welcome 0.8s forwards";
        welcomeText.animate([{opacity: 0}, {opacity: 1}], {
            duration: 200,
            fill: "forwards"
        });

        isNav = false;

        isTransitioning = false;
    }
}, 100);

async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
