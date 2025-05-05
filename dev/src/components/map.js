import * as d3 from "d3";
import { FileAttachment } from "@observablehq/stdlib"

export async function renderMap() {
    const container = d3.create("div")
        .attr("id", "map-container")
        .node();

    const svgContent = await FileAttachment("data/europe.svg").text();
    container.innerHTML = svgContent;

    const svg = d3.select("#map-container svg");

    return container;
}

