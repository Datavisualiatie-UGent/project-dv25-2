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

    // Add event listener for selection change
    selectBox.on("change", function() {
        const selectedValue = d3.select(this).property("value");
        const titleText = questions.find(q => q.id === selectedValue)?.title;
        if (selectedValue) {
            // Dispatch the event with the selected question ID
            title.text(titleText);
            dispatch.call("selectQuestion", null, selectedValue);
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