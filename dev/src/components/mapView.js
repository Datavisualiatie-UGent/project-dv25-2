import * as d3 from "d3";

import { createMap } from "./map.js";
import { createDashboard } from "./dashboard.js";

export function renderMapView(svgContent) {
    // Dispatching
    const dispatch = d3.dispatch("openDashboard", "closeDashboard");

    // Create main container
    const container = d3.select("body")
        .append("div")
        .style("position", "relative")
        .style("width", "100%")
        .style("height", "100vh")
        .style("overflow", "hidden");

    // Create map container
    const mapContainer = container.append("div")
        .style("width", "100%")
        .style("height", "100%");

    mapContainer.html(svgContent);
    const svg = mapContainer.select("svg")
        .style("width", "100%")
        .style("height", "100%");

    // Create dashboard
    const dashboard = createDashboard(dispatch);
    container.append(() => dashboard.node());

    // Initialize map with dashboard control
    createMap(svg, dispatch);

    return container.node();
}