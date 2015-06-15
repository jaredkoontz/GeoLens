<?php


$wantedJson = $_GET["json"];
$path = getCorrectPath($wantedJson);

echo '<script>' . 'setDataAndVisualize("' . $path . '")' . '</script>';


function getCorrectPath($wantedJson)
{
    $directory = "sample_outputs/";
    if ($wantedJson == "noco")
        $directory .= "outputNoCo.json";
    else if ($wantedJson == "wyco")
        $directory .= "output3char.json";
    else if ($wantedJson == "ushalf")
        $directory .= "outputUS.json";
    else if ($wantedJson == "2k")
        $directory .= "2kWyco.json";
    else if ($wantedJson == "2kw")
        $directory .= "2kWycoWrong.json";
    else if ($wantedJson == "1m")
        $directory .= "1month.json";

    else return "";

    return $directory;
}