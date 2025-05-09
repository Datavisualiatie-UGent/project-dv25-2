import * as d3 from "d3";

export function initSelectBoxContainer(dispatch, questions) {
    // Create a container for the select box and title
    const container = d3.create("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("justify-content", "center")
        .style("flex-direction", "column");

    const selectBox = createSelectbox(questions);
    container.append(() => selectBox.node());

    const title = container.append("div")
        .style("font-size", "35px")
        .style("height", "50px")
        .text(""); // Initially empty

    // Create the second select box (initially hidden)
    const answerSelectBox = d3.create("select")
        .style("position", "absolute")
        .style("top", "200px")
        .style("left", "20px")
        .style("padding", "10px")
        .style("width", "200px")
        .style("z-index", "10")
        .style("display", "none"); // Initially hidden
    container.append(() => answerSelectBox.node());

    function populateAnswerSelectBox(question) {
        // Populate the second select box with answers
        answerSelectBox.selectAll("option").remove(); // Clear previous options
        answerSelectBox.append("option")
            .attr("value", "")
            .attr("selected", true)
            .text("General overview");

        answerSelectBox.selectAll("option.answer-option")
            .data(question.answers)
            .enter()
            .append("option")
            .attr("class", "answer-option")
            .attr("value", d => d)
            .text(d => d);

        // Make the second select box visible
        answerSelectBox.style("display", "block");
    }

    // Add event listener for selection change
    selectBox.on("change", function() {
        const selectedValue = d3.select(this).property("value");
        const question= questions.find(q => q.id === selectedValue);
        const titleText = question.title;
        if (selectedValue) {
            const color = d3.scaleOrdinal([
                "#e6194b", "#3cb44b", "#ffe119", "#4363d8",
                "#f58231", "#911eb4", "#b6ffff", "#f032e6",
                "#bcf60c", "#fabebe", "#008080", "#e6beff",
                "#9a6324", "#fffac8", "#800000", "#aaffc3",
                "#808000", "#ffd8b1", "#000075", "#808080",
                "#ffffff", "#000000", "#a9a9a9", "#ff4500",
                "#2e8b57", "#4682b4", "#daa520", "#7b68ee",
                "#ff69b4", "#cd5c5c", "#26837a", "#1e90ff"
            ]);
            // Dispatch the event with the selected question ID
            title.text(titleText);
            dispatch.call("selectQuestion", null, selectedValue, color);

            populateAnswerSelectBox(question);
        }
    });

    return container;
}

function createSelectbox(questions) {
    const selectBox = d3.create("select")
        .style("position", "absolute")
        .style("top", "150px")
        .style("left", "20px")
        .style("padding", "10px")
        .style("width", "300px")
        .style("z-index", "10");

    // Add a default option
    const defaultOption = selectBox.append("option")
        .attr("value", "")
        .attr("disabled", true)
        .attr("selected", true)
        .text("Select a question");

    // Add options to the selection box
    selectBox.selectAll("option.question-option")
        .data(questions)
        .enter()
        .append("option")
        .attr("class", "question-option")
        .attr("value", d => d.id)
        .text(d => d.title || `Question ${d.id}`);

    return selectBox;
}