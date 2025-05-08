import * as d3 from "d3";

export function initSelectBox(dispatch, questions) {
    // Create a selection box for questions
    const selectBox = createSelectbox(questions);

    // Add event listener for selection change
    selectBox.on("change", function() {
        const selectedValue = d3.select(this).property("value");
        if (selectedValue) {
            // Dispatch the event with the selected question ID
            dispatch.call("selectQuestion", null, selectedValue);
            console.log(selectedValue);
        }
    });

    return selectBox;
}

function createSelectbox(questions) {
    const selectBox = d3.create("select")
        .style("position", "absolute")
        .style("top", "10px")
        .style("left", "10px")
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