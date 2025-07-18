import { useState } from "react";
import ReactDOM from "react-dom";
import { toast } from "sonner";

import Button from "../general/Button";
import Dialog from "../general/Dialog";
import Input from "../general/Input";
import StepProgress from "../general/StepProgress";
import { ArrowRight, ExternalLink } from "lucide-react";

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
            question: "Username",
        },
    ],
    [
        {
            question: "Email",
            regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gi,
        },
    ],
    [
        {
            question: "Phone Number",
            regex: /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gi,
        },
    ],
    [
        {
            question: "Address Line 1",
        },
        {
            question: "Address Line 2",
        },
        {
            question: "City",
        },
        {
            question: "Country",
        },
        {
            question: "Zip Code",
            regex: /^\d{5}(-\d{4})?$/gi,
        },
    ],
    [
        {
            question: "Credit Card Number",
            regex: /^\d{16}$/gi,
        },
        {
            question: "Expiration Date",
            regex: /^(0[1-9]|1[0-2])\/\d{2}$/gi,
        },
        {
            question: "CVV",
            regex: /^\d{3}$/gi,
        },
    ],
    [
        {
            question: "What is your mother's maiden name?",
        },
        {
            question: "What is the name of your first pet?",
        },
        {
            question: "What is the name of your first school?",
        },
    ],
];

export default function HumanVerificationDialog({ onFinish }: { onFinish?: () => void }) {
    const [open, setOpen] = useState(false);
    const [question, setQuestion] = useState(0);
    const [questionValues, setQuestionValues] = useState<string[]>([]);

    const dialog = (
        <Dialog open={open} onClose={() => setOpen(false)} title="Verification">
            <StepProgress progress={question} maxProgress={questions.length} />
            <div className="flex flex-col gap-1">
                {questions[question].map((q, i) => <div key={q.question}>
                    <h3>{q.question}</h3>
                    <Input
                        key={q.question}
                        value={questionValues[i]}
                        type={q.type ?? "text"}
                        onChange={e => setQuestionValues([
                            ...questionValues.slice(0, i),
                            e.target.value,
                            ...questionValues.slice(i + 1),
                        ])}
                    />
                </div>)}
            </div>
            <a
                href="#"
                className="w-full mt-2 text-right text-lg no-style flex flex-row gap-1 items-center justify-end text-primary"
                onClick={() => {
                    if (questions[question].every((q, i) => {
                        if (q.regex) {
                            return q.regex.test(questionValues[i]);
                        }
                        return questionValues[i].length > 0;
                    })) {
                        setQuestionValues([...questionValues.map(() => "")]);

                        if (question === questions.length - 1) {
                            setOpen(false);
                            if (onFinish)
                                onFinish();
                        } else {
                            setQuestion(question + 1);
                        }
                    } else {
                        toast.error("Please fill out all fields correctly");
                    }
                }}>Next <ArrowRight /></a>
        </Dialog>
    );

    return (<>
        <Button onClick={() => setOpen(true)} className="w-full flex flex-row gap-1">Verify <ExternalLink /></Button>

        {open && ReactDOM.createPortal(dialog, document.body)}
    </>);
}
