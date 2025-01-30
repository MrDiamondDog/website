import { useEffect } from "react";
import { toast } from "sonner";

export function useUserFeed(message: (username: string) => string) {
    return useEffect(() => {
        const interval = setInterval(async() => {
            if (Math.random() < 0.75)
                return;

            await fetch("https://usernameapiv1.vercel.app/api/random-usernames")
                .then(res => res.json())
                .then(data => {
                    toast.success(message(data.usernames[0]));
                });
        }, 1000);

        return () => clearInterval(interval);
    }, []);
}
