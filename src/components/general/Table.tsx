import React from "react";

export function Table(props: React.TableHTMLAttributes<HTMLTableElement>) {
    return (
        <table {...props} className={`w-full border border-bg-lighter table-alternate-colors ${props.className ?? ""}`}>
            <tbody>
                {props.children}
            </tbody>
        </table>
    );
}

export function TableRow(props: React.HTMLAttributes<HTMLTableRowElement>) {
    return (<>
        <tr {...props} className={(props.className ?? "")}>{props.children}</tr>
    </>);
}
