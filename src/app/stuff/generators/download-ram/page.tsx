"use client";

import { useEffect, useState } from "react";
import { RiRam2Line } from "react-icons/ri";

import Button from "@/components/general/Button";
import Divider from "@/components/general/Divider";
import Spinner from "@/components/general/Spinner";
import StepProgress from "@/components/general/StepProgress";
import Subtext from "@/components/general/Subtext";
import HumanVerificationDialog from "@/components/generators/HumanVerification";

import { useUserFeed } from "../utils";

function RAMSelector({ amount, tier, onClick }: { amount: number, tier: number, onClick: () => void }) {
    return (<div className="bg-bg-lighter p-2 rounded-lg w-full cursor-pointer hover:bg-primary transition-all max-w-[150px]"
        onClick={onClick}
    >
        <div className="grid grid-cols-2 grid-rows-2 gap-1 place-items-stretch">
            {tier >= 1 && <RiRam2Line size={64} />}
            {tier >= 2 && <RiRam2Line size={64} />}
            {tier >= 3 && <RiRam2Line size={64} />}
            {tier >= 4 && <RiRam2Line size={64} />}
        </div>
        <h3 className="font-extrabold">{amount} GB</h3>
        <Subtext>DDR4</Subtext>
        <Subtext>3200 MHz</Subtext>
    </div>);
}

export default function DownloadRamPage() {
    const [step, setStep] = useState(0);
    const [selectedRam, setSelectedRam] = useState<number[]>([0, 0]);

    const [downloadProgress, setDownloadProgress] = useState(0);
    const [installing, setInstalling] = useState(false);

    useUserFeed(u => `${u} has downloaded ${[8, 16, 32, 64][Math.floor(Math.random() * 4)]}gb of RAM for free!`);

    useEffect(() => {
        if (installing) {
            const interval = setInterval(() => {
                if (Math.random() > 0.6) {
                    setInstalling(false);
                    setStep(5);
                    clearInterval(interval);
                }
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [installing]);

    useEffect(() => {
        if (step === 3) {
            let newDownloadProgress = downloadProgress;
            const interval = setInterval(() => {
                newDownloadProgress += Math.random() * 3;
                setDownloadProgress(newDownloadProgress);
                if (newDownloadProgress >= selectedRam[0]) {
                    clearInterval(interval);
                    setDownloadProgress(selectedRam[0]);
                    setStep(4);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [step]);

    return (<>
        <div className="absolute-center bg-bg-light rounded-lg p-4 transition-all min-w-[500px] max-w-[700px]">
            <StepProgress progress={step} maxProgress={5} />

            <div>
                {step === 0 && <>
                    <h1>Download RAM</h1>
                    <p>Download more RAM for your computer for free! Working ram download 2025</p>
                    <Divider />
                    <Button onClick={() => setStep(1)} className="w-full">Begin</Button>
                </>}
                {step === 1 && <>
                    <h2>Select Amount</h2>
                    <p>Choose how much RAM you would like to download</p>
                    <Divider />
                    <div className="flex flex-row gap-2">
                        <RAMSelector onClick={() => {
                            setSelectedRam([8, 1]); setStep(2);
                        }} amount={8} tier={1} />
                        <RAMSelector onClick={() => {
                            setSelectedRam([16, 2]); setStep(2);
                        }} amount={16} tier={2} />
                        <RAMSelector onClick={() => {
                            setSelectedRam([32, 3]); setStep(2);
                        }} amount={32} tier={3} />
                        <RAMSelector onClick={() => {
                            setSelectedRam([64, 4]); setStep(2);
                        }} amount={64} tier={4} />
                    </div>
                </>}
                {step === 2 && <>
                    <h2>Human Verification</h2>
                    <p>Please verify that you are a human before proceeding.</p>
                    <Divider />
                    <HumanVerificationDialog onFinish={() => setStep(3)} />
                </>}

                {step === 3 && <>
                    <h2>Downloading...</h2>
                    <p>This may take a while</p>
                    <Divider />
                    <div className="flex flex-col items-center gap-2">
                        <p>Progress: {downloadProgress.toFixed(1)}gb / {selectedRam[0]}gb</p>
                        <div className="w-full bg-bg-lighter h-[5px] rounded-full relative">
                            <div
                                className="bg-primary h-full rounded-full transition-all"
                                style={{ width: `${(downloadProgress / selectedRam[0]) * 100}%` }}
                            />
                        </div>
                    </div>
                </>}
                {step === 4 && <>
                    <h2>Download Complete</h2>
                    <p>Your download is complete! Click the button below to install the RAM! (this also might take a while)</p>
                    <Divider />
                    <Button
                        onClick={() => setInstalling(true)}
                        disabled={installing}
                        className="w-full"
                    >{installing ? <Spinner /> : "Install RAM"}</Button>
                </>}
                {step === 5 && <>
                    <h2>RAM Installed</h2>
                    <p>Your RAM has been installed!</p>
                    <Divider />
                    <Button onClick={() => location.reload()} className="w-full">Download More RAM</Button>
                </>}
                <p className="text-xs text-gray-500 mt-2 whitespace-pre-wrap">
                    This is fake, you will not get any RAM. No information will be shared.{"\n"}
                    Source code is available on{" "}
                    <a href="https://github.com/mrdiamonddog/website" className="text-blue-400 no-style">GitHub</a>.
                </p>
            </div>
        </div>
    </>);
}
