import { useEffect, useRef } from "react";
import { renderImages } from "../actions/imageActions";
import { HomeState } from "../pages/home";

interface Props {
    // nextAnimationFrameHandler: any;
    shouldAnimate: boolean;
    isDark: boolean
    sliderX: React.MutableRefObject<number>
    state: HomeState
    canvasRef: React.MutableRefObject<HTMLCanvasElement>
}
export default function useAnimationFrame({
    // nextAnimationFrameHandler,
    shouldAnimate,
    isDark,
    sliderX,
    state,
    canvasRef
}: Props) {
    const frame = useRef(0);
    useEffect(() => {
    const animate = () => {
        const ctx = canvasRef.current?.getContext("2d", { alpha: false });
            if (!ctx) {
                return;
            }
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = isDark ? "rgb(43, 48, 53)" : "rgb(248, 249, 250)";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            renderImages(ctx, state.images, sliderX.current);
        // nextAnimationFrameHandler();
        frame.current = requestAnimationFrame(animate);
    };
        // start or continue animation in case of shouldAnimate if true
        if (shouldAnimate) {
            frame.current = requestAnimationFrame(animate);
        } else {
            // stop animation
            cancelAnimationFrame(frame.current);
        }

        return () => cancelAnimationFrame(frame.current);
    }, [shouldAnimate]);
}
