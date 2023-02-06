import axios, { AxiosResponse } from "axios";
import { HomeState } from "../../pages/home";
import { ImageDataResponse, LoaderState } from "../../types";

export default class ImageLoader {
    private _endpoint: string = "";
    private _imageIds: number[] = [];

    constructor(endpoint: string) {
        if (endpoint) {
            this._endpoint = endpoint;
        }
    }

    async getImages(
        loading: LoaderState,
        setLoading: (s: LoaderState) => void
    ) {
        setLoading({
            isLoading: true,
            val: 0,
        });
        console.log(
            "%c🐕 Fetching valid image IDs from Lorem Picsum",
            "color:cyan"
        );
        let imageIds: number[] = [];
        let nextUrl:
            | string
            | null = `https://picsum.photos/v2/list?page=1&limit=100`;
        while (nextUrl) {
            if (!nextUrl) return;
            const resp: AxiosResponse = await axios(nextUrl);
            const ids = resp.data.map((item: ImageDataResponse) =>
                Number(item.id)
            );
            imageIds = [...imageIds, ...ids];
            setLoading({
                ...loading,
                val: imageIds.length,
            });
            console.log(
                `%c🐕 Fetched ${imageIds.length} IDs so far...`,
                "color:cyan"
            );
            const next = resp.headers.link.split(" ");
            const nextIdx = next.findIndex((item: string) =>
                item.includes('rel="next"')
            );
            if (nextIdx !== -1) {
                nextUrl = next[nextIdx - 1].slice(1, -2);
            } else {
                nextUrl = null;
            }
        }
        console.log("imageIds length", imageIds.length);
        const result = imageIds.slice(10);
        this._imageIds = result;
    }

    getImagesLength() {
        return this._imageIds.length;
    }

    getImageId(idx: number) {
        // console.log("ids", this._imageIds);
        return this._imageIds[idx];
    }

    getRandomImageSource(startPoint: number, idx: number): string {
        const widths = [320, 576, 640, 769, 1024];
        const width = widths[Math.floor(Math.random() * widths.length)];
        const aspectRatios = [1, 4 / 3, 16 / 9];
        const aspectRatio =
            aspectRatios[Math.floor(Math.random() * aspectRatios.length)];
        const height = Math.round(width / aspectRatio);

        const BASE_URL = this._endpoint;
        const id = this._imageIds[startPoint + idx];
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
        loadingImages: LoaderState,
        setLoadingImages: (s: LoaderState) => void,
        loadingImageSources: LoaderState,
        setLoadingImageSources: (s: LoaderState) => void,
        qty: number,
        state: HomeState,
        setState: (s: HomeState) => void
    ): Promise<void> {
        await this.getImages(loadingImageSources, setLoadingImageSources);
        // const startPoint = Math.floor(this._imageIds.length / 2);
        const startPoint = 0;
        const sources = this.getRandomImageSources(startPoint, qty);
        this.loadImages(
            true,
            loadingImages,
            setLoadingImages,
            qty,
            sources,
            state,
            setState
        );
    }

    loadMoreImages(
        loadingImages: LoaderState,
        setLoadingImages: (s: LoaderState) => void,
        qty: number,
        state: HomeState,
        setState: (s: HomeState) => void
    ): void {
        const startPoint = state.images.length;
        const sources = this.getRandomImageSources(startPoint, qty);
        this.loadImages(
            false,
            loadingImages,
            setLoadingImages,
            qty,
            sources,
            state,
            setState
        );
    }

    loadImages(
        isInitialLoad: boolean,
        loadingImages: LoaderState,
        setLoadingImages: (s: LoaderState) => void,
        qty: number,
        sources: string[],
        state: HomeState,
        setState: (s: HomeState) => void
    ): void {
        let loadCount = 0;
        const loadedImages: HTMLImageElement[] = [];
        setLoadingImages({ isLoading: true, val: 0 });
        sources.forEach((src, idx) => {
            const image = new Image();
            image.onload = function () {
                loadCount++;
                // this won't update... needs fixing!
                setLoadingImages({
                    ...loadingImages,
                    val: loadingImages.val + 1,
                });
                if (loadCount === qty) {
                    isInitialLoad
                        ? console.log(
                              `%c🖼️ All ${sources.length} initial images have been loaded.`,
                              "color:lime"
                          )
                        : console.log(
                              `%c🖼️ ${sources.length} more images have been loaded.`,
                              "color:lime"
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
                    // setLoadingImages({ isLoading: false, val: 0 });
                    // setLoadingImages({ isLoading: true, val: 0 });
                }
            };
            image.src = src;
            loadedImages[idx] = image;
        });
        // console.log("Updating final loading state");
        // this needs to find the right spot!
        setLoadingImages({ isLoading: false, val: 0 });
    }
}
