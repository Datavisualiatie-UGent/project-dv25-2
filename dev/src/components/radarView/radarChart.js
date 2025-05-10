import * as d3 from "d3";
import {generateGridLevels, getTextColor, wrapText} from "./util.js";

const MAX_TOKEN_LENGTH = 18;

export function createRadarChart(question, selectedAnswers, maxScale) {
    const answers = question.answers;
    // Set dimensions
    const margin = {top: 100, right: 0, bottom: 100, left: 0};
    const width = window.innerWidth / 2;
    const height = window.innerHeight / 2;
    const radius = Math.min(width, height) / 2;

    // Angle of each axis
    const angleSlice = (2 * Math.PI) / answers.length;

    // Create SVG container
    const svg = d3.create("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("viewBox", `${-margin.left} ${-margin.top} ${width} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("position", "absolute")
        .style("right", "150px")
        .style("display", "block")
        .style("margin", "0 auto")

    const radar = svg.append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Create radial scale (0 to 100%)
    const rScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, radius]);

    // Draw radial grid lines (every 20%)
    const gridLevels = [20, 40, 60, 80, 100]
    const gridLevelsValues = generateGridLevels(maxScale)
    gridLevels.forEach(level => {
        radar.append("circle")
            .attr("r", rScale(level))
            .style("fill", "none")
            .style("stroke", "#ccc")
            .style("stroke-dasharray", "2 2");

        radar.append("text")
            .attr("x", 5)
            .attr("y", -rScale(level))
            .attr("dy", "-0.4em")
            .style("font-size", "12px")
            .style("fill", "white")
            .text(gridLevelsValues[gridLevels.indexOf(level)] + "%");
    });

    // Draw radial lines and labels for each category
    answers.forEach((cat, i) => {
        const angle = angleSlice * i;
        const x = rScale(120) * Math.cos(angle - Math.PI / 2);
        const y = rScale(110) * Math.sin(angle - Math.PI / 2);

        // Line
        radar.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", rScale(100) * Math.cos(angle - Math.PI / 2))
            .attr("y2", rScale(100) * Math.sin(angle - Math.PI / 2))
            .style("stroke", "#ddd");

        // Label
        const textElement = radar.append("text")
            .attr("x", x * 1.1)
            .attr("y", y * 1.1)
            .style("text-anchor", "middle")
            .style("fill", "white")
            .style("font-size", "16px")

        const wrappedLines = wrapText(cat, MAX_TOKEN_LENGTH);
        wrappedLines.forEach((line, index) => {
            textElement.append("tspan")
                .attr("x", x * 1.1)
                .attr("y", y * 1.1 + index * 16)
                .text(line);
        });
    });

    for (const key of Object.keys(selectedAnswers)) {
        const selectedAnswer = selectedAnswers[key];
        if (selectedAnswer === null) continue;
        const color = selectedAnswer.color;
        const data = selectedAnswer.value;

        // Create line generator with rounded corners
        const line = d3.lineRadial()
            .radius(d => rScale(d.value))
            .angle((d, i) => angleSlice * i)
            .curve(d3.curveCardinalClosed);

        // Prepare data for line path
        const lineData = answers.map((cat, i) => ({
            value: data.percentages[i] * 100 * (100 / maxScale),
            angle: angleSlice * i
        }));


        // Draw filled area below the line
        radar.append("path")
            .datum(lineData)
            .attr("class", "filled-area")
            .attr("d", line)
            .style("fill", color)
            .style("opacity", 0.2); // Semi-transparent fill

        // Draw line connecting dots
        radar.append("path")
            .datum(lineData)
            .attr("class", "line-path")
            .attr("d", line)
            .style("fill", "none")
            .style("stroke", color)
            .style("stroke-width", 2);

        // Draw dots for each value
        lineData.slice(0, -1).forEach((d) => { // Exclude the duplicate last point
            const x = rScale(d.value) * Math.cos(d.angle - Math.PI / 2);
            const y = rScale(d.value) * Math.sin(d.angle - Math.PI / 2);

            radar.append("circle")
                .attr("class", "dot")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", 4)
                .style("fill", color)
                .style("stroke", getTextColor(color))
                .style("stroke-width", 1.5);
        });
    }


    return svg.node();

}
