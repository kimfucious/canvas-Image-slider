import { loadImages } from "../../actions/imageActions";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import Canvas from "./components/";
import ProgressIndicator from "./components/ProgressIndicator";

export interface HomeState {
    areImagesLoaded: boolean;
    images: HTMLImageElement[];
    isDragging: boolean;
    isMouseInCanvas: boolean;
    movement: number;
}

const initialState: HomeState = {
    areImagesLoaded: false,
    images: [],
    isDragging: false,
    isMouseInCanvas: false,
    movement: 0,
};

interface Props {
    navbarOffset: number;
}
export default function Home({ navbarOffset }: Props) {
    const currentIndex = useRef(0);
    const [, viewportWidth] = useWindowSize();
    const [state, setState] = useState(initialState);

    useEffect(() => {
        const resp = loadImages(state, setState);
        if (resp.length) {
            setState({
                ...state,
                images: resp,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    // I'm not actually waiting for images to load, but I probably should be.
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
                canvasWidth={canvasWidth}
                currentIndex={currentIndex}
                state={state}
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
