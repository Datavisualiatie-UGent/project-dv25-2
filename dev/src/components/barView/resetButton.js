import * as d3 from "d3";

export function initResetButton(dispatch) {
    const resetButtonContainer = d3.create("div")
        .style("position", "relative")

    const resetButton = createResetButton();

    resetButton.on("click", () => {
        // Dispatch the reset event
        dispatch.call("resetBarView");
        resetButton.style("display", "none");
    });

    dispatch.on("selectBar", () => {
        resetButton.style("display", "block");
    })

    resetButtonContainer.append(() => resetButton.node());

    return resetButtonContainer;
}

function createResetButton() {
    const resetButton = d3.create("div")
        .attr("class", "reset-button")
        .style("position", "absolute")
        .style("top", "-66vh")
        .style("right", "18px")
        .style("z-index", "10")
        .style("cursor", "pointer");

    // Button container
    resetButton.append("div")
        .attr("class", "reset-button-container")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "8px")
        .style("padding", "12px 16px")
        .style("background", "#ffffff")
        .style("border-radius", "8px")
        .style("box-shadow", "0 2px 8px rgba(0,0,0,0.1)")
        .style("transition", "all 0.2s ease")
        .style("border", "1px solid #e0e0e0")
        .on("mouseover", function() {
            d3.select(this)
                .style("background", "#f8f8f8")
                .style("box-shadow", "0 2px 12px rgba(0,0,0,0.15)");
        })
        .on("mouseout", function() {
            d3.select(this)
                .style("background", "#ffffff")
                .style("box-shadow", "0 2px 8px rgba(0,0,0,0.1)");
        })
        .on("mousedown", function() {
            d3.select(this).style("transform", "scale(0.98)");
        })
        .on("mouseup", function() {
            d3.select(this).style("transform", "scale(1)");
        });

    // Icon (using text as icon for simplicity)
    resetButton.select(".reset-button-container")
        .append("div")
        .style("font-size", "16px")
        .style("color", "#555")
        .text("↻");

    // Text
    resetButton.select(".reset-button-container")
        .append("div")
        .style("font-size", "14px")
        .style("font-weight", "500")
        .style("color", "#333")
        .text("Reset View");

    resetButton.style("display", "none");

    return resetButton;
}