"use client";

import { useEffect, useState } from "react";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { RiRam2Line } from "react-icons/ri";
import { toast } from "sonner";

import Button from "@/components/general/Button";
import Dialog from "@/components/general/Dialog";
import Divider from "@/components/general/Divider";
import Input from "@/components/general/Input";
import Spinner from "@/components/general/Spinner";
import StepProgress from "@/components/general/StepProgress";
import Subtext from "@/components/general/Subtext";

function RAMSelector({ amount, tier, onClick }: { amount: number, tier: number, onClick: () => void }) {
    return (<div className="bg-bg-lighter p-2 rounded-lg w-full cursor-pointer hover:bg-primary transition-all max-w-[150px]" onClick={onClick}>
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

type Question = {
    question: string;
    min?: number;
    max?: number;
    type?: "text" | "number";
    regex?: RegExp;
}

// username
// email
// phone number
// all address info
// credit card info
// common security questions
const questions: Question[][] = [
    [
        {
            question: "Username"
        }
    ],
    [
        {
            question: "Email",
            regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gi
        }
    ],
    [
        {
            question: "Phone Number",
            regex: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gi
        }
    ],
    [
        {
            question: "Address Line 1"
        },
        {
            question: "Address Line 2"
        },
        {
            question: "City"
        },
        {
            question: "Country"
        },
        {
            question: "Zip Code",
            regex: /^\d{5}(-\d{4})?$/gi
        }
    ],
    [
        {
            question: "Credit Card Number",
            regex: /^\d{16}$/gi
        },
        {
            question: "Expiration Date",
            regex: /^(0[1-9]|1[0-2])\/\d{2}$/gi
        },
        {
            question: "CVV",
            regex: /^\d{3}$/gi
        }
    ],
    [
        {
            question: "What is your mother's maiden name?"
        },
        {
            question: "What is the name of your first pet?"
        },
        {
            question: "What is the name of your first school?"
        }
    ],
];

export default function DownloadRamPage() {
    const [step, setStep] = useState(0);
    const [selectedRam, setSelectedRam] = useState<number[]>([0, 0]);

    const [humanVerificationDialog, setHumanVerificationDialog] = useState(false);
    const [question, setQuestion] = useState(0);
    const [questionValues, setQuestionValues] = useState<string[]>([]);

    const [downloadProgress, setDownloadProgress] = useState(0);
    const [installing, setInstalling] = useState(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (Math.random() < 0.75) return;

            await fetch("https://usernameapiv1.vercel.app/api/random-usernames")
                .then(res => res.json())
                .then(data => {
                    toast.success(`${data.usernames[0]} has downloaded ${[8, 16, 32, 64][Math.floor(Math.random() * 4)]}gb of RAM for free!`);
                });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

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

    return (<>
        <Dialog open={humanVerificationDialog} onClose={() => setHumanVerificationDialog(false)} title="Verification">
            <StepProgress progress={question} maxProgress={questions.length} />
            <div className="flex flex-col gap-1">
                {questions[question].map((q, i) => <>
                    <h3>{q.question}</h3>
                    <Input key={q.question} value={questionValues[i]} type={q.type ?? "text"} onChange={e => setQuestionValues([...questionValues.slice(0, i), e.target.value, ...questionValues.slice(i + 1)])} />
                </>)}
            </div>
            <Divider />
            <Button onClick={() => {
                if (questions[question].every((q, i) => {
                    if (q.regex) {
                        return q.regex.test(questionValues[i]);
                    }
                    return questionValues[i].length > 0;
                })) {
                    setQuestionValues([]);
                    if (question === questions.length - 1) {
                        setHumanVerificationDialog(false);
                        setStep(3);
                    } else {
                        setQuestion(question + 1);
                    }
                } else {
                    toast.error("Please fill out all fields correctly");
                }
            }} className="w-full">Next</Button>
        </Dialog>

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
                        <RAMSelector onClick={() => { setSelectedRam([8, 1]); setStep(2); }} amount={8} tier={1} />
                        <RAMSelector onClick={() => { setSelectedRam([16, 2]); setStep(2); }} amount={16} tier={2} />
                        <RAMSelector onClick={() => { setSelectedRam([32, 3]); setStep(2); }} amount={32} tier={3} />
                        <RAMSelector onClick={() => { setSelectedRam([64, 4]); setStep(2); }} amount={64} tier={4} />
                    </div>
                </>}
                {step === 2 && <>
                    <h2>Human Verification</h2>
                    <p>Please verify that you are a human before proceeding.</p>
                    <Divider />
                    <Button onClick={() => setHumanVerificationDialog(true)} className="w-full flex flex-row gap-1">Verify<FaArrowUpRightFromSquare /></Button>
                </>}

                {step === 3 && <>
                    <h2>Downloading...</h2>
                    <p>This may take a while</p>
                    <Divider />
                    <div className="flex flex-col items-center gap-2">
                        <p>Progress: {downloadProgress.toFixed(1)}gb / {selectedRam[0]}gb</p>
                        <div className="w-full bg-bg-lighter h-[5px] rounded-full relative">
                            <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${(downloadProgress / selectedRam[0]) * 100}%` }} />
                        </div>
                    </div>
                </>}
                {step === 4 && <>
                    <h2>Download Complete</h2>
                    <p>Your download is complete! Click the button below to install the RAM! (this also might take a while)</p>
                    <Divider />
                    <Button onClick={() => setInstalling(true)} disabled={installing} className="w-full">{installing ? <Spinner /> : "Install RAM"}</Button>
                </>}
                {step === 5 && <>
                    <h2>RAM Installed</h2>
                    <p>Your RAM has been installed!</p>
                    <Divider />
                    <Button onClick={() => { setStep(0); setDownloadProgress(0); }} className="w-full">Download More RAM</Button>
                </>}
                <p className="text-xs text-gray-500 mt-2 whitespace-pre-wrap">
                    This is fake, you will not get any RAM. Please do not enter any real personal information.{"\n"}
                    Source code is available on <a href="https://github.com/mrdiamonddog/website" className="text-blue-400 no-style">GitHub</a>.
                </p>
            </div>
        </div>
    </>);
}
