!function(t){function e(o){if(n[o])return n[o].exports;var i=n[o]={i:o,l:!1,exports:{}};return t[o].call(i.exports,i,i.exports,e),i.l=!0,i.exports}var n={};e.m=t,e.c=n,e.i=function(t){return t},e.d=function(t,n,o){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:o})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=2)}([function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=function(){return document.documentElement.clientWidth},i=function(){return document.documentElement.clientHeight},r=function(t){var e=t.getBoundingClientRect(),n=document.documentElement,o=window;return{top:e.top+o.pageYOffset-n.clientTop,left:e.left+o.pageXOffset-n.clientLeft}},s=function(t,e,n){var o=function t(o){o.target.removeEventListener(e,t),n()};t.addEventListener(e,o)};e.windowWidth=o,e.windowHeight=i,e.elemOffset=r,e.once=s},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.zoom=void 0;var o=n(3),i=n(0),r=null,s=-1,a=-1,c=function(t){t.addEventListener("click",u)},u=function(t){if(!document.body.classList.contains("zoom-overlay-open"))return t.metaKey||t.ctrlKey?void window.open(t.target.getAttribute("data-original")||t.target.src,"_blank"):void(t.target.width>=(0,i.windowWidth)()-80||(l(!0),r=new o.ZoomImage(t.target,80),r.zoom(),d()))},l=function(t){null!=r&&(t?r.dispose():r.close(),m(),r=null)},d=function(){document.addEventListener("scroll",f),document.addEventListener("keyup",h),document.addEventListener("touchstart",v),document.addEventListener("click",g,!0)},m=function(){document.removeEventListener("scroll",f),document.removeEventListener("keyup",h),document.removeEventListener("touchstart",v),document.removeEventListener("click",g,!0)},f=function(){-1==s&&(s=window.pageYOffset),Math.abs(s-window.pageYOffset)>=40&&l()},h=function(t){27==t.keyCode&&l()},v=function(t){var e=t.touches[0];null!=e&&(a=e.pageY,t.target.addEventListener("touchmove",p))},p=function t(e){var n=e.touches[0];null!=n&&Math.abs(n.pageY-a)>10&&(l(),e.target.removeEventListener("touchmove",t))},g=function(){l()},w=Object.create(null);w.setup=c,e.zoom=w},function(t,e,n){"use strict";var o=n(1);document.addEventListener("DOMContentLoaded",function(){for(var t=document.querySelectorAll("img[data-action='zoom']"),e=0;e<t.length;e++)o.zoom.setup(t[e])})},function(t,e,n){"use strict";function o(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0}),e.ZoomImage=void 0;var i=function(){function t(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}return function(e,n,o){return n&&t(e.prototype,n),o&&t(e,o),e}}(),r=n(0),s=function t(e,n){o(this,t),this.w=e,this.h=n};e.ZoomImage=function(){function t(e,n){o(this,t),this.img=e,this.preservedTransform=e.style.transform,this.wrap=null,this.overlay=null,this.offset=n}return i(t,[{key:"forceRepaint",value:function(){this.img.offsetWidth}},{key:"zoom",value:function(){var t=new s(this.img.naturalWidth,this.img.naturalHeight);this.wrap=document.createElement("div"),this.wrap.classList.add("zoom-img-wrap"),this.img.parentNode.insertBefore(this.wrap,this.img),this.wrap.appendChild(this.img),this.img.classList.add("zoom-img"),this.img.setAttribute("data-action","zoom-out"),this.overlay=document.createElement("div"),this.overlay.classList.add("zoom-overlay"),document.body.appendChild(this.overlay),this.forceRepaint();var e=this.calculateScale(t);this.forceRepaint(),this.animate(e),document.body.classList.add("zoom-overlay-open")}},{key:"calculateScale",value:function(t){var e=t.w/this.img.width,n=(0,r.windowWidth)()-this.offset,o=(0,r.windowHeight)()-this.offset,i=t.w/t.h,s=n/o;return t.w<n&&t.h<o?e:i<s?o/t.h*e:n/t.w*e}},{key:"animate",value:function(t){var e=(0,r.elemOffset)(this.img),n=window.pageYOffset,o=(0,r.windowWidth)()/2,i=n+(0,r.windowHeight)()/2,s=e.left+this.img.width/2,a=e.top+this.img.height/2,c=o-s,u=i-a,l="scale("+t+")",d="translate3d("+c+"px, "+u+"px, 0px)";this.img.style.transform=l,this.wrap.style.transform=d}},{key:"dispose",value:function(){null!=this.wrap&&null!=this.wrap.parentNode&&(this.img.classList.remove("zoom-img"),this.img.setAttribute("data-action","zoom"),this.wrap.parentNode.insertBefore(this.img,this.wrap),this.wrap.parentNode.removeChild(this.wrap),document.body.removeChild(this.overlay),document.body.classList.remove("zoom-overlay-transitioning"))}},{key:"close",value:function(){var t=this;document.body.classList.add("zoom-overlay-transitioning"),this.img.style.transform=this.preservedTransform,0===this.img.style.length&&this.img.removeAttribute("style"),this.wrap.style.transform="none",(0,r.once)(this.img,"transitionend",function(){t.dispose(),document.body.classList.remove("zoom-overlay-open")})}}]),t}()}]);