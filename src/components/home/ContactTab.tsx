"use client";

import { FormEvent, useState } from "react";
import Button from "../general/Button";
import Spinner from "../general/Spinner";
import Input from "../general/Input";

const randomPlaceholders = [
    {
        name: "Elon Musk",
        email: "elonmusk@x.com",
        message: "Buy Tesla Cybertruck or I'll kms",
    },
    {
        name: "Sam Altman",
        email: "samaltman@openai.com",
        message: "I would like to sponsoir you to promote my AI slop machines",
    },
    {
        name: "Darrel Johnson",
        email: "darreljohnson@hotmail.com",
        message: "Collect my daily stock images",
    },
    {
        name: "blobcatcozy",
        email: "blobcatcozy@http.cat",
        message: ":blobcatcozy: :blobcatcozy: :blobcatcozy:",
    },
    {
        name: "Horse",
        email: "horse@stable.org",
        message: "How hungry...",
    },
];

export default function ContactTab() {
    const [result, setResult] = useState("");
    const [loading, setLoading] = useState(false);

    const placeholder = randomPlaceholders[Math.floor(Math.random() * randomPlaceholders.length)];

    async function onSubmit(event: FormEvent) {
        event.preventDefault();
        setResult("Sending...");
        setLoading(true);

        const formData = new FormData(event.target as HTMLFormElement);

        // yes this key is public
        formData.append("access_key", "97f746ff-7238-4df3-93a1-979cee22da7c");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            setResult("Success!");
            (event.target as HTMLFormElement).reset();
        } else {
            console.log("Error", data);
            setResult(data.message);
        }

        setLoading(false);
    }

    return (<>
        <p>
        Contact me about anything! An issue with a project or if you just have any questions!
        (or even suggest new placeholder messages...)
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-2 mt-2">
            <Input type="text" label="Name" name="name" placeholder={placeholder.name} required/>
            <Input type="email" label="Email" name="email" placeholder={placeholder.email} required/>
            <Input name="message" label="Message" placeholder={placeholder.message}
                multiline required />

            <Button type="submit" disabled={!!result || loading}>
                {loading && <Spinner />}
                {!result && "Submit"}
                {result}
            </Button>
        </form>
    </>);
}
