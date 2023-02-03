import { MutableRefObject } from "react";
import { HomeState } from "../../pages/home";

export default class SceneRenderer {
    renderCanvas(
        canvasRef: MutableRefObject<HTMLCanvasElement | null>,
        isDark: boolean,
        state: HomeState,
        sliderX: MutableRefObject<number>
    ) {
        const ctx = canvasRef.current?.getContext("2d", { alpha: false });
        if (!ctx) {
            console.log("%cNo context!", "color:yellow");
            return;
        }
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.fillStyle = isDark ? "rgb(43, 48, 53)" : "rgb(248, 249, 250)";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // console.log(`%cRendering ${state.images.length} images`, "color:cyan");
        this.renderImages(ctx, state.images, sliderX.current);
    }
    renderImages(
        ctx: CanvasRenderingContext2D,
        images: HTMLImageElement[],
        sliderX: number
    ) {
        images.forEach((image, idx) =>
            this.renderImage(ctx, image, idx, sliderX)
        );
    }

    renderImage(
        ctx: CanvasRenderingContext2D,
        image: HTMLImageElement,
        idx: number,
        sliderX: number
    ) {
        const cAspectRatio = ctx.canvas.width / ctx.canvas.height;
        const iAspectRatio = image.width / image.height;
        const scaleFactor = this.getImageScale(
            cAspectRatio,
            ctx,
            iAspectRatio,
            image
        );
        let height = image.height * scaleFactor;
        let width = image.width * scaleFactor;
        /* 
        This adds spacing around each image so they don't butt up against each other
        It's not exactly like the demo, but I think it looks better :)
        */
        if (
            image.height >= ctx.canvas.height ||
            image.height >= ctx.canvas.height
        ) {
            height -= ctx.canvas.width < 640 ? 28 : 48;
            width -= ctx.canvas.width < 640 ? 28 : 48;
        }
        const offset = idx * ctx.canvas.width;
        const x = offset + sliderX + (ctx.canvas.width - width) / 2;
        const y = (ctx.canvas.height - height) / 2;
        ctx.drawImage(
            image,
            Math.round(x),
            Math.round(y),
            Math.round(width),
            Math.round(height)
        );
    }

    getImageScale(
        cAspectRatio: number,
        ctx: CanvasRenderingContext2D,
        iAspectRatio: number,
        image: HTMLImageElement
    ) {
        if (iAspectRatio >= cAspectRatio) {
            if (image.width > ctx.canvas.width) {
                return ctx.canvas.width / image.width;
            }
            return 1;
        } else {
            if (image.height > ctx.canvas.height) {
                return ctx.canvas.height / image.height;
            }
            return 1;
        }
    }
}
