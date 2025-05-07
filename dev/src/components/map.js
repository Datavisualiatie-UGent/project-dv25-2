import * as d3 from "d3";

export function initMapContainer(svgContent, dispatch) {
    const mapContainer = createMapContainer(svgContent);
    const svg = mapContainer.select("svg");
    const paths = svg.selectAll("path");

    let clickedCountry = null;

    function click_country(path) {
        const countryId = path.attr("id");

        // If clicking the same country, do nothing
        if (clickedCountry?.attr("id") === countryId) {
            return;
        }

        // Reset previous country's color
        if (clickedCountry) {
            clickedCountry.style("fill", "steelblue");
        }

        // Update clicked country
        path.style("fill", "#e74c3c");
        clickedCountry = path;

        // Trigger dashboard
        dispatch.call("openDashboard", path, countryId);
    }

    function unselect_country() {
        if (clickedCountry) {
            clickedCountry.style("fill", "steelblue");
        }
        clickedCountry = null;
    }

    dispatch.on("closeDashboard.map", unselect_country);

    // Add click interaction
    paths.on("click", function(event, d) {
        click_country(d3.select(this));
    })

    return mapContainer;
}

function createMapContainer(svgContent) {
    const mapContainer = d3.create("div")
        .style("width", "100%")
        .style("height", "100%");

    mapContainer.html(svgContent);
    const svg = mapContainer.select("svg")
        .style("width", "100%")
        .style("height", "100%");

    const paths = svg.selectAll("path")
        .style("fill", "steelblue")
        .style("stroke", "#fff")
        .style("stroke-width", 0.5)
        .style("cursor", "pointer")
        .style("transition", "fill 0.2s");

    return mapContainer;
}