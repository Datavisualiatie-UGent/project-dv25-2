import * as d3 from "d3";

function createMap(svg, dispatch) {
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

function createDashboard(dispatch) {
    let isDashboardOpen = false;

    function openDashboard(countryId) {
        const data = countryData[countryId] || {};

        infoPanel.html(`
            <div class="info-item">
                <h3>${data.name || "Select a country"}</h3>
                <p><strong>Capital:</strong> ${data.capital || "-"}</p>
                <p><strong>Population:</strong> ${data.population || "-"}</p>
                <p><strong>Area:</strong> ${data.area || "-"}</p>
                <p><strong>GDP:</strong> ${data.gdp || "-"}</p>
            </div>
        `);

        if (!isDashboardOpen) {
            dashboard.style("transform", "translateX(0)");
            isDashboardOpen = true;
        }
    }

    function closeDashboard() {
        isDashboardOpen = false;
        dashboard.style("transform", "translateX(100%)");
        dispatch.call("closeDashboard");
    }

    dispatch.on("openDashboard.dashboard", openDashboard);

    const dashboard = d3.create("div")
        .attr("id", "dashboard")
        .style("position", "absolute")
        .style("right", "0")
        .style("top", "0")
        .style("width", "350px")
        .style("height", "100%")
        .style("background", "rgba(245, 247, 250, 0.95)")
        .style("backdrop-filter", "blur(5px)")
        .style("box-shadow", "-5px 0 15px rgba(0,0,0,0.1)")
        .style("transform", "translateX(100%)")
        .style("transition", "transform 0.3s ease")
        .style("z-index", "10")
        .style("padding", "20px")
        .style("overflow-y", "auto");

    // Add close button
    dashboard.append("button")
        .style("position", "absolute")
        .style("top", "10px")
        .style("right", "10px")
        .style("background", "#fff")
        .style("border", "none")
        .style("width", "30px")
        .style("height", "30px")
        .style("border-radius", "50%")
        .style("cursor", "pointer")
        .style("box-shadow", "0 2px 5px rgba(0,0,0,0.2)")
        .html("×")
        .on("click", function(event, d) {
            closeDashboard()
        });

    // Add dashboard content
    dashboard.append("h2")
        .style("margin-top", "0")
        .style("color", "#2c3e50")
        .text("Country Information");

    const infoPanel = dashboard.append("div")
        .attr("class", "info-panel");

    // Sample country data (replace with your data)
    const countryData = {
        "FR": {
            name: "France",
            capital: "Paris",
            population: "67.4 million",
            area: "643,801 km²",
            gdp: "$2.9 trillion"
        },
        "DE": {
            name: "Germany",
            capital: "Berlin",
            population: "83.2 million",
            area: "357,022 km²",
            gdp: "$4.2 trillion"
        }
    };
    return dashboard;
}

export function renderMapView(svgContent) {
    // Dispatching
    const dispatch = d3.dispatch("openDashboard", "closeDashboard");

    // Create main container
    const container = d3.select("body")
        .append("div")
        .style("position", "relative")
        .style("width", "100%")
        .style("height", "100vh")
        .style("overflow", "hidden");

    // Create map container
    const mapContainer = container.append("div")
        .style("width", "100%")
        .style("height", "100%");

    mapContainer.html(svgContent);
    const svg = mapContainer.select("svg")
        .style("width", "100%")
        .style("height", "100%");

    // Create dashboard
    const dashboard = createDashboard(dispatch);
    container.append(() => dashboard.node());

    // Initialize map with dashboard control
    createMap(svg, dispatch);

    return container.node();
}