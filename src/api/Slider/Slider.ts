import { MutableRefObject } from "react";
import { HomeState } from "../../pages/home";

export default class Slider {
    handleSlide(
        canvas: HTMLCanvasElement,
        currentIndex: React.MutableRefObject<number>,
        isGrabbing: React.MutableRefObject<boolean>,
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
            isGrabbing.current = false;
            setState({ ...state, isGrabbing: false });
            movementX.current = 0;
            return;
        }
        const absMovementAmount = Math.abs(movementX.current);
        console.log("abs", absMovementAmount);
        const diff = canvas.width - absMovementAmount;
        console.log("diff", diff);
        console.log("movementX", movementX.current);
        console.log("currentSlide", currentIndex.current);
        if (isSlideAllowed.current) {
            if (movementX.current < 0) {
                // diff is 0 when keyboard is used
                if (diff === 0) {
                    console.log("this is a keyboard slide to the left");
                    sliderX.current -= absMovementAmount;
                } else {
                    sliderX.current -= diff;
                }
                currentIndex.current += 1;
            } else if (movementX.current > 0) {
                if (diff === 0) {
                    console.log("this is a keyboard slide to the right");
                    sliderX.current += absMovementAmount;
                } else {
                    sliderX.current += diff;
                }
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
        isGrabbing.current = false;
        console.log("new slide", currentIndex.current);
    }
    slideCanSlide(
        max: number,
        movementX: MutableRefObject<number>,
        currentIndex: MutableRefObject<number>
    ) {
        const canSlideLeft =
            movementX.current < 0 && currentIndex.current < max;
        const canSlideRight =
            movementX.current > 0 && currentIndex.current !== 0;
        return canSlideLeft || canSlideRight;
    }
}
