import { useEffect, useMemo, useRef, useState } from "react";
import { ImageLoader } from "../../api";
import { LoaderState } from "../../types";
import { useWindowSize } from "../../hooks/useWindowSize";
import Canvas from "./components/";
import config from "../../config/config.json";
import ProgressBar from "./components/ProgressIndicator/ProgressBar";
import ProgressIndicator from "./components/ProgressIndicator/";

export interface HomeState {
    currentIndex: number;
    images: HTMLImageElement[];
    isGrabbing: boolean;
    isInCanvas: boolean;
    isLoading: boolean;
    movement: number;
}

const initialState: HomeState = {
    currentIndex: 0,
    images: [],
    isGrabbing: false,
    isInCanvas: false,
    isLoading: false,
    movement: 0,
};

interface Props {
    navbarOffset: number;
}
export default function Home({ navbarOffset }: Props) {
    const currentIndex = useRef(0);
    const [, viewportWidth] = useWindowSize();
    const [state, setState] = useState(initialState);
    const [loadingImages, setLoadingImages] = useState<LoaderState>({
        isLoading: false,
        val: 0,
    });
    const [loadingImageSources, setLoadingImageSources] = useState<LoaderState>(
        {
            isLoading: false,
            val: 0,
        }
    );
    const { SCENE_SIZE } = config;

    useEffect(() => {
        async function init() {
            ImageLoader.initImages(
                loadingImages,
                setLoadingImages,
                loadingImageSources,
                setLoadingImageSources,
                SCENE_SIZE,
                state,
                setState
            );
        }
        if (!state.images.length && !state.currentIndex) {
            init();
        } else {
            const mid = Math.floor(state.images.length / 2);
            if (state.currentIndex >= mid) {
                ImageLoader.loadMoreImages(
                    loadingImages,
                    setLoadingImages,
                    SCENE_SIZE,
                    state,
                    setState
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const { canvasHeight, canvasWidth } = useMemo(() => {
        let canvasHeight = 240;
        let canvasWidth = 320;
        if (viewportWidth >= 640 && viewportWidth < 768) {
            canvasHeight = 432;
            canvasWidth = 576;
        } else if (viewportWidth >= 768) {
            canvasHeight = 480;
            canvasWidth = 640;
        }
        return { canvasHeight, canvasWidth };
    }, [viewportWidth]);

    return (
        <div className="container w-100">
            {state.images.length && !loadingImages.isLoading && (
                <div
                    className="container py-5 d-flex flex-column align-items-center justify-content-center"
                    style={{ marginTop: navbarOffset }}
                >
                    <Canvas
                        currentIndex={currentIndex}
                        height={canvasHeight}
                        width={canvasWidth}
                        state={state}
                        setState={setState}
                    />
                    <ProgressIndicator currentIndex={currentIndex} />
                </div>
            )}
            {!state.images.length &&
                !loadingImages.isLoading &&
                loadingImageSources.val > 0 && (
                    <div
                        className="container py-5 d-flex flex-column align-items-center justify-content-center w-100"
                        style={{ height: `calc(100vh - ${navbarOffset}px` }}
                    >
                        <ProgressBar
                            loading={loadingImageSources}
                            message="Loading image sources..."
                            total={config.MAX_IMAGES}
                        />
                    </div>
                )}
        </div>
    );
}
