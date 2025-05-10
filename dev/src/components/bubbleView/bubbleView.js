import * as d3 from "d3";
import {createBubbleChart} from "./bubbleChart.js";

export function renderBubbleView() {

    // Create SVG container
    const container = d3.create("div")
        .style("height", "100%")
        .style("width", "100%")


    const bubbleChart = createBubbleChart();
    container.append(() => bubbleChart.node());


    return container.node();
}