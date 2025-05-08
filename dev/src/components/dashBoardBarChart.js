import * as d3 from "d3";

export function createBarChart(infoPanel, questionData, countryId, color) {
    const countryStats = questionData.volume_A[countryId];
    if (!countryStats) return;

    // Clear previous chart
    infoPanel.selectAll(".bar-chart").remove();

    // Larger chart dimensions
    const numBars = questionData.answers.length;
    const barHeight = 30; // Fixed height per bar
    const width = 650;  // Increased width
    const height = Math.max(400, numBars * (barHeight + 10)); // Minimum 400px
    const margin = {top: 40, right: 30, bottom: 60, left: 90}; // More spacing

    // Create SVG with larger dimensions
    const svg = infoPanel.append("svg")
        .attr("class", "bar-chart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Prepare data
    const data = questionData.answers.map((answer, i) => ({
        answer,
        value: countryStats.values[i],
        percentage: countryStats.percentages[i]
    }))
        .filter(d => d.value > 0) // Filter out zero values
        .sort((a, b) => a.value - b.value); // Sort descending

    // Flip scales (now horizontal)
    const y = d3.scaleBand()
        .domain(data.map(d => d.answer))
        .range([height - margin.top - margin.bottom, 0])
        .padding(0.3); // More spacing between bars

    const x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([0, width - margin.left - margin.right]);

    // Horizontal bars
    svg.selectAll(".bar")
        .data(data)
        .join("rect")
        .attr("class", "bar")
        .attr("y", d => y(d.answer))
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("width", d => x(d.value))
        .attr("fill", d => color(d.answer));

    // Axes (flipped)
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y));

    // Value labels at end of bars
    svg.selectAll(".bar-label")
        .data(data)
        .join("text")
        .attr("class", "bar-label")
        .attr("x", d => x(d.value) + 5)
        .attr("y", d => y(d.answer) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text(d => d.value)
        .style("fill", "#ecf0f1")
        .style("font-size", "12px");

    // Chart title
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", (width - margin.left - margin.right) / 2)
        .attr("y", -15)
        .style("text-anchor", "middle")
        .style("fill", "#00ffff")
        .style("font-size", "16px")
        .text(questionData.title);
}