import { useMemo } from "react";
import { LoaderState } from "../../../../types";

interface Props {
    total: number;
    message: string;
    loading: LoaderState;
}
export default function ProgressBar({message, total, loading }: Props) {
    const progress = useMemo(() => {
        const pct = Math.round(100 * (loading.val / total));
        // console.log("val", loading.val);
        // console.log("pct", pct);
        return pct;
    }, [loading, total]);
    return (
        <div className="container d-flex flex-column align-items-center justify-content-center w-100">
            {loading.val !== 0 && (
                <div
                    className="progress w-100"
                    role="progressbar"
                    aria-label="Loading progress bar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    style={{ maxWidth: 640 }}
                >
                    <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                    >
                        {`${progress}%`}
                    </div>
                </div>
            )}
            <small>{`${message}`}</small>
        </div>
    );
}
