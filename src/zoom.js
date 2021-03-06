/**
 * Pure JavaScript implementation of zoom.js.
 *
 * Original preamble:
 * zoom.js - It's the best way to zoom an image
 * @version v0.0.2
 * @link https://github.com/fat/zoom.js
 * @license MIT
 *
 */

class ZoomJS extends HTMLElement {

    constructor() {
        super();
        this.zoom = this.firstElementChild;  // Img node
        this.offset = 80; // Offset to margin-left
        this.initialTouchPos = 0;
        this.initialScroll = 0;
        if (this.zoom) this.zoom.preservedTransform = this.zoom.style.transform; // Preserve styles

        this.zoomEvents = {
            handler: this.zoomOut.bind(this.zoom),
            scroll: e => {
                if (this.initialScroll) this.initialScroll = window.pageYOffset;
                const pos = window.pageYOffset;
                if (Math.abs(this.initialScroll - pos) >= 60) {
                    this.zoomEvents.handler();
                  }
            },
            escapeKey: e => {
                if (e.keyCode == 27) this.zoomEvents.handler();
            },
            touchMove: e => {
                const pos = e.touches[0].pageY;
                if (Math.abs(this.initialTouchPos - pos) > 10) {
                    this.zoomEvents.handler();
                }
            },
            firstTouch: e => this.initialTouchPos = e.touches[0].pageY
        };
    }

    connectedCallback() {
        // Initialize after DOM insertion
        if (this.zoom) {
            this.zoom.style.cursor = "zoom-in";
            this.addEventListener("click", e => {
                if (e.metaKey || e.ctrlKey) {
                    window.open(e.target.src);
                    return this.connectedCallback();
                }
                if (e.target.width >= document.documentElement.clientWidth - this.offset) {
                    return Error("Image exceeds screen width");
                }
                this.zoomIn.call(this.zoom);
                this.zoomListeners();
                return "zoomed";
            }, { once: true });
        }
    }

    zoomIn() {
        // this is bound to the child image node

        const scale = (() => {
            const maxScaleFactor = this.naturalWidth / this.width,
            viewportWidth = document.documentElement.clientWidth - this.parentElement.offset,
            viewportHeight = document.documentElement.clientHeight - this.parentElement.offset,
            imageAspectRatio = this.naturalWidth / this.naturalHeight,
            viewportAspectRatio = viewportWidth / viewportHeight;

            if (this.naturalWidth < viewportWidth && this.naturalHeight < viewportHeight) {
                return maxScaleFactor;
            } else if (imageAspectRatio < viewportAspectRatio) {
                return (viewportHeight / this.naturalHeight) * maxScaleFactor;
            } else {
                return (viewportWidth / this.naturalWidth) * maxScaleFactor;
            }
        })();

        const imageOffset = (() => {
            const rect = this.getBoundingClientRect();
            return {
                top: rect.top + window.pageYOffset - document.documentElement.clientTop,
                left: rect.left + window.pageXOffset - document.documentElement.clientLeft
            };
        })();

        Object.assign(this.parentElement.style, {
            display: "block",
            transition: "all 300ms"
        });

        Object.assign(this.style, {
            outline: "100vw solid transparent",
            transition: "all 300ms",
            pointerEvents: "auto",
            cursor: "zoom-out"
        });
        Object.assign(document.body.style, {
            pointerEvents: "none"
        });

        (function animate() {
            const scrollTop = window.pageYOffset,
            viewportX = (document.documentElement.clientWidth / 2),
            viewportY = scrollTop + (document.documentElement.clientHeight / 2),
            imageCenterX = imageOffset.left + (this.width / 2),
            imageCenterY = imageOffset.top + (this.height / 2),
            tx = viewportX - imageCenterX,
            ty = viewportY - imageCenterY,
            tz = 0;

            Object.assign(this.parentElement.style, {
                transform: `translate3d(${tx}px, ${ty}px, ${tz}px)`
            });
            Object.assign(this.style, {
                outlineColor: "#fff",
                transform: `scale(${scale})`
            });

        }).call(this);
    }

    zoomOut() {
        // this is bound to the child image node
        const sleep = ms => new Promise(resolve => window.setTimeout(resolve, ms));

        (async function cleanup() {
            this.parentElement.zoomListeners("remove");
            Object.assign(this.parentElement.style, {
                transform: `none`
            });
            Object.assign(this.style, {
                outlineColor: "transparent",
                transform: this.preservedTransform
            });

            await sleep(300);

            Object.assign(this.parentElement.style, {
                display: "",
                transition: ""
            });
            Object.assign(this.style, {
                outline: "",
                outlineColor: "",
                transition: "",
                cursor: "zoom-in"
            });

            Object.assign(document.body.style, {
                pointerEvents: "auto"
            });
            // Restart the Zoom Cycle
            this.parentElement.connectedCallback();

        }).call(this);
    }

    zoomListeners(remove) {
        if (remove) {
            document.removeEventListener("scroll", this.zoomEvents.scroll);
            document.removeEventListener("keyup", this.zoomEvents.escapeKey);
            document.removeEventListener("touchstart", this.zoomEvents.firstTouch);
            document.removeEventListener("touchmove", this.zoomEvents.touchMove);
            document.removeEventListener("click", this.zoomEvents.handler, true);
        } else {
            document.addEventListener("scroll", this.zoomEvents.scroll);
            document.addEventListener("keyup", this.zoomEvents.escapeKey, { once: true });
            document.addEventListener("touchstart", this.zoomEvents.firstTouch, {once: true});
            document.addEventListener("touchmove", this.zoomEvents.touchMove);
            document.addEventListener("click", this.zoomEvents.handler, { capture: true, once: true });
        }
    }
}
customElements.define('zoom-js', ZoomJS);
