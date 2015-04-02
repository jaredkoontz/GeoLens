/**
 * a very simple file used for housing the global variables used by various functions.
 */

var geolensData; // the current data
var currentDepth; // lowest histogram level
var lowestDepth = 2; //lowest depth of the json array. todo dont hardcode: send over or compute?
var currentFeature; //current selected feature.
var currentPath = ""; //current select path for visualization