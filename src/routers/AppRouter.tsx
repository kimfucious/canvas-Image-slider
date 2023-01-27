import { AppRoute } from "../types/routes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ElHeight, ElName } from "../types";
import { useMemo, useState } from "react";
import Home from "../pages/home";
import NavBar from "../components/NavBar";
import NotFound from "../pages/notFound";

export default function AppRouter() {
    const [heights, setHeights] = useState<ElHeight[]>([]);
    const { navbarOffset } = useMemo(() => {
        let nOffset = 56;
        if (heights.length) {
            nOffset =
                heights.find((item) => item.name === ElName.NAVBAR)?.height ??
                56;
        }
        return { navbarOffset: nOffset };
    }, [heights]);
    return (
        <BrowserRouter>
            <NavBar heights={heights} setHeights={setHeights} />
            <Routes>
                <Route
                    path={AppRoute.ROOT}
                    element={<Home navbarOffset={navbarOffset} />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
