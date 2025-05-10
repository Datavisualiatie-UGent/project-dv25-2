import * as d3 from "d3";

import { initSelectBoxContainer } from "./selectBox.js";
import { createBarChart } from "./barChart.js";
import { initLegend } from "./legend.js";
import { initResetButton} from "./resetButton.js";

export function renderBarView(questions, eu_countries, flags) {

    const dispatch = d3.dispatch("selectQuestion", "selectBar", "resetBarView");

    const container = d3.create("div")

    const selectBoxContainer = initSelectBoxContainer(dispatch, questions);
    container.append(() => selectBoxContainer.node());


    const chartContainer = d3.create("div")
        .attr("class", "chart-container")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("position", "relative")
        .style("align-items", "center")
        .style("flex-direction", "column")
        .style("border", "3px white solid")
        .style("border-radius", "10px")
        .style("top", "20px")
        .style("width", "99%")
        .style("height", "80vh")
        .style("background", "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)")
        .style("transition", "all 0.5s ease")
    container.append(() => chartContainer.node());

    // Add event listener for select box change
    dispatch.on("selectQuestion", (questionId) => {
        // reset the container
        chartContainer.selectAll("svg").remove();
        container.selectAll(".legend").remove();
        container.selectAll(".reset-button").remove();


        const question = questions.find(q => q.id === questionId);
        if (question) {
            initBarchartContainer(container, dispatch, question, eu_countries, flags);
        }
    });

    return container.node();
}

function initBarchartContainer(container, dispatch, question, eu_countries, flags) {
    const chartContainer = container.select(".chart-container");
    const barChart = createBarChart(dispatch, question, eu_countries, flags);
    chartContainer.append(() => barChart.node());

    const legendContainer = initLegend(question);
    container.append(() => legendContainer.node());

    const resetButton = initResetButton(dispatch);
    container.append(() => resetButton.node());
}

