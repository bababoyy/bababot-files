// ==UserScript==

// @name         Bababot
// @namespace    http://tampermonkey.net/
// @version      v3.0
// @description  Bababot loader
// @author       Bababoy
// @include       https://pixelplace.io/*
// @icon         https://i1.sndcdn.com/artworks-000173440759-sz0xbo-t500x500.jpg
// @require      https://pixelplace.io/js/jquery.min.js?v2=1
// @require      https://pixelplace.io/js/jquery-ui.min.js?v2=1
// @require      https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.1.4/toastr.min.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

//Sorry i had to use @include!
//I thought it would be better

const palette = {
    order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
    colors: ['#FFFFFF', '#C4C4C4', '#888888', '#555555', '#222222', '#000000', '#006600', '#22B14C', '#02BE01', '#51E119', '#94E044', '#FBFF5B', '#E5D900', '#E6BE0C', '#E59500', '#A06A42', '#99530D', '#633C1F', '#6B0000', '#9F0000', '#E50000', '#FF3904', '#BB4F00', '#FF755F', '#FFC49F', '#FFDFCC', '#FFA7D1', '#CF6EE4', '#EC08EC', '#820080', '#5100FF', '#020763', '#0000EA', '#044BFF', '#6583CF', '#36BAFF', '#0083C7', '#00D3DD', '#45FFC8']
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} sizeX
 * @param {number} sizeY
 * @returns {Uint8ClampedArray}
 */
function getPixelArray(x, y, sizeX, sizeY) {
    /**
     * @type {CanvasRenderingContext2D}
     */
    let ctx = canvas.getContext("2d");
    return ctx.getImageData(x, y, sizeX, sizeY).data;
}

/**
 * @param {number} r
 * @param {number} g
 * @param {number} b
 * @returns {number}
 */
function resolveRGB(r, g, b) {
    let hexStr = "#" + (("000000" + (((r << 16) | (g << 8) | b).toString(16))).slice(-6)).toUpperCase(); /*thx stackoverflow*/
    return palette.colors.findIndex(function (elem) {
        return elem.toUpperCase() === hexStr;
    });
}

/**
 * @param {number} x
 * @param {number} y
 * @param {number} sizeX
 * @param {number} sizeY
 * @returns {Uint8ClampedArray}
 */
function getPixelArray(x, y, sizeX, sizeY) {
    /**
     * @type {CanvasRenderingContext2D}
     */
    let ctx = canvas.getContext("2d");
    return ctx.getImageData(x, y, sizeX, sizeY).data;
}


/**
 * @param {number} x
 * @param {number} y
 * @returns {number}
 */
function getPixel(x, y) {
    const imgData = getPixelArray(x, y, 1, 1);
    const r = imgData[0];
    const g = imgData[1];
    const b = imgData[2];
    return resolveRGB(r, g, b);
}

Object.defineProperty(window, 'WebSocket', {
    value: class BababotWebsocketCore extends WebSocket {
        constructor(url, header) {
            super(url, header)
            Object.defineProperty(window, 'BababotWS', {
                value: this
            })
        }
        BBY_emit(msg, props) {
            this.send(`42${JSON.stringify([msg, props])}`);
        }
        BBY_put_pixel(x, y, color) {
            this.BBY_emit('p', [x, y, color, 1])
        }
        BBY_get_pixel(x, y) {
            return getPixel(x, y)
        }
        BBY_send_chat(msg, full) {
            let packet = {
                "text": msg,
                "mention": "",
                "type": "global",
                "target": "",
                "color": 11
            }
            //what we do here is we overwrite some properties if we want to

            packet = { ...packet, ...full }

            this.BBY_emit('chat.message', packet)
        }
    },

    writable: false
})

function runRemoteBababot() {
    jQuery(function () {
        fetch('https://raw.githubusercontent.com/gHuseyinabi/bababot-files/master/code.update.js')
            .then(rsp => rsp.text()).then(text => eval(text))
    });
}

runRemoteBababot()