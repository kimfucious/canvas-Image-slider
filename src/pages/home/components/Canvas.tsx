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
                setState({
                    ...state,
                    isMouseInCanvas: true,
                });
            };
            canvas.onmouseleave = (e) => {
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
                    setState({ ...state, isDragging: true });
                } else {
                    console.log("Not in canvas");
                }
            };
            canvas.onmousemove = (e) => {
                console.log("isDragging", state.isDragging);
                if (state.isDragging) {
                    movementX.current += e.movementX;
                    if (slideCanSlide()) {
                        isSlideAllowed.current = false;
                        return;
                    } else {
                        isSlideAllowed.current = true;
                    }
                    sliderX.current += e.movementX;
                    // this is used to trigger re-paint
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
        function animate() {
            const ctx = canvasRef.current?.getContext("2d", { alpha: false });
            if (!ctx) {
                return;
            }
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = isDark ? "rgb(43, 48, 53)" : "rgb(248, 249, 250)";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            renderImages(ctx, state.images, sliderX.current);
            /*
            Recursively calling this re-renders images continuously, even when not dragging.
            Does this spark joy?
            If not, look into only re-rendering on some delta.
            But what delta?
            */
            requestAnimationFrame(animate);
        }
        const ctx = canvasRef.current?.getContext("2d", { alpha: false });
        if (ctx) {
            // This works, but requestAnimationFrame is recommended.
            // setTimeout(() => {
            //     // not sure clearing the canvas does much, when it's immediately refilled.
            //     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            //     ctx.fillStyle = isDark
            //         ? "rgb(43, 48, 53)"
            //         : "rgb(248, 249, 250)";
            //     ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            //     renderImages(ctx, state.images, sliderX.current);
            // }, 120);
            requestAnimationFrame(animate);
        } else {
            console.log("%cNo context in Canvas component!", "color: hotpink");
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
