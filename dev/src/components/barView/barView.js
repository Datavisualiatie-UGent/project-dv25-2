import * as d3 from "d3";

import { initSelectBoxContainer } from "./selectBox.js";
import { createBarChart } from "./barChart.js";
import { initLegend } from "./legend.js";

export function renderBarView(questions, flags) {

    const dispatch = d3.dispatch("selectQuestion");

    const container = d3.create("div");

    const selectBoxContainer = initSelectBoxContainer(dispatch, questions);
    container.append(() => selectBoxContainer.node());

    // Add event listener for select box change
    dispatch.on("selectQuestion", (questionId) => {
        // reset the container
        container.selectAll("svg").remove();
        container.selectAll(".legend").remove();


        const question = questions.find(q => q.id === questionId);
        if (question) {
            const barChart = createBarChart(question, flags);
            container.append(() => barChart.node());
            const legendContainer = initLegend(question);
            container.append(() => legendContainer.node());
        }
    });

    //const barChart = createBarChart(dispatch, questions, flags);
    //container.append(() => barChart.node());

    //const legendContainer = initLegend(dispatch, question);
    //container.append(() => legendContainer.node());

    return container.node();
}

