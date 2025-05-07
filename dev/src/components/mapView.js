import * as d3 from "d3";

import { initMapContainer } from "./map.js";
import { initDashboard } from "./dashboard.js";

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
    const mapContainer = initMapContainer(svgContent, dispatch);
    container.append(() => mapContainer.node());

    // Create dashboard
    const dashboard = initDashboard(dispatch);
    container.append(() => dashboard.node());


    return container.node();
}