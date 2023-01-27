import useColorTheme from "../../../hooks/useColorTheme";
import { MoonStars, Sun } from "tabler-icons-react";

export default function DarkModeToggleButton() {
    const { theme, toggleTheme } = useColorTheme();
    return (
        <button
            className="btn btn-link pe-0"
            onClick={() => toggleTheme()}
            style={{ textDecoration: "none" }}
        >
            {theme === "dark" ? (
                <Sun color="var(--bs-warning-text)" />
            ) : (
                <MoonStars color="var(--bs-info-text)" />
            )}
        </button>
    );
}
