import { HomeState } from "../../pages/home";

export default class ImageLoader {
    private _endpoint: string = "";

    constructor(endpoint: string) {
        if (endpoint) {
            this._endpoint = endpoint;
        }
    }

    getRandomImageSource(startImage: number, idx: number): string {
        const widths = [320, 576, 640, 769, 1024];
        const width = widths[Math.floor(Math.random() * widths.length)];
        const aspectRatios = [1, 4 / 3, 16 / 9];
        const aspectRatio =
            aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
        const height = Math.round(width / aspectRatio);

        const BASE_URL = this._endpoint;
        const id = startImage + idx;
        const path =
            aspectRatio === 1
                ? `id/${id}/${width}.webp`
                : `id/${id}/${width}/${height}.webp`;
        return BASE_URL + "/" + path;
    }

    getRandomImageSources(startImage: number, qty: number): string[] {
        const sources: string[] = [];
        for (let i = 0; i < qty; i++) {
            const source = this.getRandomImageSource(startImage, i);
            sources.push(source);
        }
        console.log("sources", sources);
        return sources;
    }

    initImages(
        isLoading: React.MutableRefObject<boolean>,
        qty: number,
        startImage: number,
        state: HomeState,
        setState: (s: HomeState) => void
    ): void {
        const sources = this.getRandomImageSources(startImage, qty);
        this.loadImages(true, isLoading, qty, sources, state, setState);
    }

    loadMoreImages(
        isLoading: React.MutableRefObject<boolean>,
        qty: number,
        startImage: number,
        state: HomeState,
        setState: (s: HomeState) => void
    ): void {
        const sources = this.getRandomImageSources(
            startImage + state.images.length,
            qty
        );
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
                console.log("%cImage loaded:", "color:lime", image.src);
                if (loadCount === qty) {
                    isInitialLoad
                        ? console.log(
                              `%cAll ${sources.length} initial images have been loaded.`,
                              "color:green"
                          )
                        : console.log(
                              `%c${sources.length} more images have been loaded.`,
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
