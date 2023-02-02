import { useEffect, useMemo, useRef, useState } from "react";
import { ImageLoader } from "../../api";
import { useWindowSize } from "../../hooks/useWindowSize";
import Canvas from "./components/";
import ProgressIndicator from "./components/ProgressIndicator/";

export interface HomeState {
    currentIndex: number;
    currentScene: number;
    images: HTMLImageElement[];
    isGrabbing: boolean;
    isInCanvas: boolean;
    isLoading: boolean;
    movement: number;
}

const initialState: HomeState = {
    currentIndex: 0,
    currentScene: 1,
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
    const isLoading = useRef(false);
    const [, viewportWidth] = useWindowSize();
    const [state, setState] = useState(initialState);
    const SCENE_SIZE = 5;
    const START_IMAGE = 10;

    useEffect(() => {
        if (!state.images.length && !state.currentIndex) {
            ImageLoader.initImages(
                isLoading,
                SCENE_SIZE,
                START_IMAGE,
                state,
                setState
            );
        } else {
            const mid = Math.floor(state.images.length / 2);
            // console.log("MID", mid);
            // console.log("current Index", state.currentIndex);
            if (state.currentIndex >= mid) {
            // if (state.currentIndex >= state.images.length - 1) {
                ImageLoader.loadMoreImages(
                    isLoading,
                    SCENE_SIZE,
                    START_IMAGE,
                    state,
                    setState
                );
            }
        }
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

    return state.images.length ? (
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
            <ProgressIndicator
                currentIndex={currentIndex}
                imagesCount={state.images.length}
                isLoading={isLoading.current}
            />
        </div>
    ) : (
        <div
            className="container py-5 d-flex flex-column align-items-center justify-content-center vh-100"
            style={{ marginTop: navbarOffset }}
        >
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}
