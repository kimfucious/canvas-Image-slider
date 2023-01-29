import { Circle } from "tabler-icons-react";

interface Props {
    canvasWidth: number;
    currentIndex: React.MutableRefObject<number>;
}
interface DotProps {
    idx: number;
}

export default function ProgressIndicator({canvasWidth, currentIndex }: Props) {
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
        const arr = [];
        for (let i = 0; i < 9; i++) {
            arr.push(<Dot idx={i} />);
        }
        return arr;
    }
    return <div>{renderDots()}</div>;
}
