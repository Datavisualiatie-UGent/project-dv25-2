import * as d3 from "../../../_node/d3@7.9.0/index.6063bdcc.js";

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
        .text(questions[0].title || DEFAULT_TEXT);

    const answerSelectBox = createAnswerSelectbox();
    container.append(() => answerSelectBox.node());

    function populateAnswerSelectBox(question, ) {
        const data = Object.keys(question.volume_A).filter(d => !excluded.includes(d));

        answerSelectBox.selectAll("option").remove(); // Clear previous options

        answerSelectBox.selectAll("option.answer-option")
            .data(data)
            .enter()
            .append("option")
            .attr("class", "answer-option")
            .attr("selected", d => d === "BE" ? true : null)
            .attr("value", d => d)
            .text(d => eu_countries[d].name);
        // Make the second select box visible
        answerSelectBox.style("display", "block");
    }

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

    populateAnswerSelectBox(questions[0]);

    return container;
}

function createAnswerSelectbox() {
    const answerSelectBox = d3.create("select")
        .style("position", "absolute")
        .style("top", "150px")
        .style("left", "20px")
        .style("padding", "10px")
        .style("width", "200px")
        .style("z-index", "10")

    return answerSelectBox;
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


