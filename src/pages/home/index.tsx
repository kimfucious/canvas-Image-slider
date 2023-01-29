import { loadImageData } from "../../actions/imageActions";
import { useEffect, useMemo, useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import Canvas from "./components/";
import type { SliderImage } from "../../types";

export interface HomeState {
    images: SliderImage[];
    isDragging: boolean;
    isMouseInCanvas: boolean;
    movement: number;
}

const initialState: HomeState = {
    images: [],
    isDragging: false,
    isMouseInCanvas: false,
    movement: 0,
};

interface Props {
    navbarOffset: number;
}
export default function Home({ navbarOffset }: Props) {
    const [, viewportWidth] = useWindowSize();
    const [state, setState] = useState(initialState);

    useEffect(() => {
        const resp = loadImageData();
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
        console.log("new canvas height", canvasHeight);
        console.log("new canvas width", canvasWidth);
        return { canvasHeight, canvasWidth };
    }, [viewportWidth]);

    return state.images.length ? (
        <div
            className="container py-5 d-flex flex-column align-items-center justify-content-center"
            style={{ marginTop: navbarOffset }}
        >
            <Canvas
                height={canvasHeight}
                width={canvasWidth}
                state={state}
                setState={setState}
            />
            {/* <div className="mt-3">
                put indicator here
            </div> */}
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
