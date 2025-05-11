import * as d3 from "../../../_node/d3@7.9.0/index.6063bdcc.js";

import { createAnswerSelectbox } from "../mapView/selectBox.788b6efd.js";

const DEFAULT_TEXT = "";

export function initSelectBoxContainer(dispatch, questions, defaultCountry, eu_countries) {
    const excluded = ["EU27", "D-E", "D-W"];
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
        .text(questions[0].title || DEFAULT_TEXT);

    const answerSelectBox = createAnswerSelectbox();
    container.append(() => answerSelectBox.node());

    function populateAnswerSelectBox(question) {
        const data = Object.keys(question.volume_A).filter(d => !excluded.includes(d));

        answerSelectBox.selectAll("option").remove(); // Clear previous options


        answerSelectBox.selectAll("option.answer-option")
            .data(data)
            .enter()
            .append("option")
            .attr("class", "answer-option")
            .attr("value", d => d)
            .attr("selected", d => d === defaultCountry ? true : null) // Set default country
            .text(d => eu_countries[d].name);
        answerSelectBox.style("display", "block");
    }

    // Populate the answer select box with the default question
    populateAnswerSelectBox(questions[0]);

    // Add event listener for select box change
    selectBox.on("change", function () {
        const selectedValue = d3.select(this).property("value");
        if (selectedValue) {
            const question = questions.find(q => q.id === selectedValue);
            const titleText = question.title;

            title.text(titleText);
            dispatch.call("selectQuestion", this, selectedValue);

            populateAnswerSelectBox(question);
            return;
        }
        title.text(DEFAULT_TEXT);
        dispatch.call("selectQuestion", this, null);
        answerSelectBox.style("display", "none");
    });

    answerSelectBox.on("change", function () {
        const selectedValue = d3.select(this).property("value");
        dispatch.call("selectAnswer", this, selectedValue);
    });

    return container;
}

function createSelectbox(questions) {
    const selectBox = d3.create("select")
        .style("position", "absolute")
        .style("top", "100px")
        .style("left", "20px")
        .style("padding", "10px")
        .style("width", "300px")
        .style("z-index", "10");

    // Add options to the selection box
    selectBox.selectAll("option.question-option")
        .data(questions)
        .enter()
        .append("option")
        .attr("selected", d => d.id === questions[0].id ? true : null)
        .attr("class", "question-option")
        .attr("value", d => d.id)
        .text(d => d.title || `Question ${d.id}`);

    return selectBox;
}


