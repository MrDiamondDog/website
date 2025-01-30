import React, { useEffect, useState } from "react";

import { randomRange } from "@/lib/util";

export default function DVDLogo(props: React.PropsWithChildren) {
    const [position, setPosition] = useState({ top: 100, left: 100 });
    const [direction, setDirection] = useState({ x: randomRange(-5, 5), y: randomRange(-5, 5) });

    useEffect(() => {
        function moveLogo() {
            setPosition(prev => {
                const newTop = prev.top + direction.y;
                const newLeft = prev.left + direction.x;

                const newDirection = { ...direction };

                // Check for collision with the edges
                if (newTop <= 0 || newTop >= window.innerHeight - 300) {
                    newDirection.y *= -1;
                }
                if (newLeft <= 0 || newLeft >= window.innerWidth - 300) {
                    newDirection.x *= -1;
                }

                setDirection(newDirection);
                return { top: newTop, left: newLeft };
            });
        };

        const intervalId = setInterval(moveLogo, 10);

        return () => clearInterval(intervalId);
    }, [direction]);

    const style = {
        // god help me
        position: "absolute" as "absolute",
        top: position.top,
        left: position.left,
        transition: "top 0.01s linear, left 0.01s linear",
        maxHeight: "300px",
        maxWidth: "300px",
    };

    return <div style={style}>{props.children}</div>;
}
