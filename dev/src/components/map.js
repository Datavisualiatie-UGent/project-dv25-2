import * as d3 from "d3";

export function initMapContainer(svgContent, dispatch, questions, color) {
    const mapContainer = createMapContainer(svgContent);
    const svg = mapContainer.select("svg");
    const paths = svg.selectAll("path");

    let clickedCountry = null;

    function click_country(path) {
        const countryId = path.attr("id");

        // If clicking the same country, do nothing
        if (clickedCountry?.attr("id") === countryId) return;

        // Reset previous country's color
        if (clickedCountry) {
            clickedCountry
                .style("fill", "#212728")
                .style("filter", "none");
        }

        // Update clicked country
        path.style("fill", "#00ffff");
        clickedCountry = path;

        // Zoom to country
        zoomToCountry(path.node());

        // Trigger dashboard
        dispatch.call("openDashboard", path, countryId);
    }

    function zoomToCountry(countryElement) {
        const svg = d3.select(countryElement.ownerSVGElement);
        const bbox = countryElement.getBBox();
        const [[x0, y0], [x1, y1]] = [[bbox.x, bbox.y], [bbox.x + bbox.width, bbox.y + bbox.height]];

        // Get container dimensions
        const containerWidth = mapContainer.node().clientWidth;
        const containerHeight = mapContainer.node().clientHeight;

        // Calculate the scale to fit the country with padding
        const padding = 1.5; // 20% padding
        const width = x1 - x0;
        const height = y1 - y0;

        // Calculate scale to fit either width or height
        const scaleX = (containerWidth * 0.9) / (width * (1 + padding));
        const scaleY = (containerHeight * 0.9) / (height * (1 + padding));
        const scale = Math.min(scaleX, scaleY);

        // Calculate translation to center the country
        const translateX = (containerWidth - width * scale) / 2 - x0 * scale;
        const translateY = (containerHeight - height * scale) / 2 - y0 * scale;

        // Apply the transform to a group containing all paths
        if (!svg.select("g.zoom-group").empty()) {
            svg.select("g.zoom-group")
                .transition()
                .duration(750)
                .attr("transform", `translate(${translateX},${translateY}) scale(${scale})`);
        } else {
            // Wrap all paths in a group if not already done
            svg.selectAll("path").each(function() {
                svg.node().appendChild(this);
            });
            const paths = svg.selectAll("path");
            const zoomGroup = svg.append("g").attr("class", "zoom-group");
            paths.each(function() {
                zoomGroup.node().appendChild(this);
            });

            zoomGroup
                .transition()
                .duration(750)
                .attr("transform", `translate(${translateX},${translateY}) scale(${scale})`);
        }

        svg.style("margin-left", "-40%");
    }

    function resetZoom() {
        const svg = d3.select("svg");
        const easing = d3.easeCubicOut;

        if (svg.select("g.zoom-group").empty()) {
            svg.selectAll("path")
                .transition()
                .ease(easing)
                .duration(750)
                .attr("transform", "none");
        } else {
            svg.select("g.zoom-group")
                .transition()
                .ease(easing)
                .duration(750)
                .attr("transform", "none");
        }

        svg.transition()
            .ease(easing)
            .duration(750)
            .style("margin-left", "-150px");

        mapContainer.transition()
            .ease(easing)
            .duration(750)
            .style("width", "99%");

        svg.selectAll("path")
            .style("stroke", "white")
            .style("stroke-width", "0.5px")
    }

    function unselect_country() {
        if (clickedCountry) {
            clickedCountry
                .style("fill", "#212728")
                .style("filter", "none");
        }
        resetZoom();
        clickedCountry = null;
    }

    dispatch.on("closeDashboard.map", unselect_country);

    function updateMapCategorical(data, answers) {
        paths.each(function() {
            const path = d3.select(this);
            const countryId = path.attr("id"); // Get country ID from path attribute

            if (countryId && data[countryId]) {
                const countryData = data[countryId];
                const maxIndex = countryData.values.reduce((iMax, x, i, arr) =>
                    x > arr[iMax] ? i : iMax, 0);

                path.style("fill", color["categorical"](answers[maxIndex]));
            } else {
                // Handle countries with no data
                path.style("fill", "#ccc"); // Gray for no data
            }
        });
    }

    function updateMap(question) {
        const answers = question["answers"];
        const data = question["volume_A"];
        const type = question["type"];

        if (!question || !answers || !data) return;

        if (type === "categorical") {
            updateMapCategorical(data, answers);
            return;
        }

        // Create a sequential color scale
        const maxPercentage = Math.max(
            ...Object.values(data).flatMap(countryData => countryData["percentages"] || [0])
        );
        const colorScale = d3.scaleSequential()
            .domain([0, maxPercentage])
            .interpolator(d3.interpolateBlues);

        paths.each(function() {
            const path = d3.select(this);
            const countryId = path.attr("id"); // Get country ID from path attribute

            if (countryId && data[countryId]) {
                const countryData = data[countryId];
                const percentage = countryData["percentages"] ? countryData["percentages"][0] : 0;

                path.style("fill", colorScale(percentage));
            } else {
                // Handle countries with no data
                path.style("fill", "#ccc"); // Gray for no data
            }
        });
    }


    dispatch.on("selectQuestion.map", function(questionId) {
        const selectedQuestion = questions.find(q => q.id === questionId);
        updateMap(selectedQuestion);
    });

    // Add click interaction
    paths.on("click", function(event, d) {
        click_country(d3.select(this));
    })
    .on("mouseover", function() {
        if (!clickedCountry || clickedCountry.attr("id") !== d3.select(this).attr("id")) {
            d3.select(this)
                .style("filter", "url(#hover-glow)")
                .style("stroke", "white")
                .style("stroke-width", "2px");
        }
    })
    .on("mouseout", function() {
        if (!clickedCountry || clickedCountry.attr("id") !== d3.select(this).attr("id")) {
            d3.select(this)
                .style("filter", "none")
                .style("stroke", "white")
                .style("stroke-width", "0.5px");
        }
        });

    return mapContainer;
}

