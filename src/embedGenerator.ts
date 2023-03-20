const Elements = {
    border: document.querySelector(".discord-embed-left-border") as HTMLDivElement,
    authorIcon: document.querySelector(".discord-embed-author-icon") as HTMLImageElement,
    authorName: document.querySelector(".discord-embed-author span") as HTMLSpanElement,
    title: document.querySelector(".discord-embed-title") as HTMLDivElement,
    description: document.querySelector(".discord-embed-description") as HTMLDivElement,
    fieldsContainer: document.querySelector(".discord-embed-fields") as HTMLDivElement,
    image: document.querySelector(".discord-embed-image") as HTMLImageElement,
    thumbnail: document.querySelector(".discord-embed-thumbnail") as HTMLImageElement,
    footerIcon: document.querySelector(".discord-embed-footer-icon") as HTMLImageElement,
    footerContent: document.querySelector(".discord-embed-footer span") as HTMLSpanElement,
    generate: document.querySelector("#generate") as HTMLButtonElement,
    code: document.querySelector("#code") as HTMLTextAreaElement,
    footerSeparator: ` • `
};

const Inputs = {
    border: document.querySelector("#color") as HTMLInputElement,
    authorIcon: document.querySelector("#author-icon") as HTMLInputElement,
    authorURL: document.querySelector("#authorURL") as HTMLInputElement,
    authorName: document.querySelector("#author") as HTMLInputElement,
    title: document.querySelector("#title") as HTMLInputElement,
    titleURL: document.querySelector("#url") as HTMLInputElement,
    description: document.querySelector("#description") as HTMLInputElement,
    fieldContainer: document.querySelector("#fields") as HTMLInputElement,
    image: document.querySelector("#image") as HTMLInputElement,
    thumbnail: document.querySelector("#thumbnail") as HTMLInputElement,
    footerIcon: document.querySelector("#footer-icon") as HTMLInputElement,
    footerContent: document.querySelector("#footer") as HTMLInputElement,
    timestamp: document.querySelector("#timestamp") as HTMLInputElement,
    addField: document.querySelector("#add-field") as HTMLButtonElement,
    fields: [] as any[]
};

function Field(title: string, description: string, inline: boolean) {
    return `
    <div class="discord-embed-field${inline ? " discord-embed-field-inline" : ""}">
        <div class="discord-embed-field-title">${title}</div>
        ${description}
    </div>
    `;
}

function InputField() {
    const num = Inputs.fieldContainer.children.length;

    const field = document.createElement("div");
    field.classList.add("field");
    field.id = "field-" + num;

    field.innerHTML = `
        <h3>Field</h3>
        <input placeholder="Field Title" autocomplete="off" id="field-title"/>
        <input placeholder="Field Description" autocomplete="off" id="field-desc"/>
        <div>
            <label for="inline">Inline</label>
            <input type="checkbox" id="field-inline-${num}" />
            <label for="field-inline-${num}"></label>
        </div>
        <button id="field-remove">Remove</button>
    `;

    Inputs.fields.push({
        title: field.querySelector("#field-title") as HTMLInputElement,
        description: field.querySelector("#field-desc") as HTMLInputElement,
        inline: field.querySelector("#field-inline-" + num) as HTMLInputElement,
        remove: field.querySelector("#field-remove") as HTMLButtonElement
    });

    Inputs.fields[num].remove.addEventListener("click", () => {
        Inputs.fields.splice(num, 1);
        field.remove();
    });

    Inputs.fieldContainer.appendChild(field);
}

Inputs.addField.addEventListener("click", () => InputField());

function generateEmbed() {
    Elements.border.style.borderColor = Inputs.border.value;
    Elements.authorIcon.src = Inputs.authorIcon.value;
    Elements.authorName.innerText = Inputs.authorName.value;
    Elements.title.innerText = Inputs.title.value;
    Elements.description.innerText = Inputs.description.value;
    Elements.image.src = Inputs.image.value;
    Elements.thumbnail.src = Inputs.thumbnail.value;
    Elements.footerIcon.src = Inputs.footerIcon.value;
    Elements.footerContent.innerText = `${Inputs.footerContent.value}${Inputs.timestamp.value != "" ? Elements.footerSeparator + Inputs.timestamp.value : ""}`;

    Elements.fieldsContainer.innerHTML = "";

    for (let i = 0; i < Inputs.fields.length; i++) {
        Elements.fieldsContainer.innerHTML += Field(Inputs.fields[i].title.value, Inputs.fields[i].description.value, Inputs.fields[i].inline.checked);
    }

    Elements.code.value = `{
    "color": "${Inputs.border.value}",
    "title": "${Inputs.title.value}",
    "url": "${Inputs.titleURL.value}",
    "author": {
        "name": "${Inputs.authorName.value}",
        "icon_url": "${Inputs.authorIcon.value}",
        "url": "${Inputs.authorURL.value}"
    },
    "description": "${Inputs.description.value}",
    "thumbnail": {
        "url": "${Inputs.thumbnail.value}"
    },
    "fields": [
        ${Inputs.fields.map((field) => `{ "name": "${field.title.value}", "value": "${field.description.value}", "inline": ${field.inline.checked} }`).join(",\n\t")}
    ],
    "image": {
        "url": "${Inputs.image.value}"
    },
    "timestamp": "${Inputs.timestamp.value}",
    "footer": {
        "text": "${Inputs.footerContent.value}",
        "icon_url": "${Inputs.footerIcon.value}"
    }
}`;
}

Elements.generate.addEventListener("click", () => generateEmbed());
