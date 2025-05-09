import * as d3 from "d3";

export function initLegend(dispatch, questions) {
    // Create legend container
    const legendContainer = createLegendContainer();

    let currentColor = null;
    let selectedQuestion = null;
    let selectedAnswer = null;

    // Listen for question selection
    dispatch.on("selectQuestion.legend", function(questionId, color) {
        selectedQuestion = questions.find(q => q.id === questionId);
        currentColor = color;
        selectedAnswer = null;
        updateLegend();
    });

    dispatch.on("selectAnswer.legend", function(answer) {
        selectedAnswer = answer;
        updateLegend();
    });

    function handleCategoricalQuestion(question) {
        const data = question["volume_A"];
        const answers = question["answers"];

        // Check if the last answer is "Total" or "Average"
        const isLastAnswerExcluded = ["Total", "Average"].includes(answers[answers.length - 1]);

        // Determine the highest value indices across all countries
        const highestAnswerIndices = new Set();
        Object.values(data).forEach(countryData => {
            if (countryData && countryData["values"]) {
                const values = isLastAnswerExcluded
                    ? countryData["values"].slice(0, -1) // Exclude the last value
                    : countryData["values"];

                const maxIndex = values.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
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
            .style("background-color", d => currentColor(d));

        // Add answer text
        legendItems.append("div")
            .style("font-size", "12px")
            .style("color", "white")
            .text(d => d);
    }

    function handleNumericalQuestion(question) {
        const data = question["volume_A"];
        const maxPercentage = Math.max(
            ...Object.values(data).flatMap(countryData => countryData["percentages"] || [0])
        );

        // Create a sequential color scale
        const colorScale = d3.scaleSequential()
            .domain([0, maxPercentage])
            .interpolator(d3.interpolateBlues);

        // Create an SVG for the legend
        const legendWidth = 200;
        const legendHeight = 20;
        const padding = 25; // Add padding for the gradient box

        const svg = legendContainer.append("svg")
            .attr("width", legendWidth + padding * 2 + 50) // Add padding to the width
            .attr("height", legendHeight + 30);

        // Define a gradient
        const gradient = svg.append("defs")
            .append("linearGradient")
            .attr("id", "legend-gradient")
            .attr("x1", "0%")
            .attr("x2", "100%")
            .attr("y1", "0%")
            .attr("y2", "0%");

        // Add gradient stops
        const numStops = 10;
        const stops = d3.range(numStops).map(i => i / (numStops - 1));
        stops.forEach(stop => {
            gradient.append("stop")
                .attr("offset", `${stop * 100}%`)
                .attr("stop-color", colorScale(stop * maxPercentage));
        });

        // Draw the gradient rectangle with padding
        svg.append("rect")
            .attr("x", padding) // Add padding to the x position
            .attr("y", 0)
            .attr("width", legendWidth) // Keep the width of the gradient
            .attr("height", legendHeight)
            .style("fill", "url(#legend-gradient)");

        // Add axis for percentages
        const legendScale = d3.scaleLinear()
            .domain([0, maxPercentage])
            .range([padding, legendWidth + padding]); // Adjust range to include padding

        const axis = d3.axisBottom(legendScale)
            .ticks(5)
            .tickFormat(d3.format(".0%"));

        svg.append("g")
            .attr("transform", `translate(0, ${legendHeight})`)
            .call(axis);
    }

    // Update legend function
    function updateLegend() {
        legendContainer.html(""); // Clear previous legend

        if (!selectedQuestion || !selectedQuestion["answers"] || !selectedQuestion["volume_A"]) return;

        if (selectedAnswer) {
            const answerIdx = selectedQuestion["answers"].indexOf(selectedAnswer);
            const data = selectedQuestion["volume_A"];
            const maxValue = Math.max(
                ...Object.values(data)
                    .slice(1)
                    .map(countryData => countryData["values"][answerIdx] || 0)
            );
            console.log(maxValue);

            // Create a gradient legend for the selected answer
            const gradientLegend = createGradientLegend(maxValue);
            legendContainer.append(() => gradientLegend.node());

            return;
        }

        if (selectedQuestion["type"] === "categorical") {
            handleCategoricalQuestion(selectedQuestion);
            return;
        }

        // Handle other question types (e.g., numerical)
        handleNumericalQuestion(selectedQuestion);
    }

    return legendContainer;
}

function createGradientLegend(maxValue, isPercentage = false) {
    // Create a sequential color scale
    const colorScale = d3.scaleSequential()
        .domain([0, maxValue])
        .interpolator(d3.interpolateGreens);

    // Create an SVG for the legend
    const legendWidth = 200;
    const legendHeight = 20;
    const padding = 25; // Add padding for the gradient box

    const svg = d3.create("svg")
        .attr("width", legendWidth + padding * 2 + 50) // Add padding to the width
        .attr("height", legendHeight + 30);

    // Define a gradient
    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "legend-gradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

    // Add gradient stops
    const numStops = 10;
    const stops = d3.range(numStops).map(i => i / (numStops - 1));
    stops.forEach(stop => {
        gradient.append("stop")
            .attr("offset", isPercentage ? `${stop * 100}%` : stop)
            .attr("stop-color", colorScale(stop * maxValue));
    });

    // Draw the gradient rectangle with padding
    svg.append("rect")
        .attr("x", padding) // Add padding to the x position
        .attr("y", 0)
        .attr("width", legendWidth) // Keep the width of the gradient
        .attr("height", legendHeight)
        .style("fill", "url(#legend-gradient)");

    // Add axis for percentages
    const legendScale = d3.scaleLinear()
        .domain([0, maxValue])
        .range([padding, legendWidth + padding]); // Adjust range to include padding

    const axis = d3.axisBottom(legendScale)
        .ticks(5)
        .tickFormat(isPercentage ? d3.format(".0%") : d3.format(".0f"));

    svg.append("g")
        .attr("transform", `translate(0, ${legendHeight})`)
        .call(axis);

    return svg;
}

function createLegendContainer() {
    const legendContainer = d3.create("div")
        .style("position", "absolute")
        .style("bottom", "20px")
        .style("left", "20px")
        .style("padding", "10px")
        .style("z-index", "10")
        .style("max-height", "200px")
        .style("overflow-y", "auto");

    return legendContainer;
}

