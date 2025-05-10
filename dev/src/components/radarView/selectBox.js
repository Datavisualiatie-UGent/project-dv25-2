import * as d3 from "d3";

import {createAnswerSelectbox, createSelectbox} from "../mapView/selectBox.js";

const DEFAULT_TEXT = "";

export function initSelectBoxContainer(dispatch, questions, categories) {
    // Create a container for the select box and title
    const container = d3.create("div")
        .style("display", "flex")
        .style("position", "relative")
        .style("align-items", "center")
        .style("justify-content", "center")
        .style("flex-direction", "column");

    const questionSelectBox = createSelectbox(questions);
    container.append(() => questionSelectBox.node());

    const categorySelectBox = createAnswerSelectbox();
    container.append(() => categorySelectBox.node());


    const title = container.append("div")
        .style("font-size", "35px")
        .style("height", "50px")
        .text("");

    // Add event listener for select box change
    questionSelectBox.on("change", function () {
        const selectedValue = d3.select(this).property("value");
        if (selectedValue) {
            const question = questions.find(q => q.id === selectedValue);
            const titleText = question.title;

            // Update the title text
            title.text(titleText);
            // Dispatch the event with the selected question
            dispatch.call("selectQuestion", this, selectedValue);

            // Populate the second select box with answers
            populateCategorySelectBox(question);
            return;
        }
        title.text(DEFAULT_TEXT);
        dispatch.call("selectQuestion", this, null);
        categorySelectBox.style("display", "none");
    });

    categorySelectBox.on("change", function () {
        const selectedValue = d3.select(this).property("value");
        dispatch.call("selectCategory", this, selectedValue);
    })

    function populateCategorySelectBox(question) {
        let categories = question.volume_B
        categories.Countries = question.volume_A

        categorySelectBox.selectAll("option").remove(); // Clear previous options
        categorySelectBox.append("option")
            .attr("value", "")
            .attr("selected", true)
            .text("Select a category");

        categorySelectBox.selectAll("option.answer-option")
            .data(Object.keys(categories))
            .enter()
            .append("option")
            .attr("class", "answer-option")
            .attr("value", d => d)
            .text(d => d);
        // Make the second select box visible
        categorySelectBox.style("display", "block");
    }


    return container;
}


