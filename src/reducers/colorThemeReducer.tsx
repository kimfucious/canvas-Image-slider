import { createAction, createReducer } from "@reduxjs/toolkit";
import { ActionType } from "../types";
import { ColorThemeMode } from "../types/colorTheme"; // enum
import type { ColorTheme } from "../types/colorTheme";

const initialState = {
    theme: ColorThemeMode.LIGHT,
} as ColorTheme;

const setTheme = createAction<ColorThemeMode>(ActionType.SET_COLOR_THEME);
const reducer = createReducer({ ...initialState }, (builder) => {
    builder.addCase(setTheme, (state, action) => {
        return {
            ...state,
            theme: action.payload,
        };
    });
});

export default reducer;
