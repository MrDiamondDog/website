"use client";

import { FormEvent, useState } from "react";
import { toast } from "sonner";

import Button from "@/components/general/Button";
import Divider from "@/components/general/Divider";
import Input from "@/components/general/Input";
import Spinner from "@/components/general/Spinner";

export default function SubmitCatPage() {
    const [name, setName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        if (!name || !image) {
            toast.error("Please provide both a name and an image.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("image", image);

        const res = await fetch("/api/cats", {
            method: "POST",
            body: formData,
        });

        if (!res.ok) {
            const { error } = await res.json();
            setLoading(false);

            return toast.error(`${res.status}: ${error}`);
        }

        const data = await res.json();
        setResponse(data);
        setLoading(false);
        toast.success("Submitted! Please wait a while for your cat to be reviewed.");
    }

    return (<div className="my-10 md:w-2/3 w-full md:mx-auto border border-bg-lighter p-10 rounded-lg">
        <h1>Submit a Cat</h1>
        <p>Please use the form below to upload your cat.</p>
        <p><strong>All images are manually reviewed, please do not post anything other than cats &lt;3</strong></p>

        <form onSubmit={handleSubmit} className="p-3 bg-bg-light rounded-lg">
            <Input label="Name" value={name} onChange={e => setName(e.target.value)} />
            <Input label="Image" onChange={e => setImage(e.target.files[0])} type="file" accept="image/*" />
            <Divider />
            <Button type="submit" className="w-full" disabled={loading}>{loading && <Spinner />} Submit</Button>
        </form>
    </div>);
}
