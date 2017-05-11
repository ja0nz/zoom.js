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
/* unknown exports provided */
/* all exports used */
/*!*********************!*\
  !*** ./src/zoom.js ***!
  \*********************/
/***/ (function(module, exports) {

eval("/**\n * Pure JavaScript implementation of zoom.js.\n *\n * Original preamble:\n * zoom.js - It's the best way to zoom an image\n * @version v0.0.2\n * @link https://github.com/fat/zoom.js\n * @license MIT\n *\n * Needs a related CSS file to work. See the README at\n * https://github.com/nishanths/zoom.js for more info.\n *\n * This is a fork of the original zoom.js implementation by @fat.\n * Copyrights for the original project are held by @fat. All other copyright\n * for changes in the fork are held by Nishanth Shanmugham.\n *\n * Copyright (c) 2013 @fat\n * The MIT License. Copyright © 2016 Nishanth Shanmugham.\n */\n\n\n\nclass ZoomJS extends HTMLElement {\n\n    constructor() {\n        super();\n        this.zoom = this.firstElementChild;  // Img node\n        this.offset = 80; \n        this.zoomEvents = {\n            zoomOutHandler: () => this.zoomOut.call(this.zoom),\n            keyUp: e => {\n                if (e.keyCode == 27) this.zoomEvents.zoomOutHandler();\n            },\n            handleTouchStart: e => {\n                let initialTouchPos = -1;\n                const t = e.touches[0];\n                initialTouchPos = t.pageY;\n                e.target.addEventListener(\"touchmove\", e => this.zoomEvents.handleTouchMove(e, initialTouchPos));\n            },\n            handleTouchMove: (e, i) => {\n                const t = e.touches[0];\n                if (Math.abs(t.pageY - i) > 10) {\n                    this.zoomEvents.zoomOutHandler();\n                    e.target.removeEventListener(\"touchmove\", this);\n                }\n            }\n        };\n    }\n    connectedCallback() {\n        if (this.zoom) {\n            this.zoom.style.cursor = \"zoom-in\";\n            this.addEventListener(\"click\", e => {\n                if (e.metaKey || e.ctrlKey) {\n                    window.open(e.target.src);\n                    return this.connectedCallback();\n                }\n                if (e.target.width >= document.documentElement.clientWidth - this.offset) {\n                    return Error(\"Image exceeds screen width\");\n                }\n                this.zoomIn.call(this.zoom);\n                this.zoomListeners();\n                return \"zoomed\";\n            }, { once: true });\n        }\n    }\n    zoomIn() {\n        this.preservedTransform = this.style.transform;\n        const scale = (() => {\n            const maxScaleFactor = this.naturalWidth / this.width;\n            const viewportWidth = document.documentElement.clientWidth - this.parentElement.offset;\n            const viewportHeight = document.documentElement.clientHeight - this.parentElement.offset;\n            const imageAspectRatio = this.naturalWidth / this.naturalHeight;\n            const viewportAspectRatio = viewportWidth / viewportHeight;\n\n            if (this.naturalWidth < viewportWidth && this.naturalHeight < viewportHeight) {\n                return maxScaleFactor;\n            } else if (imageAspectRatio < viewportAspectRatio) {\n                return (viewportHeight / this.naturalHeight) * maxScaleFactor;\n            } else {\n                return (viewportWidth / this.naturalWidth) * maxScaleFactor;\n            }\n        })();\n\n        const imageOffset = (() => {\n            const rect = this.getBoundingClientRect();\n            return {\n                top: rect.top + window.pageYOffset - document.documentElement.clientTop,\n                left: rect.left + window.pageXOffset - document.documentElement.clientLeft\n            };\n        })();\n\n        Object.assign(this.parentElement.style, {\n            display: \"block\",\n            transition: \"all 300ms\"\n        });\n\n        Object.assign(this.style, {\n            outline: \"100vw solid transparent\",\n            transition: \"all 300ms\",\n            pointerEvents: \"auto\",\n            cursor: \"zoom-out\"\n        });\n        Object.assign(document.body.style, {\n            pointerEvents: \"none\"\n        });\n\n        (( /*animate*/ ) => {\n            const scrollTop = window.pageYOffset;\n            const viewportX = (document.documentElement.clientWidth / 2);\n            const viewportY = scrollTop + (document.documentElement.clientHeight / 2);\n            const imageCenterX = imageOffset.left + (this.width / 2);\n            const imageCenterY = imageOffset.top + (this.height / 2);\n            const tx = viewportX - imageCenterX;\n            const ty = viewportY - imageCenterY;\n            const tz = 0;\n\n            Object.assign(this.parentElement.style, {\n                transform: `translate3d(${tx}px, ${ty}px, ${tz}px)`\n            });\n            Object.assign(this.style, {\n                outlineColor: \"#fff\",\n                transform: `scale(${scale})`\n            });\n\n        })();\n    }\n\n    zoomOut() {\n        const sleep = ms =>\n            new Promise((resolve) => window.setTimeout(resolve, ms));\n\n        (async function cleanup() {\n            Object.assign(this.parentElement.style, {\n                transform: `none`\n            });\n            Object.assign(this.style, {\n                outlineColor: \"transparent\",\n                transform: this.preservedTransform\n            });\n\n            await sleep(300);\n\n            Object.assign(this.parentElement.style, {\n                display: \"\",\n                transition: \"\"\n            });\n            Object.assign(this.style, {\n                outline: \"\",\n                outlineColor: \"\",\n                transition: \"\",\n                cursor: \"zoom-in\"\n            });\n\n            Object.assign(document.body.style, {\n                pointerEvents: \"auto\"\n            });\n            this.parentElement.zoomListeners(\"remove\");\n            // Restart\n            this.parentElement.connectedCallback();\n\n        }).call(this);\n    }\n\n    zoomListeners(remove) {\n        if (remove) {\n            document.removeEventListener(\"scroll\", this.zoomEvents.zoomOutHandler);\n            document.removeEventListener(\"keyup\", this.zoomEvents.keyUp);\n            document.removeEventListener(\"touchstart\", this.zoomEvents.handleTouchStart);\n            document.removeEventListener(\"click\", this.zoomEvents.zoomOutHandler, true);\n        } else {\n            document.addEventListener(\"scroll\", this.zoomEvents.zoomOutHandler, { once: true });\n            document.addEventListener(\"keyup\", this.zoomEvents.keyUp, { once: true });\n            document.addEventListener(\"touchstart\", this.zoomEvents.handleTouchStart, { once: true });\n            document.addEventListener(\"click\", this.zoomEvents.zoomOutHandler, { capture: true, once: true });\n        }\n    }\n}\ncustomElements.define('zoom-js', ZoomJS);\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uL3NyYy96b29tLmpzPzc2NzIiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBQdXJlIEphdmFTY3JpcHQgaW1wbGVtZW50YXRpb24gb2Ygem9vbS5qcy5cbiAqXG4gKiBPcmlnaW5hbCBwcmVhbWJsZTpcbiAqIHpvb20uanMgLSBJdCdzIHRoZSBiZXN0IHdheSB0byB6b29tIGFuIGltYWdlXG4gKiBAdmVyc2lvbiB2MC4wLjJcbiAqIEBsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mYXQvem9vbS5qc1xuICogQGxpY2Vuc2UgTUlUXG4gKlxuICogTmVlZHMgYSByZWxhdGVkIENTUyBmaWxlIHRvIHdvcmsuIFNlZSB0aGUgUkVBRE1FIGF0XG4gKiBodHRwczovL2dpdGh1Yi5jb20vbmlzaGFudGhzL3pvb20uanMgZm9yIG1vcmUgaW5mby5cbiAqXG4gKiBUaGlzIGlzIGEgZm9yayBvZiB0aGUgb3JpZ2luYWwgem9vbS5qcyBpbXBsZW1lbnRhdGlvbiBieSBAZmF0LlxuICogQ29weXJpZ2h0cyBmb3IgdGhlIG9yaWdpbmFsIHByb2plY3QgYXJlIGhlbGQgYnkgQGZhdC4gQWxsIG90aGVyIGNvcHlyaWdodFxuICogZm9yIGNoYW5nZXMgaW4gdGhlIGZvcmsgYXJlIGhlbGQgYnkgTmlzaGFudGggU2hhbm11Z2hhbS5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMgQGZhdFxuICogVGhlIE1JVCBMaWNlbnNlLiBDb3B5cmlnaHQgwqkgMjAxNiBOaXNoYW50aCBTaGFubXVnaGFtLlxuICovXG5cblxuXG5jbGFzcyBab29tSlMgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy56b29tID0gdGhpcy5maXJzdEVsZW1lbnRDaGlsZDsgIC8vIEltZyBub2RlXG4gICAgICAgIHRoaXMub2Zmc2V0ID0gODA7IFxuICAgICAgICB0aGlzLnpvb21FdmVudHMgPSB7XG4gICAgICAgICAgICB6b29tT3V0SGFuZGxlcjogKCkgPT4gdGhpcy56b29tT3V0LmNhbGwodGhpcy56b29tKSxcbiAgICAgICAgICAgIGtleVVwOiBlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZS5rZXlDb2RlID09IDI3KSB0aGlzLnpvb21FdmVudHMuem9vbU91dEhhbmRsZXIoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoYW5kbGVUb3VjaFN0YXJ0OiBlID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgaW5pdGlhbFRvdWNoUG9zID0gLTE7XG4gICAgICAgICAgICAgICAgY29uc3QgdCA9IGUudG91Y2hlc1swXTtcbiAgICAgICAgICAgICAgICBpbml0aWFsVG91Y2hQb3MgPSB0LnBhZ2VZO1xuICAgICAgICAgICAgICAgIGUudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgZSA9PiB0aGlzLnpvb21FdmVudHMuaGFuZGxlVG91Y2hNb3ZlKGUsIGluaXRpYWxUb3VjaFBvcykpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhhbmRsZVRvdWNoTW92ZTogKGUsIGkpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ID0gZS50b3VjaGVzWzBdO1xuICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyh0LnBhZ2VZIC0gaSkgPiAxMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnpvb21FdmVudHMuem9vbU91dEhhbmRsZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgZS50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICBpZiAodGhpcy56b29tKSB7XG4gICAgICAgICAgICB0aGlzLnpvb20uc3R5bGUuY3Vyc29yID0gXCJ6b29tLWluXCI7XG4gICAgICAgICAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBlID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZS5tZXRhS2V5IHx8IGUuY3RybEtleSkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cub3BlbihlLnRhcmdldC5zcmMpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jb25uZWN0ZWRDYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZS50YXJnZXQud2lkdGggPj0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIC0gdGhpcy5vZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEVycm9yKFwiSW1hZ2UgZXhjZWVkcyBzY3JlZW4gd2lkdGhcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuem9vbUluLmNhbGwodGhpcy56b29tKTtcbiAgICAgICAgICAgICAgICB0aGlzLnpvb21MaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ6b29tZWRcIjtcbiAgICAgICAgICAgIH0sIHsgb25jZTogdHJ1ZSB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB6b29tSW4oKSB7XG4gICAgICAgIHRoaXMucHJlc2VydmVkVHJhbnNmb3JtID0gdGhpcy5zdHlsZS50cmFuc2Zvcm07XG4gICAgICAgIGNvbnN0IHNjYWxlID0gKCgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG1heFNjYWxlRmFjdG9yID0gdGhpcy5uYXR1cmFsV2lkdGggLyB0aGlzLndpZHRoO1xuICAgICAgICAgICAgY29uc3Qgdmlld3BvcnRXaWR0aCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCAtIHRoaXMucGFyZW50RWxlbWVudC5vZmZzZXQ7XG4gICAgICAgICAgICBjb25zdCB2aWV3cG9ydEhlaWdodCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQgLSB0aGlzLnBhcmVudEVsZW1lbnQub2Zmc2V0O1xuICAgICAgICAgICAgY29uc3QgaW1hZ2VBc3BlY3RSYXRpbyA9IHRoaXMubmF0dXJhbFdpZHRoIC8gdGhpcy5uYXR1cmFsSGVpZ2h0O1xuICAgICAgICAgICAgY29uc3Qgdmlld3BvcnRBc3BlY3RSYXRpbyA9IHZpZXdwb3J0V2lkdGggLyB2aWV3cG9ydEhlaWdodDtcblxuICAgICAgICAgICAgaWYgKHRoaXMubmF0dXJhbFdpZHRoIDwgdmlld3BvcnRXaWR0aCAmJiB0aGlzLm5hdHVyYWxIZWlnaHQgPCB2aWV3cG9ydEhlaWdodCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBtYXhTY2FsZUZhY3RvcjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW1hZ2VBc3BlY3RSYXRpbyA8IHZpZXdwb3J0QXNwZWN0UmF0aW8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHZpZXdwb3J0SGVpZ2h0IC8gdGhpcy5uYXR1cmFsSGVpZ2h0KSAqIG1heFNjYWxlRmFjdG9yO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gKHZpZXdwb3J0V2lkdGggLyB0aGlzLm5hdHVyYWxXaWR0aCkgKiBtYXhTY2FsZUZhY3RvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkoKTtcblxuICAgICAgICBjb25zdCBpbWFnZU9mZnNldCA9ICgoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgdG9wOiByZWN0LnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldCAtIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRUb3AsXG4gICAgICAgICAgICAgICAgbGVmdDogcmVjdC5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0IC0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudExlZnRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnBhcmVudEVsZW1lbnQuc3R5bGUsIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IFwiYmxvY2tcIixcbiAgICAgICAgICAgIHRyYW5zaXRpb246IFwiYWxsIDMwMG1zXCJcbiAgICAgICAgfSk7XG5cbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0eWxlLCB7XG4gICAgICAgICAgICBvdXRsaW5lOiBcIjEwMHZ3IHNvbGlkIHRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgICB0cmFuc2l0aW9uOiBcImFsbCAzMDBtc1wiLFxuICAgICAgICAgICAgcG9pbnRlckV2ZW50czogXCJhdXRvXCIsXG4gICAgICAgICAgICBjdXJzb3I6IFwiem9vbS1vdXRcIlxuICAgICAgICB9KTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihkb2N1bWVudC5ib2R5LnN0eWxlLCB7XG4gICAgICAgICAgICBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIlxuICAgICAgICB9KTtcblxuICAgICAgICAoKCAvKmFuaW1hdGUqLyApID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbFRvcCA9IHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgICAgIGNvbnN0IHZpZXdwb3J0WCA9IChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGggLyAyKTtcbiAgICAgICAgICAgIGNvbnN0IHZpZXdwb3J0WSA9IHNjcm9sbFRvcCArIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0IC8gMik7XG4gICAgICAgICAgICBjb25zdCBpbWFnZUNlbnRlclggPSBpbWFnZU9mZnNldC5sZWZ0ICsgKHRoaXMud2lkdGggLyAyKTtcbiAgICAgICAgICAgIGNvbnN0IGltYWdlQ2VudGVyWSA9IGltYWdlT2Zmc2V0LnRvcCArICh0aGlzLmhlaWdodCAvIDIpO1xuICAgICAgICAgICAgY29uc3QgdHggPSB2aWV3cG9ydFggLSBpbWFnZUNlbnRlclg7XG4gICAgICAgICAgICBjb25zdCB0eSA9IHZpZXdwb3J0WSAtIGltYWdlQ2VudGVyWTtcbiAgICAgICAgICAgIGNvbnN0IHR6ID0gMDtcblxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnBhcmVudEVsZW1lbnQuc3R5bGUsIHtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUzZCgke3R4fXB4LCAke3R5fXB4LCAke3R6fXB4KWBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0eWxlLCB7XG4gICAgICAgICAgICAgICAgb3V0bGluZUNvbG9yOiBcIiNmZmZcIixcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IGBzY2FsZSgke3NjYWxlfSlgXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9KSgpO1xuICAgIH1cblxuICAgIHpvb21PdXQoKSB7XG4gICAgICAgIGNvbnN0IHNsZWVwID0gbXMgPT5cbiAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB3aW5kb3cuc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xuXG4gICAgICAgIChhc3luYyBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnBhcmVudEVsZW1lbnQuc3R5bGUsIHtcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IGBub25lYFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuc3R5bGUsIHtcbiAgICAgICAgICAgICAgICBvdXRsaW5lQ29sb3I6IFwidHJhbnNwYXJlbnRcIixcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm06IHRoaXMucHJlc2VydmVkVHJhbnNmb3JtXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgYXdhaXQgc2xlZXAoMzAwKTtcblxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnBhcmVudEVsZW1lbnQuc3R5bGUsIHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5OiBcIlwiLFxuICAgICAgICAgICAgICAgIHRyYW5zaXRpb246IFwiXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0eWxlLCB7XG4gICAgICAgICAgICAgICAgb3V0bGluZTogXCJcIixcbiAgICAgICAgICAgICAgICBvdXRsaW5lQ29sb3I6IFwiXCIsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogXCJcIixcbiAgICAgICAgICAgICAgICBjdXJzb3I6IFwiem9vbS1pblwiXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihkb2N1bWVudC5ib2R5LnN0eWxlLCB7XG4gICAgICAgICAgICAgICAgcG9pbnRlckV2ZW50czogXCJhdXRvXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5wYXJlbnRFbGVtZW50Lnpvb21MaXN0ZW5lcnMoXCJyZW1vdmVcIik7XG4gICAgICAgICAgICAvLyBSZXN0YXJ0XG4gICAgICAgICAgICB0aGlzLnBhcmVudEVsZW1lbnQuY29ubmVjdGVkQ2FsbGJhY2soKTtcblxuICAgICAgICB9KS5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIHpvb21MaXN0ZW5lcnMocmVtb3ZlKSB7XG4gICAgICAgIGlmIChyZW1vdmUpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJzY3JvbGxcIiwgdGhpcy56b29tRXZlbnRzLnpvb21PdXRIYW5kbGVyKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCB0aGlzLnpvb21FdmVudHMua2V5VXApO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy56b29tRXZlbnRzLmhhbmRsZVRvdWNoU3RhcnQpO1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHRoaXMuem9vbUV2ZW50cy56b29tT3V0SGFuZGxlciwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIHRoaXMuem9vbUV2ZW50cy56b29tT3V0SGFuZGxlciwgeyBvbmNlOiB0cnVlIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIHRoaXMuem9vbUV2ZW50cy5rZXlVcCwgeyBvbmNlOiB0cnVlIH0pO1xuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy56b29tRXZlbnRzLmhhbmRsZVRvdWNoU3RhcnQsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCB0aGlzLnpvb21FdmVudHMuem9vbU91dEhhbmRsZXIsIHsgY2FwdHVyZTogdHJ1ZSwgb25jZTogdHJ1ZSB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmN1c3RvbUVsZW1lbnRzLmRlZmluZSgnem9vbS1qcycsIFpvb21KUyk7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy96b29tLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Iiwic291cmNlUm9vdCI6IiJ9");

/***/ })
/******/ ]);