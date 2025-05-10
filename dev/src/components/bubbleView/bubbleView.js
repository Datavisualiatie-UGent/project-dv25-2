import * as d3 from "d3";
import {createBubbleChart} from "./bubbleChart.js";
import {initSelectBoxContainer} from "../selectBox.js";

export function renderBubbleView(questions) {
    const dispatch = d3.dispatch("selectQuestion");

    // Create SVG container
    const container = d3.create("div")
        .style("height", "100%")
        .style("width", "100%")

    const selectBoxContainer = initSelectBoxContainer(dispatch, questions);
    container.append(() => selectBoxContainer.node());

    const bubbleChart = createBubbleChart();
    container.append(() => bubbleChart.node());

    return container.node();
}