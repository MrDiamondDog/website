"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import Subtext from "@/components/general/Subtext";
import { Table, TableRow } from "@/components/general/Table";
import Tab from "@/components/tabs/Tab";
import Tablist from "@/components/tabs/Tablist";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AnalyticsEvent } from "@/lib/util";

const deviceChartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--primary)",
    },
    mobile: {
        label: "Mobile",
        color: "#178a2a",
    }
} satisfies ChartConfig;

const fromChartConfig = {
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

function processPageViewData(rawData: AnalyticsEvent[]) {
    if (!rawData.length)
        return;

    const newAnalyticsData = [];
    for (const event of rawData) {
        const date = new Date(event.timestamp);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDate = `${month}/${day}/${year}`;

        const existingData = newAnalyticsData.find(data => data.date === formattedDate);
        if (existingData) {
            existingData.desktop += event.isMobile ? 0 : 1;
            existingData.mobile += event.isMobile ? 1 : 0;
            existingData.from[event.from ?? "unknown"] = (existingData.from[event.from ?? "unknown"] ?? 0) + 1;
        } else {
            newAnalyticsData.push({
                date: formattedDate,
                desktop: event.isMobile ? 0 : 1,
                mobile: event.isMobile ? 1 : 0,
                from: {
                    [event.from ?? "unknown"]: 1
                }
            });
        }
    }

    newAnalyticsData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return newAnalyticsData;
}

export default function AnalyticsPage() {
    const [rawAnalyticsData, setRawAnalyticsData] = useState([]);
    const [pageViewData, setPageViewData] = useState([]);
    const [countData, setCountData] = useState({ from: {} as Record<string, number>, country: {} as Record<string, number>, route: {} as Record<string, number> });

    useEffect(() => {
        fetch("/api/analytics")
            .then(response => response.json())
            .then(data => setRawAnalyticsData(data));
    }, []);

    useEffect(() => {
        setPageViewData(processPageViewData(rawAnalyticsData));
    }, [rawAnalyticsData]);

    useEffect(() => {
        if (!rawAnalyticsData.length)
            return;

        let fromCount = {} as Record<string, number>;
        for (const event of rawAnalyticsData) {
            fromCount[event.from ?? "unknown"] = (fromCount[event.from ?? "unknown"] ?? 0) + 1;
        }

        let countryCount = {} as Record<string, number>;
        for (const event of rawAnalyticsData) {
            countryCount[event.country ?? "unknown"] = (countryCount[event.country ?? "unknown"] ?? 0) + 1;
        }

        let routeCount = {} as Record<string, number>;
        for (const event of rawAnalyticsData) {
            routeCount[event.path ?? "unknown"] = (routeCount[event.path ?? "unknown"] ?? 0) + 1;
        }

        // sort by count
        fromCount = Object.fromEntries(Object.entries(fromCount).sort(([, a], [, b]) => b - a));
        countryCount = Object.fromEntries(Object.entries(countryCount).sort(([, a], [, b]) => b - a));
        routeCount = Object.fromEntries(Object.entries(routeCount).sort(([, a], [, b]) => b - a));

        setCountData({ from: fromCount, country: countryCount, route: routeCount });
    }, [rawAnalyticsData]);

    return (
        <main className="md:m-20 m-2 md:p-10 p-3 rounded-lg border border-bg-lighter">
            <h1>Analytics</h1>
            <Subtext className="mb-5">Yes, this is public on purpose. No IPs are tracked, but are used to determine countries.</Subtext>

            <div className="md:p-5 p-1 border border-bg-light rounded-lg min-h-[200px] w-full">
                <Tablist tabs={["Page Views By Device", "Page Views By Redirect Location"]} activeTab="Page Views By Device">
                    <Tab name="Page Views By Device">
                        <ChartContainer config={deviceChartConfig}>
                            {/* <BarChart accessibilityLayer data={pageViewData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={value => value.split("/").slice(0, 2).join("/")}
                                />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                            </BarChart> */}
                            <LineChart accessibilityLayer data={pageViewData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={value => value.split("/").slice(0, 2).join("/")}
                                />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line dataKey="desktop" fill="var(--color-desktop)" stroke="var(--color-desktop)" radius={4} />
                                <Line dataKey="mobile" fill="var(--color-mobile)" stroke="var(--color-mobile)" radius={4} />
                            </LineChart>
                        </ChartContainer>
                    </Tab>
                    <Tab name="Page Views By Redirect Location">
                        <ChartContainer config={fromChartConfig}>
                            {/* <BarChart accessibilityLayer data={pageViewData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={value => value.split("/").slice(0, 2).join("/")}
                                />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="from.github" fill="#333" radius={4} />
                                <Bar dataKey="from.twitter" fill="#1DA1F2" radius={4} />
                                <Bar dataKey="from.discord" fill="#7289DA" radius={4} />
                                <Bar dataKey="from.unknown" fill="#888" radius={4} />
                            </BarChart> */}
                            <LineChart accessibilityLayer data={pageViewData}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    tickFormatter={value => value.split("/").slice(0, 2).join("/")}
                                />
                                <YAxis />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line dataKey="from.github" fill="#333" stroke="#333" radius={4} />
                                <Line dataKey="from.twitter" fill="#1DA1F2" stroke="#1DA1F2" radius={4} />
                                <Line dataKey="from.discord" fill="#7289DA" stroke="#7289DA" radius={4} />
                                <Line dataKey="from.unknown" fill="#888" stroke="#888" radius={4} />
                            </LineChart>
                        </ChartContainer>
                    </Tab>
                </Tablist>
            </div>

            <div className="flex flex-row gap-5 mt-5 lg:flex-nowrap flex-wrap">
                <div className="p-5 border border-bg-light rounded-lg min-h-[200px] w-full">
                    <Table>
                        <TableRow>
                            <th>Redirected From</th>
                            <th>Count</th>
                        </TableRow>
                        {Object.entries(countData.from).map(([from, count]) => (
                            <TableRow key={from}>
                                <td>{from}</td>
                                <td>{count}</td>
                            </TableRow>
                        ))}
                    </Table>
                </div>
                <div className="p-5 border border-bg-light rounded-lg min-h-[200px] w-full">
                    <Table>
                        <TableRow>
                            <th>Country</th>
                            <th>Count</th>
                        </TableRow>
                        {Object.entries(countData.country).map(([country, count]) => (
                            <TableRow key={country}>
                                <td>{country}</td>
                                <td>{count}</td>
                            </TableRow>
                        ))}
                    </Table>
                </div>
                <div className="p-5 border border-bg-light rounded-lg min-h-[200px] w-full">
                    <Table>
                        <TableRow>
                            <th>Route</th>
                            <th>Count</th>
                        </TableRow>
                        {Object.entries(countData.route).map(([route, count]) => (
                            <TableRow key={route}>
                                <td>{route}</td>
                                <td>{count}</td>
                            </TableRow>
                        ))}
                    </Table>
                </div>
            </div>
        </main>
    );
}
