import { ImageLoader } from "../../../../api";

interface Props {
    currentIndex: React.MutableRefObject<number>;
    imagesCount: number;
    isLoading: boolean;
}
export default function ProgressIndicator({ currentIndex }: Props) {
    const max = ImageLoader.getImagesLength();
    return (
        <div>
            {currentIndex.current + 1} of {`${max}`}
        </div>
    );
}
