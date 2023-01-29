import { ColorThemeMode } from "../../../types/colorTheme";
import { HomeState } from "..";
import { loadImages } from "../../../actions/imageActions";
import { useAppSelector } from "../../../hooks/reduxHooks";
import { useEffect, useRef } from "react";

interface Props {
    height: number;
    state: HomeState;
    setState: (s: HomeState) => void;
    width: number;
}
export default function Canvas({ height, state, setState, width }: Props) {
    const { theme } = useAppSelector((state) => state.colorTheme);
    const isDark = theme === ColorThemeMode.DARK;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isSlideAllowed = useRef(false);
    const currentIndex = useRef(0);
    const movementX = useRef(0);
    const sliderX = useRef(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        function handleSlide() {
            /*
            Image will slide if it's not the first or the last
            Sliding on mobile is not implemented
            */
            if (!canvas || !isSlideAllowed.current) {
                if (!isSlideAllowed.current) {
                    console.log("Slide is disallowed");
                }
                setState({ ...state, isDragging: false });
                movementX.current = 0;
                return;
            }
            const movementAmount = Math.abs(movementX.current);
            const diff = canvas.width - movementAmount;
            console.log("movementX.current", movementX.current);
            console.log("movementAmount", movementAmount);
            console.log("1/12 canvas width", canvas.width / 12);
            // if (movementAmount > canvas.width / 12 && (isMobile || isSlideAllowed.current )) {
            if (isSlideAllowed.current) {
                console.log("%cGonna finish slide", "color:lime");
                if (movementX.current < 0) {
                    sliderX.current -= diff;
                    currentIndex.current += 1;
                } else if (movementX.current > 0) {
                    sliderX.current += diff;
                    currentIndex.current -= 1;
                }
                console.log(
                    `%cSetting current index to: ${currentIndex.current}`,
                    "color:lime"
                );
                setState({
                    ...state,
                    isDragging: false,
                });
            } else {
                console.log("%cGonna undo slide", "color:yellow");
                sliderX.current = currentIndex.current * canvas.width * -1;
                console.log(
                    `%cReverted SliderX: ${sliderX.current}`,
                    "color:yellow"
                );
                setState({
                    ...state,
                    isDragging: false,
                });
            }
            movementX.current = 0;
        }
        if (canvas) {
            canvas.onmouseenter = (e) => {
                console.log("mouseenter", e.clientX, e.clientY);
                setState({
                    ...state,
                    isMouseInCanvas: true,
                });
            };
            canvas.onmouseleave = (e) => {
                console.log("mouseleave", e.clientX, e.clientY);
                /*
                Probably better UX to allow dragging to continue after leaving the canvas.
                */
                setState({
                    ...state,
                    isMouseInCanvas: true,
                });
                handleSlide();
            };
            canvas.onmousedown = (e) => {
                if (e.target === canvas) {
                    console.log("mousedown", e.clientX, e.clientY);
                    setState({ ...state, isDragging: true });
                } else {
                    console.log("Not in canvas");
                }
            };
            canvas.ontouchstart = (e) => {
                console.log("ontouchstart e", e);
                if (e.target === canvas) {
                    e.preventDefault();
                }
                console.log(
                    "%cCurrent index:",
                    "color:hotpink",
                    currentIndex.current
                );
                // const touch = e.touches[0];
                // const mouseEvent = new MouseEvent("mousedown", {
                //     clientX: touch.clientX,
                //     clientY: touch.clientY,
                // });
                // canvas.dispatchEvent(mouseEvent);
            };
            canvas.onmousemove = (e) => {
                if (state.isDragging) {
                    console.log(e);
                    movementX.current += e.movementX;
                    console.log("e.movementX", e.movementX);
                    if (
                        (movementX.current > 0 && currentIndex.current === 0) ||
                        (movementX.current < 0 &&
                            currentIndex.current === state.images.length - 1)
                    ) {
                        console.log("%cDisallowing slide", "color:yellow");
                        isSlideAllowed.current = false;
                        return;
                    } else {
                        // console.log("%cAllowing slide", "color: lime");
                        isSlideAllowed.current = true;
                    }
                    sliderX.current += e.movementX;
                    setState({ ...state, movement: sliderX.current });
                }
            };
            var previousTouchX = 0;
            canvas.ontouchmove = (e) => {
                if (e.target === canvas) {
                    e.preventDefault();
                }
                // if (state.isDragging) {
                // console.log("touchdrag e", e);
                const touch = e.targetTouches[0];
                // console.log("touch.clientX", touch.clientX);
                // console.log("previousTouchX", previousTouchX);
                const deltaX = previousTouchX
                    ? touch.clientX - previousTouchX
                    : 0;
                // console.log("deltaX", deltaX);
                movementX.current += deltaX;
                console.log("movementX.current", movementX.current);
                console.log("state.currentIndex", currentIndex.current);
                console.log("state.images.length -1", state.images.length - 1);
                if (
                    (movementX.current > 0 && currentIndex.current === 0) ||
                    (movementX.current < 0 &&
                        currentIndex.current === state.images.length - 1)
                ) {
                    console.log("%cDisallowing slide", "color:orange");
                    isSlideAllowed.current = false;
                    return;
                } else {
                    // console.log("%cAllowing slide", "color: lime");
                    isSlideAllowed.current = true;
                }
                sliderX.current += deltaX;
                // console.log("movementX", movementX);
                // const movementY = touch.clientY - previousTouch.clientY;
                // sliderX.current += movementX
                previousTouchX = touch.clientX;
                setState({ ...state, movement: sliderX.current });
                // const mouseEvent = new MouseEvent("mousemove", {
                //     movementX,
                //     movementY,
                // } as MouseEventInit);
                // // movementX and movementY are not in the event!
                // console.log("MOUSE EVENT", mouseEvent);
                // canvas.dispatchEvent(mouseEvent);
                // previousTouch = {
                //     clientX: touch.clientX,
                //     clientY: touch.clientY,
                // };
                // }
            };
            canvas.onmouseup = (e) => {
                console.log("mouseup", e.clientX, e.clientY);
                handleSlide();
            };
            canvas.ontouchend = (e) => {
                // if (e.target === canvas) {
                //     e.preventDefault();
                // }
                // let untouch = e.changedTouches[0];
                // const mouseEvent = new MouseEvent("mouseup", {
                //     clientX: untouch.clientX,
                //     clientY: untouch.clientY,
                // });
                previousTouchX = 0;
                if (movementX.current === 0) return;
                handleSlide();
                // canvas.dispatchEvent(mouseEvent);
            };
            canvas.ontouchcancel = (e) => {
                // if (e.target === canvas) {
                //     e.preventDefault();
                // }
                let untouch = e.changedTouches[0];
                const mouseEvent = new MouseEvent("mouseup", {
                    clientX: untouch.clientX,
                    clientY: untouch.clientY,
                });
                previousTouchX = 0;
                canvas.dispatchEvent(mouseEvent);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.isDragging, state.isMouseInCanvas]);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");
        if (ctx) {
            ctx.fillStyle = isDark ? "rgb(43, 48, 53)" : "rgb(248, 249, 250)";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            loadImages(ctx, state.images, sliderX.current);
        } else {
            console.log("No context in Canvas component");
        }
    }, [isDark, state.images, state.movement, width]);

    return (
        <canvas
            ref={canvasRef}
            height={height}
            width={width}
            style={{ cursor: "grab" }}
        />
    );
}
