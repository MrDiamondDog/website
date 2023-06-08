"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const welcome = document.getElementById("welcome");
const welcomeText = document.getElementById("welcome-text");
const nav = document.getElementById("navbar");
if (welcome == null || welcomeText == null || nav == null) {
    throw new Error("stfu typescript");
}
var isNav = false;
var isTransitioning = false;
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    const scroll = window.scrollY;
    if (scroll > 100) {
        if (!isNav) {
            if (isTransitioning)
                return;
            isTransitioning = true;
            welcome.style.animation = "welcome-to-nav 0.5s forwards";
            welcomeText.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: 100,
                fill: "forwards"
            });
            isNav = true;
            yield sleep(400);
            nav.style.display = "block";
            welcome.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: 200,
                fill: "forwards"
            });
            nav.animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: 200,
                fill: "forwards"
            });
            yield sleep(200);
            welcome.style.display = "none";
            isTransitioning = false;
        }
    }
    else if (isNav) {
        if (isTransitioning)
            return;
        isTransitioning = true;
        nav.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 200,
            fill: "forwards"
        });
        welcome.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 200,
            fill: "forwards"
        });
        yield sleep(200);
        nav.style.display = "none";
        welcome.style.display = "block";
        welcome.style.animation = "nav-to-welcome 0.8s forwards";
        welcomeText.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 200,
            fill: "forwards"
        });
        isNav = false;
        isTransitioning = false;
    }
}), 100);
window.addEventListener("load", () => {
    for (const element of document.querySelectorAll(".project")) {
        element.addEventListener("click", () => {
            console.log("click");
            const url = element.getAttribute("data-url");
            if (url == null)
                return;
            window.location.href = url;
        });
    }
});
function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => setTimeout(resolve, ms));
    });
}
