import { PICTURES_ENDPOINT } from "../api/paths";
import { HomeState } from "../pages/home";
// import image_1 from "../assets/images/bm_3.webp";
// import image_2 from "../assets/images/pt.webp";
// import image_3 from "../assets/images/bw.webp";
// import image_4 from "../assets/images/jc.webp";
// import image_5 from "../assets/images/bm.webp";
// import image_6 from "../assets/images/sly_and_robbie.webp";
// import image_7 from "../assets/images/pt_2.webp";
// import image_8 from "../assets/images/bm_mj_pt.webp";
// import image_9 from "../assets/images/sd.webp";
// import type { ImageData } from "../types";
// import { ImageLoader } from "../api/clients";

let loadCount = 0;

export function initImages(state: HomeState, setState: (s: HomeState) => void) {
    try {
        // const imageData: ImageData[] = [
        //     { path: image_1, altText: "Bob Marley" },
        //     { path: image_2, altText: "Peter Tosh" },
        //     { path: image_3, altText: "Bunny Wailer" },
        //     { path: image_4, altText: "Jimmy Cliff" },
        //     { path: image_5, altText: "Sly & Robbie" },
        //     { path: image_6, altText: "Jimmy Cliff" },
        //     { path: image_7, altText: "Peter Tosh" },
        //     {
        //         path: image_8,
        //         altText: "Bob Marley, Mick Jagger, and Peter Tosh",
        //     },
        //     { path: image_9, altText: "Snoop Diggity" },
        // ];
        const sources = getRandomImageSources(5);
        loadImages(sources, state, setState);
    } catch (error) {
        throw error;
    }
}

function loadImages(
    sources: string[],
    state: HomeState,
    setState: (s: HomeState) => void
): void {
    loadCount = 0;

    const loadedImages: HTMLImageElement[] = [];
    sources.forEach((src, idx) => {
        const imgEl = new Image();
        imgEl.onload = function () {
            console.log("%cImage loaded:", "color:lime", src);
            loadCount++;
            if (loadCount === sources.length) {
                console.log(
                    `%cAll ${sources.length} images have been loaded.`,
                    "color:green"
                );
                /* 
                not entirely sure this is the best time to do this, but it works
                better than all prior attempts.
                */
                setState({ ...state, images: loadedImages });
            }
        };
        imgEl.src = src;
        loadedImages[idx] = imgEl;
    });
}
function getRandomImageSource(idx: number) {
    const widths = [320, 576, 640, 769, 1024];
    const width = widths[Math.floor(Math.random() * widths.length)];
    const aspectRatios = [1, 4 / 3, 16 / 9];
    const aspectRatio =
        aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
    const height = Math.round(width / aspectRatio);

    const BASE_URL = PICTURES_ENDPOINT;
    const path =
        aspectRatio === 1
            ? `id/${idx}/${width}.webp`
            : `id/${idx}/${width}/${height}.webp`;
    return BASE_URL + "/" + path;
}

function getRandomImageSources(qty: number): string[] {
    const pictures: string[] = [];
    const startImage = 10;
    for (let i = startImage; i < qty + startImage; i++) {
        const picture = getRandomImageSource(i);
        pictures.push(picture);
    }
    return pictures;
}
export function renderImages(
    ctx: CanvasRenderingContext2D,
    images: HTMLImageElement[],
    sliderX: number
) {
    images.forEach((image, idx) => renderImage(ctx, image, idx, sliderX));
}

function renderImage(
    ctx: CanvasRenderingContext2D,
    image: HTMLImageElement,
    idx: number,
    sliderX: number
) {
    const cAspectRatio = ctx.canvas.width / ctx.canvas.height;
    const iAspectRatio = image.width / image.height;
    const scaleFactor = getImageScale(cAspectRatio, ctx, iAspectRatio, image);
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

function getImageScale(
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
