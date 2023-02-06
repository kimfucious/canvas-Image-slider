import { useEffect, useRef } from "react";
import { ColorThemeMode } from "../../../types/colorTheme";
import { HomeState } from "..";
import { ImageLoader, SceneRenderer, Slider } from "../../../api";
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
    const frame = useRef(0);
    const isGrabbing = useRef(false);
    const isSlideAllowed = useRef(false);
    const deltaX = useRef(0);
    const movementX = useRef(0);
    const previousTouchX = useRef(0);
    const sliderX = useRef(0);

    // used for testing rapid slide changes
    // useEffect(() => {
    //     const canvas = canvasRef.current;
    //     function slideCanSlide() {
    //         const max = ImageLoader.getImagesLength();
    //         return Slider.slideCanSlide(max, movementX, currentIndex);
    //     }
    //     function handleSlide() {
    //         if (canvas) {
    //             Slider.handleSlide(
    //                 canvas,
    //                 currentIndex,
    //                 isGrabbing,
    //                 isSlideAllowed,
    //                 movementX,
    //                 sliderX,
    //                 state,
    //                 setState
    //             );
    //         }
    //     }
    //     if (!canvas) return;
    //     const keydownHandler = (e: globalThis.KeyboardEvent) => {
    //         if (e.repeat) {
    //             console.log("No repeat!");
    //             return;
    //         }
    //         const key = e.key;
    //         const amt = canvas.width;
    //         if (key === "ArrowLeft" || key === "ArrowRight") {
    //             isGrabbing.current = true;
    //             if (key === "ArrowLeft") {
    //                 movementX.current = amt;
    //             }
    //             if (key === "ArrowRight") {
    //                 movementX.current = amt * -1;
    //             }
    //             if (!slideCanSlide()) {
    //                 isSlideAllowed.current = false;
    //                 movementX.current = 0;
    //                 isGrabbing.current = false;
    //                 return;
    //             } else {
    //                 isSlideAllowed.current = true;
    //                 handleSlide();
    //             }
    //         }
    //     };
    //     document.addEventListener("keydown", (e) => keydownHandler(e));
    //     return () => {
    //         console.log("Cleaning up?");
    //         document.removeEventListener("keydown", (e) => keydownHandler(e));
    //     };
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        function slideCanSlide() {
            const max = ImageLoader.getImagesLength();
            return Slider.slideCanSlide(max, movementX, currentIndex);
        }
        function handleSlide() {
            if (canvas) {
                Slider.handleSlide(
                    canvas,
                    currentIndex,
                    isGrabbing,
                    isSlideAllowed,
                    movementX,
                    sliderX,
                    state,
                    setState
                );
            }
        }
        if (canvas) {
            canvas.onmouseenter = (e) => {
                setState({ ...state, isInCanvas: true });
            };
            canvas.onmouseleave = (e) => {
                /*
                Possibly better UX to allow dragging to continue after leaving the canvas.
                */
                isGrabbing.current = false;
                if (movementX.current) {
                    handleSlide();
                } else {
                    setState({
                        ...state,
                        isInCanvas: false,
                        isGrabbing: false,
                    });
                }
            };
            canvas.onmousedown = (e) => {
                if (e.target === canvas) {
                    isGrabbing.current = true;
                    // console.log("I'm grabbing!");
                    setState({ ...state, isGrabbing: true });
                } else {
                    console.log("Not in canvas");
                }
            };
            canvas.onmousemove = (e) => {
                if (isGrabbing.current) {
                    movementX.current += e.movementX;
                    if (!slideCanSlide()) {
                        isSlideAllowed.current = false;
                        return;
                    } else {
                        isSlideAllowed.current = true;
                    }
                    sliderX.current += e.movementX;
                    // this is used to trigger re-paint (refs don't do that)
                    setState({ ...state, movement: sliderX.current });
                }
            };
            canvas.onmouseup = () => {
                isGrabbing.current = false;
                handleSlide();
            };
            canvas.ontouchstart = (e) => {
                if (e.target === canvas) {
                    isGrabbing.current = true;
                    deltaX.current = 0;
                    // console.log("I'm grabbing!");
                    setState({ ...state, isGrabbing: true });
                } else {
                    console.log("Not in canvas");
                }
                // isGrabbing.current = true;
            };
            canvas.ontouchmove = (e) => {
                if (e.target === canvas) {
                    e.preventDefault();
                }
                const touch = e.targetTouches[0];
                console.log("touchX", touch.clientX);
                console.log("previous", previousTouchX.current);
                deltaX.current =
                    previousTouchX.current !== 0
                        ? touch.clientX - previousTouchX.current
                        : 0;
                console.log("deltaX", deltaX.current);
                movementX.current += deltaX.current;
                const canIt = slideCanSlide();
                console.log("canIt", canIt);
                if (!canIt) {
                    console.log("no can do");
                    isSlideAllowed.current = false;
                } else {
                    console.log("can do");
                    isSlideAllowed.current = true;
                    sliderX.current += deltaX.current;
                }
                previousTouchX.current = touch.clientX;
                setState({ ...state, movement: sliderX.current });
            };
            canvas.ontouchend = () => {
                isGrabbing.current = false;
                previousTouchX.current = 0;
                if (movementX.current === 0) return;
                handleSlide();
            };
            canvas.ontouchcancel = () => {
                isGrabbing.current = false;
                previousTouchX.current = 0;
                if (movementX.current === 0) return;
                handleSlide();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    useEffect(() => {
        function animate() {
            SceneRenderer.renderCanvas(canvasRef, isDark, state, sliderX);
            if (!isGrabbing.current) {
                console.log("cancelling animation frame");
                cancelAnimationFrame(frame.current);
                // frame.current = 0
            } else {
                frame.current = requestAnimationFrame(animate);
            }
        }
        frame.current = requestAnimationFrame(animate);
    }, [isDark, state, width]);

    return (
        <canvas
            ref={canvasRef}
            height={height}
            width={width}
            style={{
                cursor: isGrabbing.current ? "grabbing" : "grab",
            }}
        />
    );
}
