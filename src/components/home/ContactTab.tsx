"use client";

import { useState } from "react";
import Button from "../general/Button";
import Divider from "../general/Divider";
import Input from "../general/Input";
import { toast } from "sonner";

export default function ContactTab() {
    const [discord, setDiscord] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    async function submit() {
        if (!discord || !subject || !message) return toast.error("Please fill out all fields.");

        await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ discord, subject, message }),
        }).then(res => {
            if (!res.ok) throw res;
            toast.success("Message sent. Expect a response... eventually.");

            setDiscord("");
            setSubject("");
            setMessage("");
        }).catch(res => {
            res.json().then(data => {
                toast.error(`${data.body}\nStatus Code: ${res.status}`);
            });
        });
    }

    return (<>
        <p>
        Contact me about anything! An issue with a project or if you just have any questions!

        I will respond to you via Discord, please make sure you have message requests open!
        </p>

        <Divider />

        <div className="flex flex-col gap-4">
            <Input type="text" value={discord} onChange={e => setDiscord(e.target.value)} placeholder="@jonah" label="Discord User" required maxLength={20} />
            <Input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Just saying hi" label="Subject" required maxLength={256} />
            <Input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="hi" label="Message" multiline="true" required maxLength={2048} />

            <Button onClick={submit}>Submit</Button>
        </div>
    </>);
}