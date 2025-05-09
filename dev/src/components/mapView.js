import * as d3 from "d3";

import { initMapContainer } from "./map.js";
import { initDashboard } from "./dashboard.js";
import { initSelectBoxContainer } from "./selectBox.js";
import { initLegend } from "./legend.js";

export function renderMapView(svgContent, questions, eu_countries) {

    // Dispatching
    const dispatch = d3.dispatch("openDashboard", "closeDashboard", "selectQuestion");

    const eu = new Set(Object.keys(eu_countries));

    // Create a color scale for the legend and map
    const color = {
        "categorical": d3.scaleOrdinal([
            "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe",
            "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000", "#aaffc3", "#808000", "#ffd8b1", "#000075", "#808080",
            "#ffffff", "#000000"
        ]),
        "numerical": d3.scaleSequential(d3.interpolateBlues)
    };

    function hashKey(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash << 5) - hash + key.charCodeAt(i);
            hash |= 0; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

// Assign colors dynamically based on keys
    function getColor(key) {
        const index = hashKey(key) % color.range().length;
        return color.range()[index];
    }


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
    const dashboard = initDashboard(dispatch, eu_countries, questions, color["categorical"]);
    mapViewContainer.append(() => dashboard.node());

    container.append(() => mapViewContainer.node());

    // Create legend
    const legendContainer = initLegend(dispatch, questions, color);
    container.append(() => legendContainer.node());

    return container.node();
}