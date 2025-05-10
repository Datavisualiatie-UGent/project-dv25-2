import * as d3 from "d3";

export function createBubbleChart(question, country) {
    // Set up dimensions
    const width = window.innerWidth * 0.8;
    const height = window.innerHeight * 0.8;
    const padding = 50;

    // Create SVG
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    // Prepare the data for Belgium
    const answers = question["answers"];
    const values = question["volume_A"][country]["values"];


    // Create data array with initial positions
    const data = answers.map((answer, i) => ({
        answer: answer,
        value: values[i],
        category: i < 12 ? "Main" : "Other",
        x: Math.random() * width,
        y: Math.random() * height
    }));

    // Create scales with more spacing between bubbles
    const sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.value)])
        .range([15, 70]); // Increased minimum size for better visibility

    const colorScale = d3.scaleOrdinal()
        .domain(["Main", "Other"])
        .range(["#4e79a7", "#e15759"]);

    // Create a force simulation with stronger repulsion
    const simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(width / 2).strength(0.03)) // Weaker center force
        .force("y", d3.forceY(height / 2).strength(0.03))
        .force("charge", d3.forceManyBody().strength(-50)) // Increased repulsion
        .force("collision", d3.forceCollide().radius(d => sizeScale(d.value) + 10)); // More padding

    // Create bubbles with drag behavior
    const bubbles = svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("class", "bubble")
        .attr("r", d => sizeScale(d.value))
        .attr("fill", d => colorScale(d.category))
        .attr("opacity", 0.85)
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("mouseover", function(event, d) {
            d3.select(this).attr("opacity", 1).attr("stroke-width", 3);
            tooltip.style("visibility", "visible")
                .html(`<strong>${d.answer}</strong><br/>
                       Respondents: ${d.value}<br/>`);
        })
        .on("mousemove", function(event) {
            tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            d3.select(this).attr("opacity", 0.85).attr("stroke-width", 2);
            tooltip.style("visibility", "hidden");
        });

    // Drag functions
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

    // Add answer labels to bubbles
    const labels = svg.append("g")
        .selectAll("text")
        .data(data.filter(d => d.value > 50))
        .join("text")
        .attr("dy", ".3em")
        .style("font-size", "11px")
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .style("fill", "white")
        .style("font-weight", "bold")
        .text(d => {
            // Shorten long labels with smarter truncation
            const maxLength = sizeScale(d.value) / 3;
            if (d.answer.length > maxLength) {
                return d.answer.substring(0, maxLength - 3) + "...";
            }
            return d.answer;
        });

    // Update positions on simulation tick
    simulation.on("tick", () => {
        bubbles
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        labels
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });

    // Create tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(255, 255, 255, 0.95)")
        .style("border", "1px solid #ddd")
        .style("padding", "10px")
        .style("border-radius", "6px")
        .style("pointer-events", "none")
        .style("font-family", "Arial, sans-serif")
        .style("font-size", "13px")
        .style("box-shadow", "3px 3px 10px rgba(0,0,0,0.2)")
        .style("backdrop-filter", "blur(2px)");

    return svg;
}