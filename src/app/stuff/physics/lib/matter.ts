import Matter,
{ Bodies, Bounds, Composite, Constraint, Engine, Events, Mouse, MouseConstraint, Render, Runner, Vector } from "matter-js";

import { canvas } from ".";

export let engine: Engine;
export let render: Render;
export let runner: Runner;
export let mouseConstraint: MouseConstraint;
export let screenMousePos: Vector;

export let ground: Matter.Body;

export function initMatter() {
    engine = Engine.create();
    render = Render.create({
        canvas,
        engine,
        options: {
            width: canvas.clientWidth,
            height: canvas.clientHeight,
            wireframes: false,
            background: "transparent",
            hasBounds: true,
        },
    });

    Render.run(render);

    runner = Runner.create();
    Runner.run(runner, engine);

    // create two boxes and a ground
    ground = Bodies.rectangle(0, canvas.height / 2, 5000, 100, { isStatic: true });

    // add all of the bodies to the world
    addBody(ground);

    Events.on(engine, "afterUpdate", () => {
        Composite.allBodies(engine.world).forEach(body => {
            if (body.position.y > 2000) {
                Matter.Composite.remove(engine.world, body);
            }
        });
    });

    initMouse();
    initCamera();
}

export function initMouse() {
    let mouse = Mouse.create(render.canvas);
    mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: {
            damping: 0.2,
            render: {
                visible: false,
            },
        },
    });

    render.mouse = mouse;

    window.addEventListener("mousemove", e => {
        screenMousePos = Vector.create(e.clientX, e.clientY);
    });

    addBody(mouseConstraint);
}

export function screenToWorld(pos: Vector) {
    const { min, max } = render.bounds;

    const x = min.x + (pos.x / render.options.width) * (max.x - min.x);
    const y = min.y + (pos.y / render.options.height) * (max.y - min.y);

    return Vector.create(x, y);
}

export function initCamera() {
    let boundsScaleTarget = 1;
    let boundsScale = {
        x: 1,
        y: 1,
    };

    Events.on(render, "beforeRender", () => {
        let { world } = engine;
        let { mouse } = render;
        let translate;

        // mouse wheel controls zoom
        let scaleFactor = mouse.wheelDelta * -0.1;
        if (scaleFactor !== 0) {
            if ((scaleFactor < 0 && boundsScale.x >= 0.5) || (scaleFactor > 0 && boundsScale.x <= 10)) {
                boundsScaleTarget += scaleFactor;
            }
        }

        // if scale has changed
        if (Math.abs(boundsScale.x - boundsScaleTarget) > 0.01) {
            // smoothly tween scale factor
            scaleFactor = (boundsScaleTarget - boundsScale.x) * 0.2;
            boundsScale.x += scaleFactor;
            boundsScale.y += scaleFactor;

            // scale the render bounds
            render.bounds.max.x = render.bounds.min.x + render.options.width * boundsScale.x;
            render.bounds.max.y = render.bounds.min.y + render.options.height * boundsScale.y;

            // translate so zoom is from centre of view
            translate = {
                x: render.options.width * scaleFactor * -0.5,
                y: render.options.height * scaleFactor * -0.5,
            };

            Bounds.translate(render.bounds, translate);

            // update mouse
            Mouse.setScale(mouse, boundsScale);
            Mouse.setOffset(mouse, render.bounds.min);
        }

        // move view when mouse dragging while right clicking
        if (mouse.button === 2) {
            translate = {
                x: (mouse.mousedownPosition.x - mouse.position.x) * 1,
                y: (mouse.mousedownPosition.y - mouse.position.y) * 1,
            };

            Bounds.translate(render.bounds, translate);

            Mouse.setOffset(mouse, render.bounds.min);
        }
    });
}

export function addBody(body:
    Matter.Body | Composite | Constraint | MouseConstraint | Array<Matter.Body | Composite | Constraint | MouseConstraint>) {
    Composite.add(engine.world, body);
}
