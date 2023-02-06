# Canvas Image Slider

This is an example of how to create an HTML 5 Canvas API based image slider

## To Run Locally

1. clone `https://github.com/kimfucious/canvas-image-slider.git` to a directory of your choosing
2. navigate into that directory
3. execute `npm i`
4. execute `npm start`

## Notes

-   [Lorem Picsum](https://picsum.photos/) is used for images. The last image is 1084, but there are gaps.
-   Logic has been put in place to download valid IDs prior to starting the slide show.
-   When running in dev, you will notice some weird behavior (e.g. images changing randomly, number of images loaded to state.images, etc.) due to the fact that React, running in strict mode, does things twice. This does not happen in prod.

## To Do

-   At present, images are added to the DOM and the canvas, but they are not removed. This could get ugly after a certain point, esp. on mobile. Figure out how to remove the right amount at the right time to toward being performant.
-   This does not display nice on a mobile phone in landscape.
-   This does not adapt well when the orientation changes (i.e. turning the phone sideways).
-   Images are loaded on init, and more images are loaded when the current image index is ~half of the loaded images length. If you scroll too fast, the app plays catch-up, but this needs to be more elegant.

## References

-   [Optimizing Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas)
-   [Preloading Images](https://rembound.com/articles/how-to-load-and-draw-images-with-html5-canvas)
-   [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
-   [Animating with javascript](https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/)
-   [Using requestAnimationFrame with React Hooks](https://css-tricks.com/using-requestanimationframe-with-react-hooks/)
