var tour = new Tour();
tour.addSteps([
    {
        element: "#header",
        title: "Nanocubes",
        content: "Welcome! This is a quick tour over the features in this demo.",
        placement: "bottom"
    },
    {
        element: "#webgl",
        title: "Zooming",
        content: "To zoom in to or out of a specific piece of the map, scroll vertically as you would browse a webpage. (You can also hold the shift button and drag with the left mouse button, or double-click to zoom in)",
        placement: "top"
    },
    {
        element: "#dragging-mode",
        title: "Dragging Mode",
        content: "To pan around the map, click Pan and drag the map with your mouse. To select a geographical region, click Select and drag a rectangle: you will see the total count change to reflect the size of your selection. You can also always drag a rectangle with your right mouse button (Mac users can, albeit clumsily, do this with a two-button drag).",
        placement: "left"
    },
    {
        element: "#heatmap-resolution",
        title: "Heatmap Resolution",
        content: "To change the resolution of the heatmap pixels, click 'Coarser' or 'Finer' (you can use your keyboard too, with K and L).",
        placement: "left"
    },
    {
        element: "#colormap",
        title: "Colormap",
        content: "To make the colormap brighter or fainter, click 'Brighter' or 'Fainter' (you can use your keyboard too, with ',' and '.', or '<' and '>').",
        placement: "left"
    },
    {
        element: "#vis-panes",
        title: "These plots are interactive",
        content: "You can interact with the histograms by clicking on the bars to restrict the selection on the other plots; if you hold shift, control, or command, you can select a set of categories. You can zoom in and out of the time-series view by clicking on the zoom buttons. To restrict the plots to a particular time range, drag the time series axis. To pan the time series, drag the time series itself. As your selections change, the other plots will update to reflect the new query.",
        placement: "left"
    },
    {
        element: "#more",
        title: "More information?",
        content: "If you want more information, click on 'About this demo', and if need the tour to start over, you can click on 'Help' at any time.",
        placement: "bottom"
    },
    {
        element: "#webgl",
        title: "That's it",
        content: "Have fun! We'd love to hear from you; let us know if you have any comments or run into problems.",
        placement: "top"
    }
]);
