import { ActionType } from "../types";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { useEffect } from "react";

type Payload = {
    theme: string;
    toggleTheme: () => void;
};
export default function useColorTheme(): Payload {
    const dispatch = useAppDispatch();
    const { theme } = useAppSelector((state) => state.colorTheme);

    useEffect(() => {
        const getPreferredTheme = () => {
            return window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
        };
        const preferred = getPreferredTheme();
        dispatch({ type: ActionType.SET_COLOR_THEME, payload: preferred });
        const el = document.querySelector("[data-bs-theme]");
        el?.setAttribute("data-bs-theme", preferred);
    }, [dispatch]);

    function toggleTheme() {
        const el = document.querySelector("[data-bs-theme]");
        const updatedTheme = theme === "dark" ? "light" : "dark";
        el?.setAttribute("data-bs-theme", updatedTheme);
        console.log(
            "%cChanging theme to:",
            "color:cyan",
            updatedTheme === "dark" ? "🌝" : "🌞"
        );
        dispatch({ type: ActionType.SET_COLOR_THEME, payload: updatedTheme });
    }
    return { theme, toggleTheme };
}
