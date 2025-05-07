import * as d3 from "d3";

export function createMap(svg, dispatch) {
    let clickedCountry = null;

    const paths = svg.selectAll("path")
        .style("fill", "steelblue")
        .style("stroke", "#fff")
        .style("stroke-width", 0.5)
        .style("cursor", "pointer")
        .style("transition", "fill 0.2s");

    function click_country(path) {
        const countryId = path.attr("id");

        // Remove highlight from previous country
        if (clickedCountry) {
            clickedCountry.style("fill", "steelblue");
        }

        // Do nothing if clicked on the same country
        if (clickedCountry && clickedCountry.attr("id") === countryId) {
            clickedCountry = null;
            return;
        }

        // Highlight selected country
        path.style("fill", "#e74c3c");
        clickedCountry = path;

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
}