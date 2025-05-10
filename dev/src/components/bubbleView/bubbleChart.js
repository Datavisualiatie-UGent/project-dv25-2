import * as d3 from "d3";

export function createBubbleChart() {
    // Set up dimensions and margins
    const margin = {top: 20, right: 20, bottom: 30, left: 40};
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;

    // Create SVG
    const svg = d3.create("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom]);


    // Sample data - replace with your actual data
    const data = [
        {x: 10, y: 20, value: 30, category: "A", name: "Item 1"},
        {x: 20, y: 40, value: 10, category: "B", name: "Item 2"},
        {x: 30, y: 30, value: 20, category: "A", name: "Item 3"},
        {x: 40, y: 10, value: 40, category: "B", name: "Item 4"},
        {x: 50, y: 50, value: 30, category: "C", name: "Item 5"}
    ];

    // Create scales
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.x) * 1.1])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.y) * 1.1])
        .range([height, 0]);

    const sizeScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([5, 30]);

    const colorScale = d3.scaleOrdinal()
        .domain(["A", "B", "C"])
        .range(d3.schemeCategory10);

    // Add axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    svg.append("g")
        .call(d3.axisLeft(yScale));

    // Create bubbles
    const bubbles = svg.selectAll(".bubble")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "bubble")
        .attr("cx", d => xScale(d.x))
        .attr("cy", d => yScale(d.y))
        .attr("r", d => sizeScale(d.value))
        .attr("fill", d => colorScale(d.category))
        .attr("opacity", 0.7)
        .attr("stroke", "white")
        .attr("stroke-width", 2);

    return svg;
}