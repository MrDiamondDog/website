"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import Button from "@/components/general/Button";
import Divider from "@/components/general/Divider";
import Input from "@/components/general/Input";
import Select from "@/components/general/Select";
import Spinner from "@/components/general/Spinner";
import { backendDevUrl, backendProdUrl } from "@/lib/contants";
import { getYTVideoId, isValidYTUrl } from "@/lib/ytdl";

const backendUrl = process.env.NEXT_PUBLIC_PRODUCTION ? backendProdUrl : backendDevUrl;

export default function YoutubeDownloaderPage() {
    const [url, setUrl] = useState("");
    const [validUrl, setValidUrl] = useState(false);
    const [videoId, setVideoId] = useState("");

    const [format, setFormat] = useState("any");
    const [video, setVideo] = useState(true);
    const [audio, setAudio] = useState(true);

    const [downloading, setDownloading] = useState(false);

    async function download() {
        if (downloading || !url || !videoId)
            return;
        if (format === "any" && !video && !audio)
            return toast.error("You have to select something");

        setDownloading(true);

        const res = await fetch(`${backendUrl}/ytdl?videoId=${videoId}&format=${format}&video=${video}&audio=${audio}`);

        if (!res.ok) {
            toast.error("An error occurred. Please try again later.");
            return setDownloading(false);
        }

        const filename = res.headers.get("Content-Disposition")?.split("filename=")[1].replaceAll("\"", "");

        const blob = await res.blob();
        const objUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objUrl;
        a.download = filename;
        a.click();

        setDownloading(false);
    }

    useEffect(() => {
        if (!url)
            return setValidUrl(false);
        const valid = isValidYTUrl(url);
        setValidUrl(valid);

        if (!valid) {
            setVideoId("");
            toast.error("Invalid URL");
            return;
        }

        const newId = getYTVideoId(url);
        setVideoId(newId);
    }, [url]);

    return (
        <main className="absolute-center p-5 rounded-lg border-2 border-primary bg-bg-light w-1/2">
            <Input
                label="URL"
                placeholder="https://www.youtube.com/watch?v=oiIOPefKho0"
                value={url}
                onChange={e => setUrl(e.target.value)}
            />
            <Divider />
            <p>File Format</p>
            <Select className="w-full mb-2" value={format} onChange={e => setFormat(e.target.value)}>
                <option value="any">any</option>
                <option value="mp4">mp4</option>
                <option value="webm">webm</option>
                <option value="mp3">mp3</option>
                <option value="ogg">ogg</option>
                <option value="wav">wav</option>
            </Select>
            <Input
                label="Video"
                type="checkbox"
                checked={video}
                onChange={e => setVideo(e.target.checked)}
                disabled={format !== "any"}
            />
            <Input
                label="Audio"
                type="checkbox"
                checked={audio}
                onChange={e => setAudio(e.target.checked)}
                disabled={format !== "any"}
            />
            <Divider />
            <Button
                className="w-full"
                onClick={download}
                disabled={!url || !validUrl || !videoId || downloading}
            >
                {downloading ? <Spinner /> : "Download"}
            </Button>
        </main>
    );
}
