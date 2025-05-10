import * as d3 from "d3";
import {createBubbleChart} from "./bubbleChart.js";
import {initSelectBoxContainer} from "../barView/selectBox.js";

export function renderBubbleView(questions) {
    const dispatch = d3.dispatch("selectQuestion");

    // Create SVG container
    const container = d3.create("div")
        .style("height", "100%")
        .style("width", "100%")

    const selectBoxContainer = initSelectBoxContainer(dispatch, questions);
    container.append(() => selectBoxContainer.node());

    // Add event listener for select box change
    dispatch.on("selectQuestion", (questionId) => {
        // reset the container
        container.selectAll("svg").remove();
        container.selectAll(".legend").remove();

        const question = questions.find(q => q.id === questionId);
        if (question) {
            const bubbleChart = createBubbleChart(question, "BE");
            container.append(() => bubbleChart.node());
        }
    });

    return container.node();
}