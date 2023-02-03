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
    const movementX = useRef(0);
    const previousTouchX = useRef(0);
    const sliderX = useRef(0);

    useEffect(() => {
        function slideCanSlide() {
            const max = ImageLoader.getImagesLength();
            return Slider.slideCanSlide(max, movementX, currentIndex)
        }
        const canvas = canvasRef.current;
        function handleSlide() {
            if (canvas) {
                Slider.handleSlide(
                    canvas,
                    currentIndex,
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
                const deltaX =
                    previousTouchX.current !== 0
                        ? touch.clientX - previousTouchX.current
                        : 0;
                movementX.current += deltaX;
                if (!slideCanSlide()) {
                    isSlideAllowed.current = false;
                    return;
                } else {
                    isSlideAllowed.current = true;
                }
                sliderX.current += deltaX;
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
        // }, [state.isGrabbing]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    useEffect(() => {
        function animate() {
            SceneRenderer.renderCanvas(canvasRef, isDark, state, sliderX);
            if (!isGrabbing.current) {
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
