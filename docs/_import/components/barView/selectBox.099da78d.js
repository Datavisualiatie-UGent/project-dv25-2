import * as d3 from "../../../_node/d3@7.9.0/index.6063bdcc.js";

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
        .text(questions[0].title || DEFAULT_TEXT);

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
        .attr("class", "question-option")
        .attr("selected", d => d.id === questions[0].id ? true : null)
        .attr("value", d => d.id)
        .text(d => d.title || `Question ${d.id}`);

    return selectBox;
}

