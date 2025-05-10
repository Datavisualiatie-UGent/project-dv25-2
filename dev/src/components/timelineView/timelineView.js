import * as d3 from "d3";

import { initSelectBoxContainer } from "./selectBox.js";
import { createTimelineChart } from "./timelineChart.js";
import { initResetButton } from "./resetButton.js";
import { initLegend } from "./legend.js";

const DEFAULT_COUNTRY = "BE";

export function renderTimelineView(questions, flags, eu_countries) {

    const dispatch = d3.dispatch("selectQuestion", "selectBar", "resetBarView", "selectAnswer");

    const container = d3.create("div");

    const selectBoxContainer = initSelectBoxContainer(dispatch, questions, DEFAULT_COUNTRY, eu_countries);
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
        .style("transition", "all 0.5s ease");
    container.append(() => chartContainer.node());

    let selectedQuestion = questions[0];
    let selectedAnswer = DEFAULT_COUNTRY;

    function initTimelinechartContainer(question, answer, flags) {
        const timelineChart = createTimelineChart(container, dispatch, question, answer, flags);

        chartContainer.append(() => timelineChart.node());

        const legendContainer = initLegend(question);
        container.append(() => legendContainer.node());

        const resetButton = initResetButton(dispatch);
        container.append(() => resetButton.node());
    }

    // Add event listener for select box change
    dispatch.on("selectQuestion", (questionId) => {
        // reset the container
        chartContainer.selectAll("svg").remove();
        container.selectAll(".legend").remove();
        container.selectAll(".reset-button").remove();


        selectedQuestion = questions.find(q => q.id === questionId);
        selectedAnswer = DEFAULT_COUNTRY; // Reset selected answer when question changes
        if (selectedQuestion) {
            initTimelinechartContainer(selectedQuestion, selectedAnswer, flags);
        }
    });

    dispatch.on("selectAnswer", (answer) => {
        // reset thr contairer
        chartContainer.selectAll("svg").remove();
        container.selectAll(".legend").remove();
        container.selectAll(".reset-button").remove();

        selectedAnswer = answer;
        if (selectedQuestion) {
            initTimelinechartContainer(selectedQuestion, selectedAnswer, flags);
        }
    });

    initTimelinechartContainer(selectedQuestion, selectedAnswer, flags);

    return container.node();
}


