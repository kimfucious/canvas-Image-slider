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
            let currentIndex = state.currentImageIndex;
            if (movementAmount > canvas.width / 3 && isSlideAllowed.current) {
                console.log("%cGonna finish slide", "color:lime");
                if (movementX.current < 0) {
                    sliderX.current -= diff;
                    currentIndex += 1;
                } else if (movementX.current > 0) {
                    sliderX.current += diff;
                    currentIndex -= 1;
                }
                console.log(
                    `%cSetting current index to: ${currentIndex}`,
                    "color:lime"
                );
                setState({
                    ...state,
                    isDragging: false,
                    currentImageIndex: currentIndex,
                });
            } else {
                console.log("%cGonna undo slide", "color:yellow");
                console.log(
                    `%cCurrent Image Index: ${state.currentImageIndex}`,
                    "color:yellow"
                );
                sliderX.current = state.currentImageIndex * canvas.width * -1;
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
                if (state.isMouseInCanvas) {
                    console.log("mousedown", e.clientX, e.clientY);
                    setState({ ...state, isDragging: true });
                } else {
                    console.log("Not in canvas");
                }
            };
            canvas.onmousemove = (e) => {
                if (state.isDragging) {
                    movementX.current += e.movementX;
                    if (
                        (movementX.current > 0 &&
                            state.currentImageIndex === 0) ||
                        (movementX.current < 0 &&
                            state.currentImageIndex === state.images.length - 1)
                    ) {
                        console.log("%cDisallowing slide", "color:yellow");
                        isSlideAllowed.current = false;
                        return;
                    } else {
                        console.log("%cAllowing slide", "color: lime");
                        isSlideAllowed.current = true;
                    }
                    sliderX.current += e.movementX;
                    /* FIXME: needed to cause refresh, but refresh causes flicker
                       Need to look at requestAnimationFrame
                    */
                    setState({ ...state, movement: sliderX.current });
                    // console.log("I'm dragging!", sliderX.current);
                }
            };
            canvas.onmouseup = (e) => {
                console.log("mouseup", e.clientX, e.clientY);
                handleSlide();
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
