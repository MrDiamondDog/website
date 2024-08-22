"use client";

import { useEffect, useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import Divider from "@/components/general/Divider";
import Select from "@/components/general/Select";
import Subtext from "@/components/general/Subtext";
import { Table, TableRow } from "@/components/general/Table";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AnalyticsEntry, color } from "@/lib/util";

const chartConfig = {
    "device.desktop": {
        label: "Desktop",
        color: "var(--primary)",
    },
    "device.mobile": {
        label: "Mobile",
        color: "#178a2a",
    },
} satisfies ChartConfig;

export default function AnalyticsPage() {
    const [pageViewData, setPageViewData] = useState<AnalyticsEntry[]>([]);
    const [viewBy, setViewBy] = useState<string>("device");

    useEffect(() => {
        fetch("/api/analytics")
            .then(response => response.json())
            .then(data => {
                setPageViewData(data);
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
                        <option value="from">Referrer</option>
                        <option value="country">Country</option>
                        <option value="route">Route</option>
                    </Select>
                </div>

                {!!pageViewData.length && <>
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
                            {viewBy === "from" && Object.keys(pageViewData[0].from).map((referer, i) => (
                                <Line key={referer} dataKey={`from["${referer}"]`} name={referer} radius={4} fill={color(i)} stroke={color(i)} />
                            ))}
                            {viewBy === "country" && Object.keys(pageViewData[0].country).map((country, i) => (
                                <Line key={country} dataKey={`country.${country}`} name={country} radius={4} fill={color(i)} stroke={color(i)} />
                            ))}
                            {viewBy === "route" && Object.keys(pageViewData[0].route).map((route, i) => (
                                <Line key={route} dataKey={`route.${route}`} name={route} radius={4} fill={color(i)} stroke={color(i)} />
                            ))}
                        </LineChart>
                    </ChartContainer>

                    <Divider className="!bg-bg-light" />

                    <Table>
                        {viewBy === "device" && (<>
                            <TableRow>
                                <td>Desktop</td>
                                <td>{pageViewData.map(data => data.device.desktop).reduce((prev, curr) => curr + prev)}</td>
                            </TableRow>
                            <TableRow>
                                <td>Mobile</td>
                                <td>{pageViewData.map(data => data.device.mobile).reduce((prev, curr) => curr + prev)}</td>
                            </TableRow>
                        </>)}
                        {viewBy === "from" && Object.keys(pageViewData[0].from).map(referer => (
                            <TableRow>
                                <td>{referer}</td>
                                <td>{pageViewData.map(data => data.from[referer]).reduce((prev, curr) => curr + prev)}</td>
                            </TableRow>
                        ))}
                        {viewBy === "country" && Object.keys(pageViewData[0].country).map(country => (
                            <TableRow>
                                <td>{country}</td>
                                <td>{pageViewData.map(data => data.country[country]).reduce((prev, curr) => curr + prev)}</td>
                            </TableRow>
                        ))}
                        {viewBy === "route" && Object.keys(pageViewData[0].route).map(route => (
                            <TableRow>
                                <td>{route}</td>
                                <td>{pageViewData.map(data => data.route[route]).reduce((prev, curr) => curr + prev)}</td>
                            </TableRow>
                        ))}
                    </Table>
                </>}
            </div>
        </main>
    );
}
