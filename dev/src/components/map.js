import * as d3 from "d3";

export function initMapContainer(svgContent, dispatch) {
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
            clickedCountry.style("fill", "steelblue");
        }

        // Update clicked country
        path.style("fill", "#e74c3c");
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

        // Remove margin and store container width
        svg.style("margin-left", "0px");
        const originalWidth = mapContainer.style("width");
        mapContainer.style("width", "69%");


        const svgWidth = svg.node().clientWidth;
        const svgHeight = svg.node().clientHeight;

        // Add 10% padding around country
        const padding = 0.2;
        const scale = 0.9 / Math.max(
            (x1 - x0) * (1 + padding) / svgWidth,
            (y1 - y0) * (1 + padding) / svgHeight
        );

        const translate = [
            svgWidth/2 - scale * (x0 + x1)/2,
            svgHeight/2 - scale * (y0 + y1)/2
        ];

        svg.selectAll("path")
            .transition()
            .duration(750)
            .attr("transform", `translate(${translate}) scale(${scale})`);
    }

    function resetZoom() {
        const svg = d3.select("svg");
        const easing = d3.easeCubicOut;
        svg.selectAll("path")
            .transition()
            .ease(easing)
            .duration(750)
            .attr("transform", "none");

        svg
            .transition()
            .ease(easing)
            .duration(750)
            .style("margin-left", "-150px");

        mapContainer
            .transition()
            .ease(easing)
            .duration(750)
            .style("width", "99%");
    }

    function unselect_country() {
        if (clickedCountry) {
            clickedCountry.style("fill", "steelblue");
        }
        resetZoom();
        clickedCountry = null;
    }

    dispatch.on("closeDashboard.map", unselect_country);

    // Add click interaction
    paths.on("click", function(event, d) {
        click_country(d3.select(this));
    });

    return mapContainer;
}

function createMapContainer(svgContent) {
    const mapContainer = d3.create("div")
        .style("width", "99%")
        .style("height", "99%")
        .style("overflow", "hidden")
        .style("border", "2px solid #2c3e50")
        .style("overflow", "hidden")
        .style("position", "relative");



    mapContainer.html(svgContent);
    const svg = mapContainer.select("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("width", "100%")
        .style("height", "100%")
        .style("margin-left", "-150px");


    const paths = svg.selectAll("path")
        .style("fill", "steelblue")
        .style("stroke", "#fff")
        .style("stroke-width", 0.5)
        .style("cursor", "pointer")
        .style("transition", "fill 0.2s");

    return mapContainer;
}