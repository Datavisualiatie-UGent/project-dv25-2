import * as d3 from "../../../_node/d3@7.9.0/index.6063bdcc.js";

export function createBubbleChart(question, country) {
    // Configuration
    const config = {
        width: window.innerWidth,
        height: window.innerHeight,
        padding: 50,
        minBubbleSize: 1,
        maxBubbleSize: 200,
        minValueForLabel: 50,
        colorScheme: d3.scaleOrdinal([
                "#e6194b", "#3cb44b", "#ffe119", "#4363d8",
                "#f58231", "#911eb4", "#b6ffff", "#f032e6",
                "#bcf60c", "#fabebe", "#008080", "#e6beff",
                "#9a6324", "#fffac8", "#800000", "#aaffc3",
                "#808000", "#ffd8b1", "#000075", "#808080",
                "#ffffff", "#000000", "#a9a9a9", "#ff4500",
                "#2e8b57", "#4682b4", "#daa520", "#7b68ee",
                "#ff69b4", "#cd5c5c", "#26837a", "#1e90ff"
            ]),
        transitionDuration: 300
    };

    // Create SVG container
    const svg = d3.create("svg")
        .attr("width", config.width)
        .attr("height", config.height)
        .attr("viewBox", [0, 0, config.width, config.height])
        .attr("style", "max-width: 100%; height: 100%;");

    // Prepare data
    const data = question.answers.map((answer, i) => ({
        answer,
        value: question.volume_A[country].values[i],
        category: i,
        x: Math.random() * config.width,
        y: Math.random() * config.height
    })).filter(d => d.value > 0);

    // Scales
    const sizeScale = d3.scaleSqrt()
        .domain([0, d3.max(data, d => d.value)])
        .range([config.minBubbleSize, config.maxBubbleSize]);

    const colorScale = config.colorScheme;

    // Tooltip setup
    const tooltip = createTooltip();

    // Simulation setup
    const simulation = createSimulation(data, config, sizeScale);

    // Add zoom/pan behavior (modified to only allow wheel zoom)
    const zoom = d3.zoom()
        .scaleExtent([0.5, 3]) // Limit zoom range
        .on("zoom", (event) => {
            bubblesGroup.attr("transform", event.transform);
            labelsGroup.attr("transform", event.transform);
        });

    // Apply zoom but disable drag events
    svg.call(zoom);

    // Create bubbles group
    const bubblesGroup = svg.append("g")
        .attr("class", "bubbles");

    // Draw bubbles with enhanced interactivity
    const bubbles = bubblesGroup.selectAll(".bubble")
        .data(data)
        .join("circle")
        .attr("class", "bubble")
        .attr("r", d => sizeScale(d.value))
        .attr("fill", d => colorScale(d.category))
        .attr("opacity", 0.85)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleClick);

    // Create labels with multi-line text
    const labelsGroup = svg.append("g")
        .attr("class", "labels");

    const labels = labelsGroup.selectAll(".label-group")
        .data(data.filter(d => d.value >= config.minValueForLabel))
        .join("g")
        .attr("class", "label-group")
        .attr("transform", d => `translate(${d.x},${d.y})`)
        .style("pointer-events", "none");

    labels.each(function(d) {
        createMultiLineLabel(d3.select(this), d, sizeScale(d.value));
    });

    // Simulation tick handler
    simulation.on("tick", () => {
        bubbles
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        labels
            .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    // Helper functions
    function createTooltip() {
        return d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("visibility", "hidden")
            .style("background", "rgba(0,0,0,0.8)")
            .style("color", "white")
            .style("padding", "8px 12px")
            .style("border-radius", "4px")
            .style("pointer-events", "none")
            .style("font-family", "sans-serif")
            .style("font-size", "18px")
            .style("box-shadow", "0 2px 10px rgba(0,0,0,0.2)")
            .style("transition", "opacity 0.2s");
    }

    function createSimulation(data, config, sizeScale) {
        return d3.forceSimulation(data)
            .force("x", d3.forceX(config.width / 2).strength(0.03))
            .force("y", d3.forceY(config.height / 2).strength(0.03))
            .force("charge", d3.forceManyBody().strength(-50))
            .force("collision", d3.forceCollide()
                .radius(d => sizeScale(d.value) + 10)
                .strength(0.8));
    }

    function createMultiLineLabel(container, d, radius) {
        const maxWidth = radius - 50;
        const maxLines = Math.max(1, Math.floor(radius / 15));
        const lineHeight = radius / 5;

        const lines = wrapText(d.answer, maxWidth, maxLines);

        container.selectAll("text")
            .data(lines)
            .join("text")
            .attr("dy", (_, i) => (i - (lines.length - 1) / 2) * lineHeight)
            .attr("text-anchor", "middle")
            .style("font-size", `${lineHeight}px`)
            .style("fill", "white")
            .style("font-weight", "bold")
            .style("text-shadow", "1px 1px 2px rgba(0,0,0,0.7)")
            .text(line => line);
    }

    function wrapText(text, maxWidth, maxLines = 2) {
        const words = text.split(/\s+/);
        const lines = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const testLine = currentLine + " " + word;

            if (testLine.length * 8 <= maxWidth) {
                currentLine = testLine;
            } else {
                if (lines.length + 1 >= maxLines) {
                    currentLine = currentLine + "...";
                    break;
                }
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    // Interaction handlers
    function handleMouseOver(event, d) {
        d3.select(this)
            .transition()
            .duration(config.transitionDuration)
            .attr("opacity", 1)
            .attr("stroke-width", 3)
            .attr("r", sizeScale(d.value) * 1.05);

        tooltip
            .style("visibility", "visible")
            .html(`<strong>${d.answer}</strong><br/>Respondents: ${d.value}`)
            .style("left", `${event.pageX + 15}px`)
            .style("top", `${event.pageY - 15}px`);
    }

    function handleMouseOut(event, d) {
        d3.select(this)
            .transition()
            .duration(config.transitionDuration)
            .attr("opacity", 0.85)
            .attr("stroke-width", 1)
            .attr("r", sizeScale(d.value));

        tooltip.style("visibility", "hidden");
    }

    function handleClick(event, d) {
        // Stop current simulation to prevent interference
        simulation.stop();

        // Store original positions
        const originalX = d.x;
        const originalY = d.y;

        // Calculate target center position
        const targetX = config.width / 2;
        const targetY = config.height / 2;

        // Create smooth transition
        const duration = 1000; // milliseconds
        const startTime = Date.now();

        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Apply easing function for smooth movement
            const ease = d3.easeCubicInOut(progress);

            // Calculate intermediate position
            d.x = originalX + (targetX - originalX) * ease;
            d.y = originalY + (targetY - originalY) * ease;

            // Temporarily fix position during animation
            d.fx = d.x;
            d.fy = d.y;

            // Restart simulation to apply movement
            simulation.alpha(0.1).restart();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Release fixed position after animation completes
                d.fx = null;
                d.fy = null;
                simulation.alpha(0.3).restart();
            }
        }

        // Start animation
        animate();

        // Highlight this bubble
        d3.select(this)
            .transition()
            .duration(duration)
            .attr("opacity", 1);

        // Dim other bubbles
        bubbles.filter(b => b !== d)
            .transition()
            .duration(duration)
            .attr("opacity", 0.3);
    }

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

    return svg;
}