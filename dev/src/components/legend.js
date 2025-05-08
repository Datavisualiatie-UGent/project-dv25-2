import * as d3 from "d3";

export function initLegend(dispatch, questions, colorScale) {
    // Create legend container
    const legendContainer = createLegendContainer();

    // Listen for question selection
    dispatch.on("selectQuestion.legend", function(questionId) {
        const question = questions.find(q => q.id === questionId);
        updateLegend(question);
    });

    // Update legend function
    function updateLegend(question) {
        legendContainer.html(""); // Clear previous legend

        if (!question || !question["answers"] || !question["volume_A"]) return;

        const data = question["volume_A"];
        const answers = question["answers"];

        // Determine the highest value indices across all countries
        const highestAnswerIndices = new Set();
        Object.values(data).forEach(countryData => {
            if (countryData && countryData["values"]) {
                const maxIndex = countryData["values"].reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
                highestAnswerIndices.add(maxIndex);
            }
        });

        // Filter answers to include only those with the highest values
        const filteredAnswers = answers.filter((_, index) => highestAnswerIndices.has(index));

        // Create legend items
        const legendItems = legendContainer.selectAll(".legend-item")
            .data(filteredAnswers)
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

