import * as d3 from "d3";

export function renderMapView(svgContent) {
    // init map view container
    const container = d3.select("body")
        .append("div")
        .attr("id", "map-view-container");

    // init map container
    const mapContainer = container
        .append("div")
        .attr("id", "map-container");
    mapContainer.html(svgContent);
    const svg = mapContainer.select("svg");

    //init dashboard
    const dashboard = container
        .append("div")
        .attr("id", "dashboard");

    // Style paths
    const paths = svg.selectAll("path")
        .style("fill", "steelblue")
        .style("stroke", "#fff")
        .style("stroke-width", 0.5);

    // Calculate bounding box of all paths
    const [[x0, y0], [x1, y1]] = d3.extent(
        paths.nodes().flatMap(path => {
            const bbox = path.getBBox();
            return [[bbox.x, bbox.y], [bbox.x + bbox.width, bbox.y + bbox.height]];
        })
    );

    // Set up constrained zoom
    const zoom = d3.zoom()
        .scaleExtent([1, 8])
        .translateExtent([[x0, y0], [x1, y1]]) // Constrain to path bounds
        .filter(event => {
            // Only allow zoom on paths or with wheel
            return event.target.tagName === 'path' || 
                   event.type === 'wheel';
        })
        .on("zoom", (event) => {
            paths.attr("transform", event.transform);
        });

    svg.call(zoom)
       .on("dblclick.zoom", null);

    // Tooltips
    paths.on("mouseover", function() {
            d3.select(this).style("fill", "orange");
        })
        .on("mouseout", function() {
            d3.select(this).style("fill", "steelblue");
        });

    return svg.node();
}