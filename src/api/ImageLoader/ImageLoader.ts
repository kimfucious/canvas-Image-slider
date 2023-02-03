import axios from "axios";
import { HomeState } from "../../pages/home";
import { ImageDataResponse } from "../../types";

export default class ImageLoader {
    private _endpoint: string = "";
    private _imageIds: number[] = [];
    private _counter: number = 0;

    constructor(endpoint: string) {
        if (endpoint) {
            this._endpoint = endpoint;
        }
    }

    async getImages() {
        let page = 0;
        console.log("%c🐕 Fetching IDs from image api", "color:cyan");
        while (this._imageIds.length < 1000) {
            const { data } = await axios(
                `https://picsum.photos/v2/list?page=${page}&limit=100`
            );
            const ids = data.map((item: ImageDataResponse) => item.id);
            this._imageIds = [...this._imageIds, ...ids];
            console.log(
                `%c🐕 Fetched ${this._imageIds.length} IDs so far...`,
                "color:cyan"
            );
            page++;
        }
        this._imageIds = this._imageIds.slice(10);
    }

    getRandomImageSource(startPoint: number, idx: number): string {
        const widths = [320, 576, 640, 769, 1024];
        const width = widths[Math.floor(Math.random() * widths.length)];
        const aspectRatios = [1, 4 / 3, 16 / 9];
        const aspectRatio =
            aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
        const height = Math.round(width / aspectRatio);

        const BASE_URL = this._endpoint;
        // const id = startPoint + idx;
        const id = this._imageIds[startPoint + idx];
        // const path = `id/${id}/${width}/${height}.webp`;
        const path =
            aspectRatio === 1
                ? `id/${id}/${width}.webp`
                : `id/${id}/${width}/${height}.webp`;
        return BASE_URL + "/" + path;
    }

    getRandomImageSources(startPoint: number, qty: number): string[] {
        const sources: string[] = [];
        for (let i = 0; i < qty; i++) {
            const source = this.getRandomImageSource(startPoint, i);
            sources.push(source);
        }
        return sources;
    }

    async initImages(
        isLoading: React.MutableRefObject<boolean>,
        qty: number,
        state: HomeState,
        setState: (s: HomeState) => void
    ): Promise<void> {
        await this.getImages();
        const startPoint = Math.floor(this._imageIds.length / 2);
        const sources = this.getRandomImageSources(startPoint, qty);
        this.loadImages(true, isLoading, qty, sources, state, setState);
    }

    loadMoreImages(
        isLoading: React.MutableRefObject<boolean>,
        qty: number,
        state: HomeState,
        setState: (s: HomeState) => void
    ): void {
        const mid = Math.floor(this._imageIds.length / 2);
        const startPoint = mid + state.images.length;
        const sources = this.getRandomImageSources(startPoint, qty);
        this.loadImages(false, isLoading, qty, sources, state, setState);
    }

    loadImages(
        isInitialLoad: boolean,
        isLoading: React.MutableRefObject<boolean>,
        qty: number,
        sources: string[],
        state: HomeState,
        setState: (s: HomeState) => void
    ): void {
        let loadCount = 0;
        const loadedImages: HTMLImageElement[] = [];
        isLoading.current = false;
        sources.forEach((src, idx) => {
            const image = new Image();
            image.onload = function () {
                loadCount++;
                // console.log("%c🖼️ Image loaded:", "color:lime", image.src);
                if (loadCount === qty) {
                    isInitialLoad
                        ? console.log(
                              `%c🖼️ All ${sources.length} initial images have been loaded.`,
                              "color:green"
                          )
                        : console.log(
                              `%c🖼️ ${sources.length} more images have been loaded.`,
                              "color:green"
                          );
                    /* 
                    not entirely sure this is the best time to do this, but it works
                    better than all prior attempts.
                    */
                    setState({
                        ...state,
                        images: isInitialLoad
                            ? loadedImages
                            : [...state.images, ...loadedImages],
                    });
                    isLoading.current = false;
                }
            };
            image.src = src;
            loadedImages[idx] = image;
        });
    }
}
