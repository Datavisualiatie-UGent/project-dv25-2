import * as d3 from "d3";
import {createBubbleChart} from "./bubbleChart.js";
import {initSelectBoxContainer} from "./selectBox.js";

const DEFAULT_COUNTRY = "BE";

export function renderBubbleView(questions, eu_countries) {
    const dispatch = d3.dispatch("selectQuestion", "selectAnswer");

    let selectedQuestion = questions[0];
    let selectedAnswer = DEFAULT_COUNTRY;

    // Create SVG container
    const container = d3.create("div")

    const selectBoxContainer = initSelectBoxContainer(dispatch, questions, eu_countries);
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

        selectedQuestion = questions.find(q => q.id === questionId);
        selectedAnswer = DEFAULT_COUNTRY; // Reset selected answer when question changes
        if (selectedQuestion) {
            initBubbleChartContainer(container, selectedQuestion, selectedAnswer);
        }
    });

    dispatch.on("selectAnswer", (answer) => {
        // reset the container
        container.selectAll("svg").remove();
        container.selectAll(".legend").remove();

        selectedAnswer = answer;
        if (selectedQuestion) {
            initBubbleChartContainer(container, selectedQuestion, selectedAnswer);
        }
    })

    initBubbleChartContainer(container, selectedQuestion, selectedAnswer);

    return container.node();
}

function initBubbleChartContainer(container, question, answer) {
    const chartContainer = container.select(".chart-container");
    const bubbleChart = createBubbleChart(question, answer);
    chartContainer.append(() => bubbleChart.node());
}