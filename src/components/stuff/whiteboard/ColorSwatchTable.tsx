import ColorSwatch from "./ColorSwatch";

export default function ColorSwatchTable(props: { colors: string[][], onClick?: (color: string) => void, selected?: string }) {
    return (<div className="flex flex-col gap-2">
        {props.colors.map((colorRow, i) => (
            <div className="flex flex-row gap-2" key={i}>
                {colorRow.map((color, i) => <ColorSwatch key={i} color={color} onClick={() => props.onClick?.(color)} selected={props.selected === color} />)}
            </div>
        ))}
    </div>);
}