function createMapContainer(svgContent) {
    const mapContainer = d3.create("div")
        .style("width", "99%")
        .style("height", "99%")
        .style("overflow", "hidden")
        .style("position", "relative")
        .style("border", "1px white solid")
        .style("border-radius", "8px")
        .style("transition", "all 0.5s ease");

    mapContainer.html(svgContent);
    const svg = mapContainer.select("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "100%")
        .style("margin-left", "-150px");

    // Add SVG filters for high-tech effects
    const defs = svg.append("defs");

    // Glow effect
    const glowFilter = defs.append("filter")
        .attr("id", "glow")
        .attr("height", "130%")
        .attr("width", "130%")
        .attr("x", "-15%")
        .attr("y", "-15%");

    glowFilter.append("feGaussianBlur")
        .attr("stdDeviation", "2")
        .attr("result", "blur");
    glowFilter.append("feComposite")
        .attr("in", "SourceGraphic")
        .attr("in2", "blur")
        .attr("operator", "over");

    // Hover glow effect
    const hoverGlowFilter = defs.append("filter")
        .attr("id", "hover-glow")
        .attr("height", "150%")
        .attr("width", "150%")
        .attr("x", "-25%")
        .attr("y", "-25%");

    hoverGlowFilter.append("feGaussianBlur")
        .attr("stdDeviation", "3")
        .attr("result", "blur");
    hoverGlowFilter.append("feComposite")
        .attr("in", "SourceGraphic")
        .attr("in2", "blur")
        .attr("operator", "over");

    // Pulsing glow for selected country
    const pulseGlowFilter = defs.append("filter")
        .attr("id", "pulse-glow")
        .attr("height", "200%")
        .attr("width", "200%")
        .attr("x", "-50%")
        .attr("y", "-50%");

    pulseGlowFilter.append("feGaussianBlur")
        .attr("stdDeviation", "5")
        .attr("result", "blur");
    pulseGlowFilter.append("feComposite")
        .attr("in", "SourceGraphic")
        .attr("in2", "blur")
        .attr("operator", "over");



    const paths = svg.selectAll("path")
        .style("fill", "#212728")
        .style("stroke", "white")
        .style("stroke-width", "0.5px")
        .style("cursor", "pointer")
        .style("transition", "all 0.3s ease")
        .style("opacity", "0.9");

    return mapContainer;
}