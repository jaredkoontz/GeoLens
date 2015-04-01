/**
 *
 */
function getGeohashRectByIdAndChangeColor(id, hexColor) {
    d3.select("#map")
        .select("svg")
        .selectAll("rect")
        .filter(function (d) {
            return d.id == id
        })
        .style("fill", hexColor);
}

/**
 *
 */
function getColor(value) {
    return multiYellowToRedBrewer(value);
    //return multiHue(value);
}

/**
 *
 */
function multiYellowToRedBrewer(value) {
    var r = 0.0, g = 0.0, b = 0.0;
    if (0 <= value && value <= 1.0 / 9.0) {
        r = 255;
        g = 255;
        b = 204;
    } else if (1.0 / 9.0 < value && value <= 2.0 / 9.0) {
        r = 255;
        g = 237;
        b = 160;
    } else if (2.0 / 9.0 < value && value <= 3.0 / 9.0) {
        r = 254;
        g = 217;
        b = 118;
    } else if (3.0 / 9.0 < value && value <= 4.0 / 9.0) {
        r = 254;
        g = 178;
        b = 76;
    } else if (4.0 / 9.0 < value && value <= 5.0 / 9.0) {
        r = 253;
        g = 141;
        b = 60;
    } else if (5.0 / 9.0 < value && value <= 6.0 / 9.0) {
        r = 252;
        g = 78;
        b = 42;
    } else if (6.0 / 9.0 < value && value <= 7.0 / 9.0) {
        r = 227;
        g = 26;
        b = 28;
    } else if (7.0 / 9.0 < value && value <= 8.0 / 9.0) {
        r = 189;
        g = 0;
        b = 38;
    } else if (8.0 / 9.0 < value && value <= 9.0 / 9.0) {
        r = 128;
        g = 0;
        b = 38;
    }
    return rgbToHex(r, g, b);
}


/**
 *
 */
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
    return rgbToHex(Math.round(r), Math.round(g), Math.round(b));

}

/**
 *
 */
function singleHue(value) {
    var red = Math.round((value * 255));
    rgbToHex(30, 30, red);
}

/**
 *
 */
function singleGreenBrewer(value) {
    var r = 0.0, g = 0.0, b = 0.0;
    if (0 <= value && value <= 1.0 / 9.0) {

        r = 247;
        g = 252;
        b = 245;

    } else if (1.0 / 9.0 < value && value <= 2.0 / 9.0) {
        r = 229;
        g = 245;
        b = 224;

    } else if (2.0 / 9.0 < value && value <= 3.0 / 9.0) {
        r = 199;
        g = 233;
        b = 192;

    } else if (3.0 / 9.0 < value && value <= 4.0 / 9.0) {
        r = 161;
        g = 217;
        b = 155;

    } else if (4.0 / 9.0 < value && value <= 5.0 / 9.0) {
        r = 116;
        g = 196;
        b = 118;

    } else if (5.0 / 9.0 < value && value <= 6.0 / 9.0) {
        r = 65;
        g = 171;
        b = 93;

    } else if (6.0 / 9.0 < value && value <= 7.0 / 9.0) {
        r = 35;
        g = 139;
        b = 69;

    } else if (7.0 / 9.0 < value && value <= 8.0 / 9.0) {
        r = 0;
        g = 109;
        b = 44;

    } else if (8.0 / 9.0 < value && value <= 9.0 / 9.0) {
        r = 0;
        g = 68;
        b = 27;
    }
    return rgbToHex(r, g, b);
}


/**
 *
 */
function singleBurntBrewer(value) {
    var r = 0.0, g = 0.0, b = 0.0;
    if (0 <= value && value <= 1.0 / 9.0) {
        r = 255;
        g = 245;
        b = 235;
    } else if (1.0 / 9.0 < value && value <= 2.0 / 9.0) {
        r = 254;
        g = 230;
        b = 206;
    } else if (2.0 / 9.0 < value && value <= 3.0 / 9.0) {
        r = 253;
        g = 208;
        b = 162;
    } else if (3.0 / 9.0 < value && value <= 4.0 / 9.0) {
        r = 253;
        g = 174;
        b = 107;
    } else if (4.0 / 9.0 < value && value <= 5.0 / 9.0) {
        r = 253;
        g = 141;
        b = 60;
    } else if (5.0 / 9.0 < value && value <= 6.0 / 9.0) {
        r = 241;
        g = 105;
        b = 19;
    } else if (6.0 / 9.0 < value && value <= 7.0 / 9.0) {
        r = 217;
        g = 72;
        b = 1;
    } else if (7.0 / 9.0 < value && value <= 8.0 / 9.0) {
        r = 166;
        g = 54;
        b = 3;
    } else if (8.0 / 9.0 < value && value <= 9.0 / 9.0) {
        r = 127;
        g = 39;
        b = 4;
    }
    return rgbToHex(r, g, b);
}


/**
 * 5 possible colors.
 * need to expand pallet because bars will have more than 5 colors.
 * Max number of colors?
 * 32? -> might be too many but seems hard upper limit.
 * 16? -> might be perfect or just too few
 * 64? -> too many
 */
function singlePurpleBrewerValues(value) {
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
    return rgbToHex(r, g, b);
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