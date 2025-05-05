import * as d3 from "d3";

export function renderMap(svgContent) {
    // Append the SVG content directly to the body (or another parent element)
    const svg = d3.select("body")
        .append("div")
        .attr("id", "map-container")
        .html(svgContent)
        .select("svg");

    // Style the paths in the SVG
    svg.selectAll("path")
        .style("fill", "blue");

    return svg.node();
}