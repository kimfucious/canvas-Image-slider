import { Circle } from "tabler-icons-react";
import { HomeState } from "..";

interface Props {
    canvasWidth: number;
    currentIndex: React.MutableRefObject<number>;
    state: HomeState;
}
interface DotProps {
    idx: number;
}

export default function ProgressIndicator({
    canvasWidth,
    currentIndex,
    state,
}: Props) {
    const size = canvasWidth < 640 ? 10 : 14;
    const margin = "1";
    const className = `mx-${margin} px-0`;

    function Dot({ idx }: DotProps) {
        return (
            <i className={className}>
                <Circle
                    color={
                        idx === currentIndex.current
                            ? "var(--bs-primary)"
                            : "var(--bs-secondary"
                    }
                    size={size}
                />
            </i>
        );
    }
    function renderDots() {
        return state.images.map((image, idx) => (
            <Dot key={image.path} idx={idx} />
        ));
    }
    return <div>{renderDots()}</div>;
}
