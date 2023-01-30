import { useEffect, useRef } from "react";
import { ColorThemeMode } from "../../../types/colorTheme";
import { HomeState } from "..";
import { renderImages } from "../../../actions/imageActions";
import { useAppSelector } from "../../../hooks/reduxHooks";

interface Props {
    currentIndex: React.MutableRefObject<number>;
    height: number;
    state: HomeState;
    setState: (s: HomeState) => void;
    width: number;
}
export default function Canvas({
    currentIndex,
    height,
    state,
    setState,
    width,
}: Props) {
    const { theme } = useAppSelector((state) => state.colorTheme);
    const isDark = theme === ColorThemeMode.DARK;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isSlideAllowed = useRef(false);
    const movementX = useRef(0);
    const sliderX = useRef(0);

    function slideCanSlide() {
        return (
            (movementX.current > 0 && currentIndex.current === 0) ||
            (movementX.current < 0 &&
                currentIndex.current === state.images.length - 1)
        );
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        function handleSlide() {
            /*
            Image will slide if it's not the first or the last
            Sliding on mobile is not implemented
            */
            if (!canvas || !isSlideAllowed.current) {
                if (!isSlideAllowed.current) {
                    console.log("%cSlide is disallowed", "color:yellow");
                }
                setState({ ...state, isDragging: false });
                movementX.current = 0;
                return;
            }
            const absMovementAmount = Math.abs(movementX.current);
            const diff = canvas.width - absMovementAmount;
            if (isSlideAllowed.current) {
                if (movementX.current < 0) {
                    sliderX.current -= diff;
                    currentIndex.current += 1;
                } else if (movementX.current > 0) {
                    sliderX.current += diff;
                    currentIndex.current -= 1;
                }
                console.log(
                    `%cMoved to slide ${currentIndex.current}`,
                    "color:lime"
                );
            } else {
                console.log("%cGonna undo slide", "color:yellow");
                sliderX.current = currentIndex.current * canvas.width * -1;
                console.log(
                    `%cReverted SliderX: ${sliderX.current}`,
                    "color:yellow"
                );
            }
            setState({
                ...state,
                isDragging: false,
            });
            movementX.current = 0;
        }
        if (canvas) {
            canvas.onmouseenter = (e) => {
                // console.log("mouseenter", e.clientX, e.clientY);
                setState({
                    ...state,
                    isMouseInCanvas: true,
                });
            };
            canvas.onmouseleave = (e) => {
                // console.log("mouseleave", e.clientX, e.clientY);
                /*
                Possibly better UX to allow dragging to continue after leaving the canvas.
                */
                setState({
                    ...state,
                    isMouseInCanvas: false,
                });
                if (movementX.current) {
                    handleSlide();
                }
            };
            canvas.onmousedown = (e) => {
                if (e.target === canvas) {
                    // console.log("mousedown", e.clientX, e.clientY);
                    setState({ ...state, isDragging: true });
                } else {
                    console.log("Not in canvas");
                }
            };
            canvas.ontouchstart = (e) => {
                // console.log("ontouchstart e", e);
                if (e.target === canvas) {
                    e.preventDefault();
                }
            };
            canvas.onmousemove = (e) => {
                if (state.isDragging) {
                    movementX.current += e.movementX;
                    if (slideCanSlide()) {
                        isSlideAllowed.current = false;
                        return;
                    } else {
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
                const touch = e.targetTouches[0];
                const deltaX = previousTouchX
                    ? touch.clientX - previousTouchX
                    : 0;
                movementX.current += deltaX;
                if (slideCanSlide()) {
                    isSlideAllowed.current = false;
                    return;
                } else {
                    isSlideAllowed.current = true;
                }
                sliderX.current += deltaX;
                previousTouchX = touch.clientX;
                setState({ ...state, movement: sliderX.current });
            };
            canvas.onmouseup = (e) => {
                handleSlide();
            };
            canvas.ontouchend = (e) => {
                previousTouchX = 0;
                if (movementX.current === 0) return;
                handleSlide();
            };
            canvas.ontouchcancel = (e) => {
                previousTouchX = 0;
                if (movementX.current === 0) return;
                handleSlide();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.isDragging, state.isMouseInCanvas]);

    useEffect(() => {
        // I don't get how this is supposed to work, yet.
        // function animate() {
        //     const ctx = canvasRef.current?.getContext("2d", { alpha: false });
        //     if (!ctx) {
        //         return;
        //     }
        //     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        //     ctx.fillStyle = isDark ? "rgb(43, 48, 53)" : "rgb(248, 249, 250)";
        //     ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        //     loadImages(ctx, state.images, sliderX.current);
        //     requestAnimationFrame(animate);
        // }
        const ctx = canvasRef.current?.getContext("2d", { alpha: false });
        if (ctx) {
            const timeout = ctx.canvas.width < 640 ? 1000 / 10 : 0;
            setTimeout(() => {
                // this increases flicker
                // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.fillStyle = isDark
                    ? "rgb(43, 48, 53)"
                    : "rgb(248, 249, 250)";
                ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                renderImages(ctx, state.images, sliderX.current);
            }, timeout);

            // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            // ctx.fillStyle = isDark ? "rgb(43, 48, 53)" : "rgb(248, 249, 250)";
            // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            // loadImages(ctx, state.images, sliderX.current);
            // requestAnimationFrame(animate);
        } else {
            console.log("%cNo context in Canvas component!", "color: hotpink");
        }
        // return () => {
        //     if (timeout) {
        //         console.log("clearing timeout");
        //         clearTimeout(timeout);
        //     }
        // };
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
