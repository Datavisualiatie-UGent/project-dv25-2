import * as d3 from "d3";

import { createSelectbox } from "../mapView/selectBox.js";

const DEFAULT_TEXT = "";

export function initSelectBoxContainer(dispatch, questions) {
    // Create a container for the select box and title
    const container = d3.create("div")
        .style("display", "flex")
        .style("position", "relative")
        .style("align-items", "center")
        .style("justify-content", "center")
        .style("flex-direction", "column");

    const selectBox = createSelectbox(questions);
    container.append(() => selectBox.node());

    const title = container.append("div")
        .style("font-size", "35px")
        .style("height", "50px")
        .text("");

    // Add event listener for select box change
    selectBox.on("change", function() {
        const selectedValue = d3.select(this).property("value");
        if (selectedValue) {
            const question = questions.find(q => q.id === selectedValue);
            const titleText = question.title;

            // Update the title text
            title.text(titleText);
            // Dispatch the event with the selected question
            dispatch.call("selectQuestion", this, selectedValue);
            return;
        }
        title.text(DEFAULT_TEXT);
        dispatch.call("selectQuestion", this, null);
    });

    return container;
}

