import * as d3 from "../../../_node/d3@7.9.0/index.6063bdcc.js";

export function createBarChart(dispatch, question, eu_countries, flags) {

    dispatch.on("resetBarView", () => {
        bars.attr("opacity", 1);
    });

    const excluded_categories = [
        "Total 'Agree'", "Total 'Disagree'",
        "Total 'Satisfied'", "Total 'Not satisfied'"
    ];
    const categories = question.answers.filter(d => !excluded_categories.includes(d));
    const data = question.volume_A;

    // Get all EU country IDs except EU27
    const excluded = ["EU27", "D-E", "D-W"];
    const countryIds = Object.keys(data).filter(d => !excluded.includes(d));

    // Prepare data for stacking
    const stackedData = countryIds.map(country => {
        return {
            country,
            ...categories.reduce((acc, cat, i) => {
                acc[cat] = data[country].percentages[i]; // Convert to percentage
                return acc;
            }, {})
        };
    }).sort((a, b) => b[categories[0]] - a[categories[0]]); // Sort by the first category


    const container = document.querySelector(".chart-container");
    const containerWidth = container.getBoundingClientRect().width;
    const containerHeight = container.getBoundingClientRect().height;

    // Set up dimensions
    const margin = {top: 100, right: 30, bottom: 60, left: 60};
    const width = containerWidth * 0.85 - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.create("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom]);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Stack the data
    const stack = d3.stack()
        .keys(categories)
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetExpand);

    const series = stack(stackedData);

    // Scales
    const x = d3.scaleBand()
        .domain(stackedData.map(d => d.country))
        .range([0, width])
        .padding(0.2);

    const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);

    // Color scale
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    // Create a tooltip div
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "#3a3a3a")
        .style("padding", "8px")
        .style("border", "1px solid #ddd")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("font-size", "12px")
        .style("box-shadow", "0 2px 4px rgba(0,0,0,0.2)");

    // Draw the stacked bars with interactivity
    const bars = chart.append("g")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d.map(v => ({ ...v, key: d.key })))
        .join("rect")
        .attr("x", d => x(d.data.country))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .on("mouseover", function(event, d) {
            // Highlight the hovered segment
            d3.select(this).attr("stroke", "white").attr("stroke-width", 2);
            // Show tooltip
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`
                <strong>${eu_countries[d.data.country].name}</strong><br/>
                ${d.key}: ${((d[1] - d[0]) * 100).toFixed(1)}%<br/>
            `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            // Remove highlight
            d3.select(this).attr("stroke", null);

            // Hide tooltip
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function(event, d) {
            // On click, highlight all segments of the same category across bars
            const category = d.key;
            bars.attr("opacity", 0.5);
            bars.filter(d => d.key === category).attr("opacity", 1);
            dispatch.call("selectBar");
        })
        .on("dblclick", function(event, d) {
            // On double-click, reset the opacity of all segments
            bars.attr("opacity", 1);
        });

    // Add x-axis
    chart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "10px");

    // Add flags under the x-axis
    chart.append("g")
        .selectAll(".flag-emoji")
        .data(stackedData)
        .join("text")
        .attr("class", "flag-emoji")
        .attr("x", d => x(d.country) + x.bandwidth() / 2)
        .attr("y", height + 45)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text(d => flags[d.country] || d.country);

    // Add y-axis
    chart.append("g")
        .call(d3.axisLeft(y).ticks(5, "%"))
        .call(g => g.select(".domain").remove());

    return svg;
}