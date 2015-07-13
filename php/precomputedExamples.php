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

    else if ($wantedJson == "1")
        $directory .= "mulres/"."1.json";
    else if ($wantedJson == "2")
        $directory .= "mulres/"."2.json";
    else if ($wantedJson == "3")
        $directory .= "mulres/"."3.json";
    else if ($wantedJson == "4")
        $directory .= "mulres/"."4.json";
    else if ($wantedJson == "5")
        $directory .= "mulres/"."5.json";


    else return "";

    return $directory;
}