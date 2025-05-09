import * as d3 from "d3";


export function renderBarView(questions, flags) {
    const question = questions[0];
    const categories = question.answers;
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


    // Set up dimensions
    const margin = {top: 50, right: 30, bottom: 100, left: 60};
    const width = window.innerWidth * 0.9 - margin.left - margin.right;
    const height = window.innerHeight * 0.8 - margin.top - margin.bottom;

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

    // Draw the stacked bars
    chart.append("g")
        .selectAll("g")
        .data(series)
        .join("g")
        .attr("fill", d => color(d.key))
        .selectAll("rect")
        .data(d => d)
        .join("rect")
        .attr("x", d => x(d.data.country))
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", x.bandwidth())
        .append("title")
        .text(d => `${d.data.country}: ${d.key} ${(d[1] - d[0]).toFixed(1)}%`);

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

    // Add legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 100}, 20)`);

    categories.forEach((category, i) => {
        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 20)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", color(category));

        legend.append("text")
            .attr("x", 20)
            .attr("y", i * 20 + 12)
            .text(category)
            .style("font-size", "12px");
    });

    return svg.node();
}

