import * as d3 from "d3";

export function createBubbleChart() {
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
    const answers = [
        "To use on holidays abroad",
        "To use at work (including travelling abroad on business)",
        "To be able to study in another country",
        "To be able to work in another country",
        "To be able to train or volunteer in another country",
        "To get a better job in (OUR COUNTRY)",
        "For personal satisfaction",
        "To keep up knowledge of a language spoken by your family",
        "To meet people from other countries",
        "To be able to understand people from other cultures",
        "To feel more European",
        "To be able to use the Internet",
        "Other",
        "None",
        "Don't know"
    ];

    const beValues = [416, 418, 308, 393, 204, 469, 361, 176, 354, 424, 99, 239, 4, 9, 8];

    // Create data array
    const data = answers.map((answer, i) => ({
        answer: answer,
        value: beValues[i],
        category: i < 12 ? "Main" : "Other" // Group main answers together
    }));

    // Create scales
    const sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.value)])
        .range([10, 60]);

    const colorScale = d3.scaleOrdinal()
        .domain(["Main", "Other"])
        .range(["#4e79a7", "#e15759"]);

    // Create a force simulation to position bubbles
    const simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("charge", d3.forceManyBody().strength(-20))
        .force("collision", d3.forceCollide().radius(d => sizeScale(d.value) + 2));

    // Create bubbles
    const bubbles = svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("class", "bubble")
        .attr("r", d => sizeScale(d.value))
        .attr("fill", d => colorScale(d.category))
        .attr("opacity", 0.8)
        .attr("stroke", "white")
        .attr("stroke-width", 1.5)
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
            d3.select(this).attr("opacity", 0.8).attr("stroke-width", 1.5);
            tooltip.style("visibility", "hidden");
        });

    // Add answer labels to bubbles
    const labels = svg.append("g")
        .selectAll("text")
        .data(data.filter(d => d.value > 50)) // Only show labels for larger bubbles
        .join("text")
        .attr("dy", ".3em")
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .style("fill", "white")
        .text(d => {
            // Shorten long labels
            if (d.answer.length > 25) return d.answer.substring(0, 22) + "...";
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
        .style("background", "white")
        .style("border", "1px solid #ddd")
        .style("padding", "8px")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("font-family", "Arial, sans-serif")
        .style("font-size", "12px")
        .style("box-shadow", "2px 2px 4px rgba(0,0,0,0.2)");

    return svg;
}