"use client";

import { useEffect, useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { IoChatbubbleEllipses } from "react-icons/io5";

import Button from "@/components/general/Button";
import Input from "@/components/general/Input";
import Spinner from "@/components/general/Spinner";
import Subtext from "@/components/general/Subtext";
import { AIMessage } from "@/lib/types";



const commandRe = /\[\[([a-z]+)(?:\s(.*?))?\]\]/;

export default function ChatPage() {
    const [loading, setLoading] = useState(false);
    const [ended, setEnded] = useState(false);

    const [content, setContent] = useState("");
    const [messages, setMessages] = useState<AIMessage[]>([{ role: "assistant", content: "hi" }]);

    const messageList = useRef<HTMLDivElement>(null);

    function scrollToBottom() {
        messageList.current?.scrollTo(0, messageList.current.scrollHeight);
    }

    // @ts-expect-error "KeyboardEvent isn't generic" yes it is
    function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (loading || ended) return;
        if (e.key === "Enter") {
            sendMessage();
        }
    }

    function handleCommands(content: string) {
        if (content.match(commandRe)) {
            const [, command, arg] = content.match(commandRe)!;

            switch (command) {
                case "end":
                    setEnded(true);
                    break;
                default:
                    console.error(`Unknown command: ${command}`);
                    break;
            }
        }

        return content.replace(commandRe, "");
    }

    async function sendMessage() {
        if (content.trim() === "") return;
        setContent("");
        setLoading(true);
        setMessages([...messages, { role: "user", content }]);
        const newMessages = [...messages, { role: "user", content }];

        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: newMessages })
            });

            if (!res.ok) {
                console.error("AI failed to respond.");
                return;
            }

            let { message } = await res.json();
            message = handleCommands(message);
            setMessages([...messages, { role: "user", content }, { role: "assistant", content: message }]);
        } catch (e) {
            console.error(e);
            setMessages([...messages, { role: "user", content }, { role: "assistant", content: "i died, check console" }]);
        }

        setLoading(false);
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (<>
        <div className="absolute inset-5 flex flex-col gap-0 drop-shadow-lg">
            <div className="rounded-t-lg p-3 bg-primary flex flex-row gap-2">
                <IoChatbubbleEllipses size={32} />
                <p className="text-center">AI Chatbot</p>
            </div>
            <div className="rounded-b-lg p-3 bg-bg-lighter overflow-y-scroll overflow-x-hidden h-full" ref={messageList}>
                {messages.map((message: AIMessage, i: number) => (
                    <div key={i} className={`flex flex-col gap-1 mb-2 ${message.role === "user" ? "items-end" : "items-start"}`}>
                        <p className={`rounded-lg p-2 ${message.role === "user" ? "bg-primary" : "bg-bg-light"} text-white whitespace-pre-wrap text-wrap`}>{message.content}</p>
                    </div>
                ))}
                {loading && <div className="flex flex-col gap-1 mb-2 items-start"><p className="bg-bg-light p-2 rounded-lg"><Spinner /></p></div>}
                {ended && <Subtext>Conversation ended by chat bot</Subtext>}
            </div>
            <div className="flex flex-row gap-2 mt-2">
                <Input placeholder="Send a message" className="w-full" value={content} onChange={e => setContent(e.target.value)} onKeyDown={onKeyDown} disabled={ended} />
                <Button onClick={sendMessage} disabled={loading || ended}><IoIosSend size={24} /></Button>
            </div>
        </div>
    </>);
}
