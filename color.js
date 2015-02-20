function multiHue(value) {
    var r = 0.0, g = 0.0, b = 0.0;

    if (0 <= value && value <= 1.0 / 8.0) {
        r = 0;
        g = 0;
        b = 4 * value + .5; // .5 - 1 // b = 1/2
    } else if (1.0 / 8.0 < value && value <= 3.0 / 8.0) {
        r = 0;
        g = 4 * value - .5; // 0 - 1 // b = - 1/2
        b = 1; // small fix
    } else if (3.0 / 8.0 < value && value <= 5.0 / 8.0) {
        r = 4 * value - 1.5; // 0 - 1 // b = - 3/2
        g = 1;
        b = -4 * value + 2.5; // 1 - 0 // b = 5/2
    } else if (5.0 / 8.0 < value && value <= 7.0 / 8.0) {
        r = 1;
        g = -4 * value + 3.5; // 1 - 0 // b = 7/2
        b = 0;
    } else if (7.0 / 8.0 < value && value <= 1.0) {
        r = -4 * value + 4.5; // 1 - .5 // b = 9/2
        g = 0;
        b = 0;
    } else {    // should never happen - value > 1
        r = .5;
        g = 0;
        b = 0;
    }

    // scale for hex conversion
    r *= 255;
    g *= 255;
    b *= 255;
    return rgbToHex(Math.round(r),Math.round(g),Math.round(b));

}

function singleHue(value) {
    var red = Math.round((value*255));
    rgbToHex(30, 30, red);
}

function singleHueBrewerValues(value) {
    var r = 0.0, g = 0.0, b = 0.0;

    if (0 <= value && value <= 1.0 / 8.0) {
        r = 242;
        g = 240;
        b = 247;
    } else if (1.0 / 8.0 < value && value <= 3.0 / 8.0) {
        r = 188;
        g = 189;
        b = 220;
    } else if (3.0 / 8.0 < value && value <= 5.0 / 8.0) {
        r = 158;
        g = 154;
        b = 200;
    } else if (5.0 / 8.0 < value && value <= 7.0 / 8.0) {
        r = 117;
        g = 107;
        b = 177;
    } else if (7.0 / 8.0 < value && value <= 1.0) {
        r = 84;
        g = 39;
        b = 143;
    } else {    // should never happen - value > 1
        r = 84;
        g = 39;
        b = 143;
    }
    return rgbToHex(r,g,b);
}

/**
 *http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 */
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

/**
 *http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
 */
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}