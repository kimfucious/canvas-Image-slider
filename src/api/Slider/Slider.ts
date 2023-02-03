import { MutableRefObject } from "react";
import { HomeState } from "../../pages/home";

export default class Slider {
    handleSlide(
        canvas: HTMLCanvasElement,
        currentIndex: React.MutableRefObject<number>,
        isSlideAllowed: React.MutableRefObject<boolean>,
        movementX: React.MutableRefObject<number>,
        sliderX: React.MutableRefObject<number>,
        state: HomeState,
        setState: (s: HomeState) => void
    ) {
        if (!canvas || !isSlideAllowed.current) {
            if (!isSlideAllowed.current) {
                console.log("%cSlide is disallowed", "color:yellow");
            }
            setState({ ...state, isGrabbing: false });
            movementX.current = 0;
            return;
        }
        const absMovementAmount = Math.abs(movementX.current);
        const diff = canvas.width - absMovementAmount;
        if (isSlideAllowed.current) {
            if (movementX.current < 0) {
                sliderX.current -= diff;
                currentIndex.current += 1;
            } else if (movementX.current > 0) {
                sliderX.current += diff;
                currentIndex.current -= 1;
            }
            console.log(
                `%c🏄🏽‍♀️ Moved to slide ${currentIndex.current}`,
                "color:cyan"
            );
        } else {
            console.log("%cGonna undo slide", "color:yellow");
            sliderX.current = currentIndex.current * canvas.width * -1;
            console.log(
                `%cReverted SliderX: ${sliderX.current}`,
                "color:yellow"
            );
        }
        setState({
            ...state,
            currentIndex: currentIndex.current,
            isGrabbing: false,
        });
        movementX.current = 0;
    }
    slideCanSlide(
        max: number,
        movementX: MutableRefObject<number>,
        currentIndex: MutableRefObject<number>
    ) {
        // console.log("movementX", movementX.current);
        const canSlideLeft =
            movementX.current < 0 && currentIndex.current < max;
        const canSlideRight =
            movementX.current > 0 && currentIndex.current !== 0;
        // console.log("canSlideLeft", canSlideLeft);
        // console.log("canSlideRight", canSlideRight);
        // console.log("and", canSlideRight && canSlideLeft);
        // console.log("or", canSlideRight || canSlideLeft);
        return canSlideLeft || canSlideRight;
    }
}
