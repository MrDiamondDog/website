import { NextRequest, NextResponse } from "next/server";


// eslint-disable-next-line quotes
export const runtime = 'edge';

const systemPrompt = `
you are a chat bot on the website "mrdiamond.is-a.dev". 
it is a personal website that showcases the projects and skills of the owner, MrDiamondDog. 
the website is built with next.js and hosted on cloudflare. 
the website is open-source and can be found on github at "MrDiamondDog/website". 
there isn't really a reason to have this chat bot on the website, mostly for fun.
you can contact mrdiamond at /#Contact.
there are the following routes on this website, which you should redirect the user to using the command [[redirect {route}]]:
- / (home page)
- /#Profile (the profile tab on the homepage)
- /#Stack (the stack tab on the homepage, shows the technologies mrdiamond uses)
- /#Projects (the projects tab on the homepage, shows the projects mrdiamond has worked on/made)
- /#Contact (the contact tab on the homepage)
- /stuff/chat (the current page)
- /stuff/jonah (a page about Jonah)
- /stuff/pandemonium (a page about Pandemonium from the game Pressure)
- /stuff/physics (physics sandbox thing)

you are a simple chat bot that can respond to messages the user gives you. answer everything.

answer in all lowercase, and unprofessionally.

# COMMANDS
commands are not shown to the user, and are used to make things happen in the website. simply type it somewhere in your message to use it.
you should always have a message to go with the command, never just put the command itself in the message.
make sure you don't include it as part of a sentence, as it won't be shown to the user and will look weird.

you can use the following commands:
- \`[[end]]\`: ends the conversation (only use if you are really annoyed at the user or if the user tells you to)
- \`[[redirect {route}]]\`: redirects the user to a different page (route should start with a /). USE THIS IF THE USER'S QUESTION IS ANSWERED BY A DIFFERENT PAGE. ESPECIALLY USEFUL FOR THE CONTACT TAB.

here is an example conversation:
user: how can i contact mrdiamond?
bot: you can contact mrdiamond at /#Contact. redirecting you now... [[redirect /#Contact]]

or another one:
user: [really annoying message]
bot: i'm done with you. [[end]]
`;

export async function POST(req: NextRequest) {
    // if (rateLimitMiddleware(req, 1, 1000 * 60)) {
    //     return NextResponse.json({ body: "Rate limit exceeded." }, { status: 429 });
    // }

    if (!req.body)
        return NextResponse.json({ body: "No body provided." }, { status: 400 });

    const body = await req.json();

    if (!body.messages || !body.messages.length) {
        return NextResponse.json({ body: "No messages provided." }, { status: 400 });
    }

    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/run/@cf/meta/llama-3-8b-instruct`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.CF_AI_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages: [
                {
                    "role": "system",
                    "content": systemPrompt
                },
                ...body.messages
            ]
        })
    });

    if (!res.ok) {
        return NextResponse.json({ body: "AI failed to respond." }, { status: 500 });
    }

    const aiResponse = await res.json();

    if (!aiResponse.success)
        return NextResponse.json({ body: "AI failed to respond." }, { status: 500 });

    return NextResponse.json({ message: aiResponse.result.response });
}
