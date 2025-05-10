import * as d3 from "d3";

import { createSelectbox, createAnswerSelectbox } from "../mapView/selectBox.js";

const DEFAULT_TEXT = "";

export function initSelectBoxContainer(dispatch, questions, eu_countries) {
    const excluded = ["EU27", "D-E", "D-W"];
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

    const answerSelectBox = createAnswerSelectbox();
    container.append(() => answerSelectBox.node());

    function populateAnswerSelectBox(question) {
        const data = Object.keys(question.volume_A).filter(d => !excluded.includes(d));

        answerSelectBox.selectAll("option").remove(); // Clear previous options
        answerSelectBox.append("option")
            .attr("value", "")
            .attr("selected", true)
            .text("Select a country");

        answerSelectBox.selectAll("option.answer-option")
            .data(data)
            .enter()
            .append("option")
            .attr("class", "answer-option")
            .attr("value", d => d)
            .text(d => eu_countries[d].name);
        // Make the second select box visible
        answerSelectBox.style("display", "block");
    }

    // Add event listener for select box change
    selectBox.on("change", function() {
        const selectedValue = d3.select(this).property("value");
        console.log(selectedValue);
        if (selectedValue) {
            const question = questions.find(q => q.id === selectedValue);
            const titleText = question.title;

            // Update the title text
            title.text(titleText);
            // Dispatch the event with the selected question
            dispatch.call("selectQuestion", this, selectedValue);

            // Populate the second select box with answers
            populateAnswerSelectBox(question);
            return;
        }
        title.text(DEFAULT_TEXT);
        dispatch.call("selectQuestion", this, null);
        answerSelectBox.style("display", "none");
    });

    answerSelectBox.on("change", function() {
        const selectedValue = d3.select(this).property("value");
        dispatch.call("selectAnswer", this, selectedValue);
    })

    return container;
}


