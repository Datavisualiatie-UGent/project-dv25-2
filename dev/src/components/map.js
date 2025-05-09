import * as d3 from "d3";

const DEFAULT_FILL = "#3a3a3a";
const EU_FILL = "#253b82";
const CLICKED_FILL = "#00ffff";
const HOVER_STROKE_WIDTH = "2px";
const DEFAULT_STROKE_WIDTH = "0.5px";

export function initMapContainer(svgContent, dispatch, questions, eu) {
    const mapContainer = createMapContainer(svgContent, eu);
    const svg = mapContainer.select("svg");
    const paths = svg.selectAll("path");

    let clickedCountry = null;
    let selectedQuestion = null;
    let currentColor = null;
    let selectedAnswer = null;

    function getFillColor(countryId) {
        if (selectedQuestion) {

            const data = selectedQuestion["volume_A"];
            const countryData = data[countryId];

            if (selectedAnswer) {
                const answerIndex = selectedQuestion["answers"].indexOf(selectedAnswer);
                if (countryData) {
                    const value = countryData["values"] ? countryData["values"][answerIndex] : 0;
                    return d3.scaleSequential()
                        .domain([0, Math.max(...Object.values(data).slice(1).map(countryData => countryData["values"][answerIndex] || [0]))])
                        .interpolator(d3.interpolateBlues)(value);
                }
            }

            if (selectedQuestion["type"] === "categorical") {
                if (countryData) {
                    const maxIndex = countryData.values.reduce((iMax, x, i, arr) =>
                        x > arr[iMax] ? i : iMax, 0);
                    return currentColor(selectedQuestion["answers"][maxIndex]);
                }
            } else {
                if (countryData) {
                    const percentage = countryData["percentages"] ? countryData["percentages"][0] : 0;
                    return d3.scaleSequential()
                        .domain([0, Math.max(...Object.values(data).flatMap(countryData => countryData["percentages"] || [0]))])
                        .interpolator(d3.interpolateBlues)(percentage);
                }
            }
        }
        return eu.has(countryId) ? EU_FILL : DEFAULT_FILL;
    }

    function click_country(path) {
        const countryId = path.attr("id");

        // If clicking the same country, do nothing
        if (clickedCountry?.attr("id") === countryId) return;

        // Reset previous country's color
        if (clickedCountry) {
            clickedCountry
                .style("fill", function() {
                    const countryId = clickedCountry.attr("id");
                    return getFillColor(countryId);
                })
                .style("filter", "none")
                .style("stroke-width", DEFAULT_STROKE_WIDTH);
        }

        // Update clicked country
        path.style("fill", CLICKED_FILL);
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

        svg
            .style("margin-left", "-40%")

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
            .style("stroke-width", DEFAULT_STROKE_WIDTH)
    }

    function unselect_country() {
        if (clickedCountry) {
            clickedCountry
                .style("fill", function() {
                    const countryId = clickedCountry.attr("id");
                    return getFillColor(countryId);
                })
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

            if (countryId === clickedCountry?.attr("id")) return;

            if (countryId && data[countryId]) {
                const countryData = data[countryId];
                const maxIndex = countryData.values.reduce((iMax, x, i, arr) =>
                    x > arr[iMax] ? i : iMax, 0);

                path.style("fill", currentColor(answers[maxIndex]));
            } else {
                // Handle countries with no data
                path.style("fill", DEFAULT_FILL); // Gray for no data
            }
        });
    }

    function updateMapSequential(maxValue, answerIndex, data, isPercentage = false) {
        const colorScale = d3.scaleSequential()
            .domain([0, maxValue])
            .interpolator(d3.interpolateBlues);

        paths.each(function() {
            const path = d3.select(this);
            const countryId = path.attr("id"); // Get country ID from path attribute

            if (countryId && data[countryId]) {
                const countryData = data[countryId];
                const value = isPercentage
                    ? (countryData["percentages"] ? countryData["percentages"][answerIndex] : 0)
                    : (countryData["values"] ? countryData["values"][answerIndex] : 0);

                path.style("fill", colorScale(value));
            } else {
                // Handle countries with no data
                path.style("fill", DEFAULT_FILL); // Gray for no data
            }
        });
    }

    function updateMap() {

        if (!selectedQuestion) {
            // default fill
            paths.each(function() {
                const path = d3.select(this);
                const countryId = path.attr("id"); // Get country ID from path attribute
                path.style("fill", getFillColor(countryId));
            });
            return;
        }

        const answers = selectedQuestion["answers"];
        const data = selectedQuestion["volume_A"];
        const type = selectedQuestion["type"];

        if (!selectedQuestion || !answers || !data) return;

        if (selectedAnswer) {
            const answerIndex = answers.indexOf(selectedAnswer);
            const maxValue = Math.max(
                ...Object.values(data)
                    .slice(1)
                    .map(countryData => countryData["values"][answerIndex] || 0)
            );

            updateMapSequential(maxValue, answerIndex, data);

            return;
        }

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
                path.style("fill", DEFAULT_FILL); // Gray for no data
            }
        });
    }


    dispatch.on("selectQuestion.map", function(questionId, color) {
        selectedQuestion = questions.find(q => q.id === questionId) || null;
        currentColor = color;
        selectedAnswer = null;
        updateMap();
    });

    dispatch.on("selectAnswer.map", function(answer) {
        selectedAnswer = answer;
        updateMap();
    })

    // Add click interaction
    paths.on("click", function(event, d) {
        const countryId = d3.select(this).attr("id");
        if (eu.has(countryId)) {
            click_country(d3.select(this));
        }
    })
    .on("mouseover", function() {
        const countryId = d3.select(this).attr("id");
        if (eu.has(countryId) && (!clickedCountry || clickedCountry.attr("id") !== countryId)) {
            d3.select(this)
                .style("filter", "url(#hover-glow)")
                .style("stroke", "white")
                .style("stroke-width", HOVER_STROKE_WIDTH);
        }
    })
    .on("mouseout", function() {
        const countryId = d3.select(this).attr("id");
        if (eu.has(countryId) && (!clickedCountry || clickedCountry.attr("id") !== countryId)) {
            d3.select(this)
                .style("filter", "none")
                .style("stroke", "white")
                .style("stroke-width", DEFAULT_STROKE_WIDTH);
        }
        });

    return mapContainer;
}

function createMapContainer(svgContent, eu) {
    const mapContainer = d3.create("div")
        .style("width", "99%")
        .style("height", "99%")
        .style("overflow", "hidden")
        .style("position", "relative")
        .style("border", "3px white solid")
        .style("border-radius", "10px")
        .style("background", "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)")
        .style("transition", "all 0.5s ease")
        .style("transform-style", "preserve-3d");

    mapContainer.html(svgContent);
    const svg = mapContainer.select("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "100%")
        .style("margin-left", "-150px")

    // Add SVG filters for high-tech effects
    const defs = svg.append("defs");

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

    const paths = svg.selectAll("path")
        .style("fill", function() {
            const countryId = d3.select(this).attr("id");
            return eu.has(countryId) ? EU_FILL : DEFAULT_FILL;
        })
        .style("stroke", "white")
        .style("stroke-width", DEFAULT_STROKE_WIDTH)
        .style("cursor", function() {
            const countryId = d3.select(this).attr("id");
            return eu.has(countryId) ? "pointer" : "default";
        })
        .style("transition", "all 0.3s ease")
        .style("opacity", "0.9");

    return mapContainer;
}