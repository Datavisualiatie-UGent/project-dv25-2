import * as d3 from "d3";

export function initLegend(dispatch, questions, colorScale) {
    // Create legend container
    const legendContainer = createLegendContainer();

    // Listen for question selection
    dispatch.on("selectQuestion", function(questionId) {
        console.log("Selected question ID:", questionId);
        const selectedQuestion = questions.find(q => q.id === questionId);
        updateLegend(selectedQuestion);
    });

    // Update legend function
    function updateLegend(question) {
        legendContainer.html(""); // Clear previous legend

        if (!question || !question["answers"]) return;

        // Create legend items
        const legendItems = legendContainer.selectAll(".legend-item")
            .data(question["answers"])
            .enter()
            .append("div")
            .style("display", "flex")
            .style("align-items", "center")
            .style("margin-bottom", "5px");

        // Add color swatches
        legendItems.append("div")
            .style("width", "15px")
            .style("height", "15px")
            .style("margin-right", "8px")
            .style("background-color", d => colorScale(d));

        // Add answer text
        legendItems.append("div")
            .style("font-size", "12px")
            .style("color", "#333")
            .text(d => d);
    }

    return legendContainer;
}

function createLegendContainer() {
    const legendContainer = d3.create("div")
        .style("position", "absolute")
        .style("bottom", "20px")
        .style("left", "20px")
        .style("padding", "10px")
        .style("z-index", "10");

    return legendContainer;
}

