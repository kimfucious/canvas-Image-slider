import { PICTURES_ENDPOINT } from "./paths";
import ImageLoader from "./ImageLoader/ImageLoader";
import Slider from "./Slider";
import SceneRenderer from "./SceneRenderer";

const newImageLoader = new ImageLoader(PICTURES_ENDPOINT);
const newSceneRenderer = new SceneRenderer();
const newSlider = new Slider();

export { newImageLoader as ImageLoader };
export { newSceneRenderer as SceneRenderer };
export { newSlider as Slider };
