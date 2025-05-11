import * as d3 from "../../../_node/d3@7.9.0/index.6063bdcc.js";

export function initLegend(question) {
    const color = d3.scaleOrdinal(["#e6194b", "#3cb44b"]);

    // Create a container for the legend
    const container = d3.create("div")
        .style("position", "relative")


    const legendContainer = createLegendContainer();
    // Create legend items
    const times = [2012, 2023];

    const legendItems = legendContainer.selectAll(".legend-item")
        .data(times)
        .enter()
        .append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("margin-bottom", "5px");

    // Add color swatches
    legendItems.append("div")
        .style("width", "16px")
        .style("height", "16px")
        .style("margin-right", "8px")
        .style("background-color", d => color(d));

    // Add answer text
    legendItems.append("div")
        .style("font-size", "16px")
        .style("color", "white")
        .text(d => d);

    container.append(() => legendContainer.node());

    return container;
}

function createLegendContainer() {
    const legendContainer = d3.create("div")
        .attr("class", "legend")
        .style("position", "absolute")
        .style("top", "-78vh")
        .style("right", "20px")
        .style("padding", "20px")
        .style("z-index", "10")
        .style("display", "flex") // Set to flex for horizontal layout
        .style("flex-direction", "row") // Make items horizontal
        .style("align-items", "center")
        .style("max-width", "60%")
        .style("gap", "15px 10px")
        .style("flex-wrap", "wrap") // Allow wrapping to a new row
        .style("overflow-x", "auto"); // Allow horizontal scrolling if needed

    return legendContainer;
}