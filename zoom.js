/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Pure JavaScript implementation of zoom.js.
 *
 * Original preamble:
 * zoom.js - It's the best way to zoom an image
 * @version v0.0.2
 * @link https://github.com/fat/zoom.js
 * @license MIT
 *
 * This is a fork of the original zoom.js implementation by @nishanths & @fat.
 * Copyrights for the original project are held by @fat. 
 * Copyright (c) 2013 @fat
 */

class ZoomJS extends HTMLElement {

    constructor() {
        super();
        this.zoom = this.firstElementChild;  // Img node
        this.offset = 80; 
        this.zoomEvents = {
            handler: this.zoomOut.bind(this.zoom),
            firstScroll: e => {
                const initialScroll = window.pageYOffset; 
                const furtherScroll = e => {
                    const pos = window.pageYOffset;
                    if (Math.abs(initialScroll - pos) >= 40) {
                        this.zoomEvents.handler();
                        document.removeEventListener("scroll", furtherScroll);
                    }
                };
                document.addEventListener("scroll", furtherScroll);
            },
            escapeKey: e => {
                if (e.keyCode == 27) this.zoomEvents.handler();
            },
            firstTouch: e => {
                const initialTouchPos = e.touches[0].pageY;
                const furtherTouch = e => {
                    const pos = e.touches[0].pageY;
                    if (Math.abs(initialTouchPos - pos) > 10) {
                        this.zoomEvents.handler();
                        document.removeEventListener("touchmove", furtherTouch);
                    }
                };
                document.addEventListener("touchmove", furtherTouch);
            }
        };
    }
    connectedCallback() {
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
        this.preservedTransform = this.style.transform;
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
        const sleep = ms =>
            new Promise(resolve => window.setTimeout(resolve, ms));

        (async function cleanup() {
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
            this.parentElement.zoomListeners("remove");
            // Restart
            this.parentElement.connectedCallback();

        }).call(this);
    }

    zoomListeners(remove) {
        if (remove) {
            document.removeEventListener("scroll", this.zoomEvents.firstScroll);
            document.removeEventListener("keyup", this.zoomEvents.escapeKey);
            document.removeEventListener("touchstart", this.zoomEvents.firstTouch);
            document.removeEventListener("click", this.zoomEvents.handler, true);
        } else {
            document.addEventListener("scroll", this.zoomEvents.firstScroll, { once: true });
            document.addEventListener("keyup", this.zoomEvents.escapeKey, { once: true });
            document.addEventListener("touchstart", this.zoomEvents.firstTouch, {once: true});
            document.addEventListener("click", this.zoomEvents.handler, { capture: true, once: true });
        }
    }
}
customElements.define('zoom-js', ZoomJS);


/***/ })
/******/ ]);