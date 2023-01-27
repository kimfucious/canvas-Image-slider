import { Navigate } from "react-router-dom";
import { AppRoute } from "../types";
interface Props {
    username: string;
    children: JSX.Element;
}
export default function PublicRoute({ children, username }: Props) {
    if (username) {
        return <Navigate to={AppRoute.ROOT} replace />;
    }
    return children;
}
