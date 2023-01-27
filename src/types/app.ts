export interface ElHeight {
    name: ElName;
    height: number;
}

export enum ElName {
    "NAVBAR" = "navbar",
    "VIEWER_CONTROLS" = "viewer-controls",
}

export interface SliderImage {
    path: string;
    altText: string;
}