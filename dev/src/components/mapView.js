import * as d3 from "d3";

import { initMapContainer } from "./map.js";
import { initDashboard } from "./dashboard.js";
import { initSelectBoxContainer } from "./selectBox.js";
import { initLegend } from "./legend.js";

export function renderMapView(svgContent, questions, eu_countries) {

    // Dispatching
    const dispatch = d3.dispatch("openDashboard", "closeDashboard", "selectQuestion");

    const eu = new Set(Object.keys(eu_countries));


    const container = d3.create("div")
        .style("width", "100%")
        .style("height", "100%")
        .style("margin-top", "20px")
        .style("overflow", "hidden")
        .style("display", "flex") // Use flexbox for layout
        .style("flex-direction", "column") // Stack items vertically
        .style("gap", "20px"); // Add spacing between child elements

    // create selectBox
    const selectBoxContainer = initSelectBoxContainer(dispatch, questions);
    container.append(() => selectBoxContainer.node());

    // Create map view container
    const mapViewContainer = d3.create("div")
        .style("position", "relative")
        .style("width", "100%")
        .style("height", "80vh")
        .style("overflow", "hidden");

    // Create map container
    const mapContainer = initMapContainer(svgContent, dispatch, questions, eu);
    mapViewContainer.append(() => mapContainer.node());

    // Create dashboard
    const dashboard = initDashboard(dispatch, eu_countries, questions);
    mapViewContainer.append(() => dashboard.node());

    container.append(() => mapViewContainer.node());

    // Create legend
    const legendContainer = initLegend(dispatch, questions);
    container.append(() => legendContainer.node());

    return container.node();
}