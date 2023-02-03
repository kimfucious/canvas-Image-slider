import { ImageLoader } from "../../../../api";
import type { LoaderState } from "../../../../types";
import ProgressBar from "./ProgressBar";

interface Props {
    currentIndex: React.MutableRefObject<number>;
    imagesCount: number;
    loading: LoaderState;
    setLoading: (s: LoaderState) => void;
}
export default function ProgressIndicator({ currentIndex, loading }: Props) {
    const max = ImageLoader.getImagesLength();
    return (
        <div>
            {loading.isLoading && loading.val > 0 ? (
                <ProgressBar
                    loading={loading}
                    message="Loading Images..."
                    total={10}
                />
            ) : (
                <div>
                    {currentIndex.current + 1} of {`${max}`}
                </div>
            )}
        </div>
    );
}
