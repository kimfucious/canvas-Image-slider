import image_1 from "../assets/images/bw.webp";
import image_2 from "../assets/images/pt.webp";
import image_3 from "../assets/images/bm.webp";
import image_4 from "../assets/images/sly_and_robbie.webp";
import image_5 from "../assets/images/bm_3.webp";
import image_6 from "../assets/images/jc.webp";
import image_7 from "../assets/images/pt_2.webp";
import image_8 from "../assets/images/bm_mj_pt.webp";
import image_9 from "../assets/images/sd.webp";
import type { SliderImage } from "../types";

export function loadImageData() {
    try {
        const images: SliderImage[] = [
            { path: image_1, altText: "Bunny Wailer" },
            { path: image_2, altText: "Peter Tosh" },
            { path: image_3, altText: "Bob Marley" },
            { path: image_4, altText: "Sly & Robbie" },
            { path: image_5, altText: "Bob Marley 3" },
            { path: image_6, altText: "Jimmy Cliff" },
            { path: image_7, altText: "Peter Tosh" },
            {
                path: image_8,
                altText: "Bob Marley, Mick Jagger, and Peter Tosh",
            },
            { path: image_9, altText: "Snoop Diggity" },
        ];
        return images;
    } catch (error) {
        throw error;
    }
}

function loadImage(
    ctx: CanvasRenderingContext2D,
    idx: number,
    images: SliderImage[],
    sliderX: number
) {
    if (idx >= 0 && idx < images.length) {
        const image = new Image();
        image.src = images[idx].path;
        image.onload = () => {
            console.log("SliderX is:", sliderX);
            const offset = idx * ctx.canvas.width;
            console.log("offset is:", offset);
            const description = images[idx].altText;
            renderImage(ctx, description, image, offset, sliderX);
        };
    }
}

export function loadImages(
    ctx: CanvasRenderingContext2D,
    images: SliderImage[],
    sliderX: number
) {
    console.log(`Loading ${images.length} images...`);
    images.forEach((_, idx) => loadImage(ctx, idx, images, sliderX));
}

function renderImage(
    ctx: CanvasRenderingContext2D,
    description: string,
    image: HTMLImageElement,
    offset: number,
    sliderX: number
) {
    console.log(`Rendering ${description}...`);
    const scaleFactor = getImageScale(ctx, description, image);
    const x =
        offset + sliderX + (ctx.canvas.width - image.width * scaleFactor) / 2;
    const y = (ctx.canvas.height - image.height * scaleFactor) / 2;
    ctx.drawImage(
        image,
        Math.round(x),
        Math.round(y),
        Math.round(image.width * scaleFactor),
        Math.round(image.height * scaleFactor)
    );
    // https://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    // requestAnimationFrame(renderImage)
}

function getImageScale(
    ctx: CanvasRenderingContext2D,
    description: string,
    image: HTMLImageElement
) {
    const cAspectRatio = ctx.canvas.width / ctx.canvas.height;
    const iAspectRatio = image.width / image.height;
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
