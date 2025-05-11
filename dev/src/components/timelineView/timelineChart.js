import * as d3 from "d3";

export function createTimelineChart(container, dispatch, question, country, flags) {
    dispatch.on("resetBarView", () => {
        dots.selectAll(".dot").attr("opacity", 1);
        chart.selectAll(".category-line").attr("opacity", 1);
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


    // Get container dimensions
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;


    // Set up dimensions (adjusted for vertical orientation)
    const margin = { top: 120, right: 100, bottom: 10, left: 300 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.create("svg")
        .attr("width", containerWidth)
        .attr("height", containerHeight)
        .attr("viewBox", [0, 0, containerWidth, containerHeight])
        .attr("style", "max-width: 100%; height: 100%;");

    const chart = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Calculate the maximum value from the dataset
    const maxValue = d3.max(plotData, d => d3.max(d.values, v => v.value));

    // Scales (flipped from original)
    const y = d3.scaleBand()
        .domain(categories)
        .range([height, 0])
        .padding(0.2);

    const x = d3.scaleLinear()
        .domain([0, maxValue]) // Set the domain from 0 to the largest value
        .range([0, width]);

    // Color scale
    const color = d3.scaleOrdinal(["#e6194b", "#3cb44b"]) //d3.scaleOrdinal(d3.schemeTableau10)
        .domain(times);

    // Add this right after your color scale definition and before the tooltip creation

    // Create connecting lines with percentage difference tooltip
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
            const lowerValueTime = d.values[0].value < d.values[1].value ? "#3cb44b" : "#e6194b";
            return lowerValueTime;
        })
        .attr("stroke-width", 2.5)
        .attr("stroke-opacity", 0.7) // Make slightly transparent by default
        .attr("fill", "none")
        .attr("transform", d => `translate(0,${y(d.category) + y.bandwidth() / 2})`)
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke-opacity", 1).attr("stroke-width", 4);

            // Calculate percentage difference
            const diff = d.values[1].value - d.values[0].value;
            const percentageDiff = (diff / d.values[0].value) * 100;
            const direction = diff > 0 ? "increase" : "decrease";
            const absPercentage = Math.abs(percentageDiff).toFixed(1);

            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(`
            <div style="margin-bottom: 4px; font-weight: bold;">${d.category}</div>
            <div>${direction === "increase" ? "↑" : "↓"} ${absPercentage}% ${direction}</div>
            <div style="font-size: 0.8em; color: #ccc;">
                (${(d.values[0].value*100).toFixed(1)}% → ${(d.values[1].value*100).toFixed(1)}%)
            </div>
        `)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 15) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("stroke-opacity", 0.7).attr("stroke-width", 2.5);
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

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
        .on("mouseover", function (event, d) {
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
        .on("mouseout", function () {
            d3.select(this).attr("r", 5);
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function (event, d) {
            chart.selectAll(".category-line").attr("opacity", 0.1);
            dots.selectAll(".dot").attr("opacity", 0.1);
            dots.selectAll(".dot")
                .filter(dot => dot.time === d.time)
                .attr("opacity", 1);
            dispatch.call("selectBar");
        })
        .on("dblclick", function (event, d) {
            chart.selectAll(".category-line").attr("opacity", 1);
            dots.selectAll(".dot").attr("opacity", 1);
            dispatch.call("resetBarView");
        });

    // Replace your truncateText function with this enhanced version
    function truncateTextWithTooltip(text, maxLength) {
        text.each(function () {
            const textEl = d3.select(this);
            const fullText = textEl.text();

            if (fullText.length > maxLength) {
                // Truncate the visible text
                textEl.text(fullText.substring(0, maxLength) + "...");
            }
            textEl.on("mouseover", function (event) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(fullText)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
                .on("mouseout", function () {
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
        });
    }

    // Then modify your y-axis code to use the new function:
    const yAxis = chart.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("font-size", "12px")
        .call(truncateTextWithTooltip, 40); // 40 characters max before adding ellipsis

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

    return svg;
}