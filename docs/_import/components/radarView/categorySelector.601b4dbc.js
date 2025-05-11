import * as d3 from "../../../_node/d3@7.9.0/index.6063bdcc.js";
import {getTextColor} from "./util.52236b97.js";

// Function to create a country selector
export function createCategorySelector(dispatch, categoryValues, color) {
    const container = d3.create("div")
        .attr("class", "category")
        .style("position", "absolute")
        .style("right", "80px")
        .style("display", "flex")
        .style("flex-wrap", "wrap")       // Allow buttons to wrap to the next line
        .style("justify-content", "center") // Center horizontally
        .style("gap", "8px")
        .style("z-index", 10)
        .style("min-width", "300px")
        .style("max-width", "300px");

    Object.keys(categoryValues).forEach(category => {
        const categoryColor = color(category);

        container.append("button")
            .text(category)
            .attr("class", "country-button")
            .style("padding", "8px 12px")
            .style("font-size", "14px")
            .style("background-color", "transparent") // Transparent background
            .style("color", categoryColor)            // Text matches border color
            .style("border", `2px solid ${categoryColor}`) // Border color
            .style("border-radius", "4px")
            .style("cursor", "pointer")
            .style("max-width", "200px")
            .style("transition", "all 0.3s ease") // Smooth hover effect
            .on("click", function () {
                const isActive = d3.select(this).classed("active");
                toggleButtonState(d3.select(this), categoryColor, !isActive);
                dispatch.call("selectCategoryValue", this, category, categoryValues[category], categoryColor, !isActive)
            })
            .on("mouseover", function () {
                d3.select(this)
                    .style("transform", "scale(1.05)")
            })
            .on("mouseout", function () {
                d3.select(this)
                    .style("transform", "scale(1)")
            });
    });

    return container.node();
}

// Function to toggle button state (active/inactive)
function toggleButtonState(button, color, isActive) {
    if (isActive) {
        button.classed("active", true)
            .style("background-color", color)
            .style("color", getTextColor(color))
    } else {
        button.classed("active", false)
            .style("background-color", "transparent")
            .style("color", color)
    }
}


