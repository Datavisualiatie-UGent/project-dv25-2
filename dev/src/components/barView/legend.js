import * as d3 from "d3";

export function initLegend(question) {
    const excluded_categories = [
        "Total 'Agree'", "Total 'Disagree'",
        "Total 'Satisfied'", "Total 'Not satisfied'"
    ];
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    // Create a container for the legend
    const container = d3.create("div")
        .style("position", "relative")


    const legendContainer = createLegendContainer();
    // Create legend items
    const categories = question["answers"].filter(d => !excluded_categories.includes(d));

    const legendItems = legendContainer.selectAll(".legend-item")
        .data(categories)
        .enter()
        .append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("margin-bottom", "5px");

    // Add color swatches
    legendItems.append("div")
        .style("width", "18px")
        .style("height", "18px")
        .style("margin-right", "8px")
        .style("background-color", d => color(d));

    // Add answer text
    legendItems.append("div")
        .style("font-size", "18px")
        .style("color", "white")
        .text(d => d);

    container.append(() => legendContainer.node());

    return container;
}

function createLegendContainer() {
    const legendContainer = d3.create("div")
        .attr("class", "legend")
        .style("position", "absolute")
        .style("right", "20px")
        .style("bottom", "480px")
        .style("padding", "10px")
        .style("z-index", "10")
        .style("max-height", "200px")
        .style("overflow-y", "auto");

    return legendContainer;
}