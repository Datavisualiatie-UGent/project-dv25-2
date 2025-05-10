import * as d3 from "d3";

export function createTimelineChart(dispatch, question, country, flags) {
    dispatch.on("resetBarView", () => {
        dots.attr("opacity", 1);
    });
    
    const categories = question.answers;
    const times = [2012, 2023];
    const data = question.volume_A[country];

    // Prepare data
    const plotData = Array.from({ length: categories.length }, (_, i) => i).map(index => {
        return {
            category: categories[index],
            values: [
                {
                    time: 2012,
                    value: data.percentages_old[index]
                },
                {
                    time: 2023,
                    value: data.percentages[index]
                }
            ]
        };
    });

    const container = document.querySelector(".chart-container");
    const containerWidth = container.getBoundingClientRect().width;
    const containerHeight = container.getBoundingClientRect().height;

    // Set up dimensions (adjusted for vertical orientation)
    const margin = {top: 40, right: 100, bottom: 60, left: 120};
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.create("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom]);

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales (flipped from original)
    const y = d3.scaleBand()
        .domain(categories)
        .range([height, 0])
        .padding(0.2);

    const x = d3.scaleLinear()
        .domain([0, 1])
        .range([0, width]);

    // Color scale
    const color = d3.scaleOrdinal(d3.schemeTableau10)
        .domain(times);

    // Add this right after your color scale definition and before the tooltip creation

    // Create connecting lines for each category
    // Add this after your color scale definition
    chart.selectAll(".category-line")
        .data(plotData)
        .join("path")
        .attr("class", "category-line")
        .attr("d", d => {
            const lineGenerator = d3.line()
                .x(d => x(d.value))
                .y(0);
            return lineGenerator(d.values);
        })
        .attr("stroke", d => {
            // Determine which value is lower
            const lowerValueTime = d.values[0].value < d.values[1].value ? d.values[0].time : d.values[1].time;
            return color(lowerValueTime);
        })
        .attr("stroke-width", 1.5)
        .attr("stroke-opacity", 0.7)
        .attr("fill", "none")
        .attr("transform", d => `translate(0,${y(d.category) + y.bandwidth() / 2})`);

    // Create tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "#3a3a3a")
        .style("padding", "8px")
        .style("border", "1px solid #ddd")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0)
        .style("font-size", "12px");

    // Create dots for each data point
    const dots = chart.selectAll(".country-dots")
        .data(plotData)
        .join("g")
        .attr("class", "country-dots")
        .attr("transform", d => `translate(0,${y(d.category) + y.bandwidth() / 2})`);

    dots.selectAll(".dot")
        .data(d => d.values)
        .join("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.value))
        .attr("cy", 0)
        .attr("r", 5)
        .attr("fill", d => color(d.time))
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("r", 8);
            
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`
                <strong>${d.time}</strong><br/>
                ${(d.value * 100).toFixed(1)}%<br/>
            `)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("r", 5);
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function(event, d) {
            dots.selectAll(".dot").attr("opacity", 0.2);
            dots.selectAll(".dot")
                .filter(dot => dot.time === d.time)
                .attr("opacity", 1);
            dispatch.call("selectBar");
        });

    // Add y-axis (countries on the left)
    chart.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "12px");

    // Add x-axis (percentages on top)
    chart.append("g")
        .attr("transform", `translate(0,0)`)
        .call(d3.axisTop(x).ticks(5, "%"))
        .call(g => g.select(".domain").remove());

    // Add grid lines
    chart.append("g")
        .attr("class", "grid")
        .call(d3.axisTop(x)
            .ticks(5)
            .tickSize(-height)
            .tickFormat(""))
        .selectAll("line")
        .attr("stroke", "#ddd")
        .attr("stroke-dasharray", "2,2");

    // Add legend on the right
    const legend = svg.append("g")
        .attr("transform", `translate(${width + margin.left + 20},${margin.top})`);

    times.forEach((time, i) => {
        const legendItem = legend.append("g")
            .attr("transform", `translate(0,${i * 20})`);

        legendItem.append("circle")
            .attr("r", 5)
            .attr("fill", color(time));

        legendItem.append("text")
            .attr("x", 15)
            .attr("y", 5)
            .text(time)
            .style("font-size", "12px");
    });

    return svg;
}