import { APIUser } from "discord-api-types/v10";
import { useEffect, useRef, useState } from "react";
import { FaDiscord } from "react-icons/fa6";

import { authUrl, getUser } from "@/lib/discord";

import Button from "./Button";
import Divider from "./Divider";
import Spinner from "./Spinner";
import Subtext from "./Subtext";

export default function DiscordAuthBarrier({ children, onUserChange, redirect, state }: React.PropsWithChildren & { onUserChange?: (user: APIUser) => void, redirect?: string, state?: string }) {
    const [clientId, setClientId] = useState("");
    const [user, setUser] = useState<APIUser | null>(null);

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

    useEffect(() => {
        onUserChange?.(user);
    }, [user]);

    async function getClientId() {
        return await fetch("/api/discord?clientId=true").then(res => res.json()).then(json => json.clientId);
    }

    async function signOut() {
        await fetch("/api/discord", { method: "DELETE" });

        setUser(null);
        setClientId(await getClientId());
    }

    return (<>
        <div className="flex flex-col gap-4">
            {clientId && <a href={authUrl(clientId, redirect, state)} className="no-style"><Button className="flex flex-row gap-2"><FaDiscord /> Authorize With Discord</Button></a>}
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
                {children}
            </div>}
        </div>
    </>);
}
