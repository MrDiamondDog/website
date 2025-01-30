"use client";

import "./factorio.css";

import { useEffect, useState } from "react";

type ChecklistItem = {
    name: string;
    checked: boolean;
};

function Checkbox({
    children,
    onChecked,
    checked,
    onRightClick,
}: {
    children: React.ReactNode,
    onChecked: (checked: boolean) => void,
    checked: boolean,
    onRightClick?: (e: React.MouseEvent) => void
}) {
    return (
        <label className="checkbox-label px-2" onContextMenu={onRightClick}>
            <input type="checkbox" checked={checked} onChange={e => onChecked(e.target.checked)} />
            <div className="checkbox" />
            <div className="ml-1">{children}</div>
        </label>
    );
}

function Panel({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`panel ${className ?? ""}`}>
            {children}
        </div>
    );
}

function Button({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) {
    return (
        <button className={`button ${className ?? ""}`} onClick={onClick}>
            {children}
        </button>
    );
}

function GreenButton({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) {
    return (
        <a className={`button-green no-style ${className ?? ""}`} onClick={onClick}>
            {children}
        </a>
    );
}

function RedButton({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) {
    return (
        <a className={`button-red no-style ${className ?? ""}`} onClick={onClick}>
            {children}
        </a>
    );
}

function TooltipContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative tooltip-container">
            {children}
        </div>
    );
}

function Tooltip({ title, text }: { title: string, text: string }) {
    return (
        <div className="tooltip" role="tooltip">
            <div className="panel-tooltip-title">{title}</div>
            <div className="panel-tooltip">{text}</div>
        </div>
    );
}

export default function FactorioChecklistPage() {
    const [checkboxes, setCheckboxes] = useState<ChecklistItem[]>([]);
    const [newItemPanel, setNewItemPanel] = useState(false);

    const [newItemName, setNewItemName] = useState("");

    let gettingItems = false;
    useEffect(() => {
        gettingItems = true;
        const data = localStorage.getItem("factorio-checklist");
        if (data) {
            setCheckboxes(JSON.parse(data));
        }
    }, []);

    useEffect(() => {
        if (gettingItems) {
            gettingItems = false;
            return;
        }
        localStorage.setItem("factorio-checklist", JSON.stringify(checkboxes));
    }, [checkboxes]);

    function newItem() {
        if (newItemName.trim() === "") {
            return;
        }

        setCheckboxes([...checkboxes, {
            name: newItemName,
            checked: false,
        }]);

        setNewItemPanel(false);
        setNewItemName("");
    }

    return (<div className="absolute-center">
        <Panel className="p-5">
            <h1>Your Checklist</h1>
            <div className="panel-inset flex flex-col p-2 min-w-[300px]">
                {checkboxes.map((item, index) => (
                    <Checkbox key={index} checked={item.checked} onChecked={checked => {
                        const newCheckboxes = [...checkboxes];
                        newCheckboxes[index].checked = checked;
                        setCheckboxes(newCheckboxes);
                    }} onRightClick={e => {
                        e.preventDefault();
                        const newCheckboxes = [...checkboxes];
                        newCheckboxes.splice(index, 1);
                        setCheckboxes(newCheckboxes);
                    }}>
                        {item.name}
                    </Checkbox>
                ))}
            </div>
            <GreenButton onClick={() => setNewItemPanel(true)} className="w-full mt-2">New Item</GreenButton>
        </Panel>
        {newItemPanel && <Panel className="p-5 mt-5">
            <div className="flex flex-row justify-between w-full">
                <h1>New Item</h1>
                <RedButton onClick={() => {
                    setNewItemPanel(false); setNewItemName("");
                }} className="py-0">X</RedButton>
            </div>
            <div className="panel-inset flex flex-col p-2">
                <input
                    type="text"
                    placeholder="Title"
                    className="input"
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                />
            </div>
            <GreenButton onClick={newItem} className="w-full mt-2">Create</GreenButton>
        </Panel>}
    </div>);
}
