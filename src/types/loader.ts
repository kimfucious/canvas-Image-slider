export interface LoaderState {
    isLoading: boolean;
    val: number;
}

export enum LoaderTarget {
    IMAGE_SOURCES = "image_sources",
    IMAGES = "images"
}
