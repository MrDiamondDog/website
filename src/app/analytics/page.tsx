"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import Select from "@/components/general/Select";
import Subtext from "@/components/general/Subtext";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AnalyticsEntry, randomColor } from "@/lib/util";

const chartConfig = {
    "device.desktop": {
        label: "Desktop",
        color: "var(--primary)",
    },
    "device.mobile": {
        label: "Mobile",
        color: "#178a2a",
    },

    "from.github": {
        label: "GitHub",
        color: "#333",
    },
    "from.twitter": {
        label: "Twitter",
        color: "#1DA1F2",
    },
    "from.discord": {
        label: "Discord",
        color: "#7289DA",
    },
    "from.unknown": {
        label: "Unknown",
        color: "#888",
    }
} satisfies ChartConfig;

export default function AnalyticsPage() {
    const [pageViewData, setPageViewData] = useState<AnalyticsEntry[]>([]);
    const [viewBy, setViewBy] = useState<string>("device");

    useEffect(() => {
        fetch("/api/analytics")
            .then(response => response.json())
            .then(data => {

                setPageViewData(data);
                console.log(data);
            });
    }, []);

    return (
        <main className="md:m-20 m-2 md:p-10 p-3 rounded-lg border border-bg-lighter">
            <h1>Analytics</h1>
            <Subtext className="mb-5">Yes, this is public on purpose. No IPs are tracked, but are used to determine countries.</Subtext>

            <div className="md:p-5 p-1 border border-bg-light rounded-lg min-h-[200px] w-full">
                <h2>Page Views</h2>
                <div className="flex flex-row gap-2 items-center mt-3">
                    <p>By</p>
                    <Select onChange={e => setViewBy(e.target.value)} value={viewBy}>
                        <option value="device">Device</option>
                        <option value="from">Redirect Location</option>
                        <option value="country">Country</option>
                        <option value="route">Route</option>
                    </Select>
                </div>

                <ChartContainer config={chartConfig} className="max-h-[500px] w-full">
                    <LineChart accessibilityLayer data={pageViewData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        {viewBy === "device" && (<>
                            <Line dataKey="device.desktop" fill="var(--primary)" stroke="var(--primary)" radius={4} />
                            <Line dataKey="device.mobile" fill="#178a2a" stroke="#178a2a" radius={4} />
                        </>)}
                        {viewBy === "from" && (<>
                            <Line dataKey="from.github" fill="#333" stroke="#333" radius={4} />
                            <Line dataKey="from.twitter" fill="#1DA1F2" stroke="#1DA1F2" radius={4} />
                            <Line dataKey="from.discord" fill="#7289DA" stroke="#7289DA" radius={4} />
                            <Line dataKey="from.unknown" fill="#888" stroke="#888" radius={4} />
                        </>)}
                        {viewBy === "country" && Object.keys(pageViewData[0].country).map((country, i) => (
                            <Line key={country} dataKey={`country.${country}`} radius={4} fill={randomColor(country)} stroke={randomColor(country)} />
                        ))}
                        {viewBy === "route" && Object.keys(pageViewData[0].route).map((route, i) => (
                            <Line key={route} dataKey={`route.${route}`} radius={4} fill={randomColor(route)} stroke={randomColor(route)} />
                        ))}
                    </LineChart>
                </ChartContainer>
            </div>
        </main>
    );
}
