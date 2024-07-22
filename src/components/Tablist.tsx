"use client";

import { useState } from "react";
import TabButton from "./TabButton";
import React from "react";

interface Props {
    tabs: string[];
    activeTab?: string;
    children: React.ReactNode;
}

export default function Tablist(props: Props) {
    if (!props.activeTab) props.activeTab = props.tabs[0];

    const [activeTab, setActiveTab] = useState(props.activeTab);

    return (<>
        <div className="flex space-x-2 mb-4 overflow-scroll">
            {props.tabs.map((tab) => (
                <TabButton
                    key={tab}
                    active={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                >{tab}</TabButton>
            ))}
        </div>

        {React.Children.map(props.children, child => {
            if (React.isValidElement(child)) {
                if (child.props["data-tab"] === activeTab) {
                    return child;
                }
            }
        })}
    </>);
}