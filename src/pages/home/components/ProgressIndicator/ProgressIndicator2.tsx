interface Props {
    currentIndex: React.MutableRefObject<number>;
    imagesCount: number;
    isLoading: boolean;
}
const isDev = process.env.NODE_ENV === "development";
export default function ProgressIndicator({
    currentIndex,
    imagesCount,
}: Props) {
    return isDev ? (
        <div>
            {currentIndex.current + 1} of {`${imagesCount}`}
        </div>
    ) : (
        <div>{currentIndex.current + 1} of &infin;</div>
    );
}
