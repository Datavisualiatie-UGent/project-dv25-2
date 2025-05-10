import * as d3 from "d3";
import {createBubbleChart} from "./bubbleChart.js";
import {initSelectBoxContainer} from "./selectBox.js";

export function renderBubbleView(questions) {
    const dispatch = d3.dispatch("selectQuestion", "selectAnswer");

    let selectedQuestion = null;
    let selectedAnswer = null;

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

        selectedQuestion = questions.find(q => q.id === questionId);
        selectedAnswer = null; // Reset selected answer when question changes
    });

    dispatch.on("selectAnswer", (answer) => {
        // reset the container
        container.selectAll("svg").remove();
        container.selectAll(".legend").remove();

        selectedAnswer = answer;
        if (selectedQuestion) {
            const bubbleChart = createBubbleChart(selectedQuestion, selectedAnswer);
            container.append(() => bubbleChart.node());
        }
    })

    return container.node();
}