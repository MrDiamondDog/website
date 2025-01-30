"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import TabButton from "./TabButton";

interface Props {
    tabs: string[];
    activeTab?: string;
    children: React.ReactNode;
    className?: string;
}

export default function Tablist(props: Props) {
    const params = useParams();

    if (!props.activeTab)
        props.activeTab = props.tabs[0];

    const [activeTab, setActiveTab] = useState(props.activeTab);

    useEffect(() => {
        if (!window.location.hash)
            return;
        const hash = window.location.hash.slice(1);
        if (props.tabs.find(tab => tab.toLowerCase() === hash.toLowerCase())) {
            setActiveTab(props.tabs.find(tab => tab.toLowerCase() === hash.toLowerCase()));
        }
    }, [params]);

    return (<>
        <div className={`flex space-x-2 mb-4 overflow-scroll ${props.className}`}>
            {props.tabs.map(tab => (
                <TabButton
                    key={tab}
                    active={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                >{tab}</TabButton>
            ))}
        </div>

        {React.Children.map(props.children, child => {
            if (React.isValidElement(child)) {
                if (child.props["data-tab"] === activeTab || child.props.name === activeTab) {
                    return child;
                }
            }
        })}
    </>);
}
