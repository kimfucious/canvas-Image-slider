import { ImageLoader } from "../../../../api";

interface Props {
    currentIndex: React.MutableRefObject<number>;
}
export default function ProgressIndicator({ currentIndex }: Props) {
    const max = ImageLoader.getImagesLength();
    const id = ImageLoader.getImageId(currentIndex.current);
    const isDev = process.env.NODE_ENV === "development";
    return (
        <div>
            {isDev ? (
                <div>{`${
                    currentIndex.current + 1
                } of ${max} (imageId = ${id})`}</div>
            ) : (
                <div>{`${currentIndex.current + 1} of ${max}`}</div>
            )}
        </div>
    );
}
