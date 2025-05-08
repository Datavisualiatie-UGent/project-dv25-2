import * as d3 from "d3";

import { initMapContainer } from "./map.js";
import { initDashboard } from "./dashboard.js";
import { initSelectBox } from "./selectBox.js";
import { initLegend } from "./legend.js";

export function renderMapView(svgContent, questions) {

    // Dispatching
    const dispatch = d3.dispatch("openDashboard", "closeDashboard", "selectQuestion");

    // Create a color scale for the legend and map
    const colorScale = d3.scaleOrdinal()
        .range(d3.schemeTableau10); // Using a built-in color scheme

    // create selectBox
    const container = d3.create("div")
        .style("width", "100%")
        .style("height", "100%")
        .style("overflow", "hidden");

    const selectBox = initSelectBox(dispatch, questions);
    container.append(() => selectBox.node());

    // Create map view container
    const mapViewContainer = d3.create("div")
        .style("position", "relative")
        .style("width", "100%")
        .style("height", "100vh")
        .style("overflow", "hidden");

    // Create map container
    const mapContainer = initMapContainer(svgContent, dispatch, questions, colorScale);
    mapViewContainer.append(() => mapContainer.node());

    // Create dashboard
    const dashboard = initDashboard(dispatch);
    mapViewContainer.append(() => dashboard.node());

    container.append(() => mapViewContainer.node());

    // Create legend
    const legendContainer = initLegend(dispatch, questions, colorScale);
    container.append(() => legendContainer.node());

    return container.node();
}