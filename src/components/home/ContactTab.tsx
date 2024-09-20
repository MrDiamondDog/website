"use client";


import { APIUser } from "discord-api-types/v10";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { authUrl, getUser } from "@/lib/discord";

import Button from "../general/Button";
import Divider from "../general/Divider";
import Input from "../general/Input";
import Spinner from "../general/Spinner";
import Subtext from "../general/Subtext";

export default function ContactTab() {
    const [clientId, setClientId] = useState("");
    const [user, setUser] = useState<APIUser | null>(null);

    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const requested = useRef(false);
    useEffect(() => {
        if (requested.current) return;
        requested.current = true;

        (async () => {
            let newToken = "";

            await fetch("/api/discord?token=true").then(res => res.json()).then(json => newToken = json.access_token);
            if (!newToken) setClientId(await getClientId());
            else await getUser(newToken).then(user => setUser(user));
        })();
    }, []);

    async function getClientId() {
        return await fetch("/api/discord?clientId=true").then(res => res.json()).then(json => json.clientId);
    }

    async function signOut() {
        await fetch("/api/discord", { method: "DELETE" });

        setUser(null);
        setClientId(await getClientId());
    }


    async function submit() {
        if (!user || !subject || !message) return toast.error("Please fill out all fields.");

        await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, subject, message }),
        }).then(res => {
            if (!res.ok) throw res;
            toast.success("Message sent. Expect a response... eventually.");

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
            {clientId && <a href={authUrl(clientId)} className="no-style"><Button>Authorize With Discord</Button></a>}
            {(!user && !clientId) && <Spinner />}
            {user && <div>
                <div className="flex flex-row gap-3 items-center bg-bg-lighter p-3 rounded-lg">
                    <img src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`} alt="Avatar" className="rounded-full w-[50px] md:w-[75px]" />
                    <div>
                        <h3 className="text-sm md:text-3xl">{user.global_name}</h3>
                        <Subtext>@{user.username}</Subtext>
                        <a href="#" className="text-sm text-red-500" onClick={signOut}>Sign Out</a>
                    </div>
                </div>
                <Divider />
                <Input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Just saying hi" label="Subject" required maxLength={256} />
                <Input type="text" value={message} onChange={e => setMessage(e.target.value)} placeholder="hi" label="Message" multiline="true" required maxLength={2048} />

                <Button onClick={submit} className="w-full mt-2">Submit</Button>
            </div>}
        </div>
    </>);
}
