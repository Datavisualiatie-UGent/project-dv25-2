import * as d3 from "d3";

import { createBarChart } from "./dashBoardBarChart.js";

export function initDashboard(dispatch, eu_countries, questions, color) {
    const dashboard = createDashboard();

    const closeButton = dashboard.select("button")
        .on("click", function(event, d) {
                closeDashboard()
        });

    const infoPanel = dashboard.select(".info-panel");

    function updateInfoPanel(countryId, questionId = null) {
        const countryData = eu_countries[countryId] || {};
        const questionData = questionId ? questions.find(q => q.id === questionId) : null;

        infoPanel.html(`
        <div class="info-item">
            <h3>${countryData.name || "Select a country"}</h3>
            <p><strong>Capital:</strong> ${countryData.capital || "-"}</p>
            <p><strong>Population:</strong> ${countryData.population || "-"}</p>
            <p><strong>Area:</strong> ${countryData.area || "-"}</p>
            <p><strong>GDP:</strong> ${countryData.gdp || "-"}</p>
        </div>
    `);

        if (questionData && countryId && questionData.volume_A[countryId]) {
            createBarChart(infoPanel, questionData, countryId, color);
        }
    }

    let isDashboardOpen = false;
    let selectedQuestion = null;
    let selectedCountryId = null;

    function openDashboard(countryId) {
        selectedCountryId = countryId;
        updateInfoPanel(countryId, selectedQuestion);

        if (!isDashboardOpen) {
            dashboard.style("transform", "translateX(0)");
            isDashboardOpen = true;
        }
    }

    function closeDashboard() {
        selectedCountryId = null;
        isDashboardOpen = false;
        dashboard.style("transform", "translateX(100%)");
        dispatch.call("closeDashboard");
    }

    dispatch.on("openDashboard.dashboard", openDashboard);

    dispatch.on("selectQuestion.dashboard", function(questionId) {
        selectedQuestion = questionId;
        if (isDashboardOpen) {
            openDashboard(selectedCountryId);
        }
    })

    return dashboard;
}

function createDashboard() {
    const dashboard = d3.create("div")
        .attr("id", "dashboard")
        .style("position", "absolute")
        .style("right", "0")
        .style("top", "0")
        .style("width", "50%")
        .style("height", "100%")
        .style("background", "rgba(15, 32, 39, 0.9)") // Dark blue from map bg
        .style("backdrop-filter", "blur(8px)")
        .style("border-left", "1px solid rgba(0, 255, 255, 0.3)")
        .style("transform", "translateX(100%)")
        .style("transition", "all 0.75s cubic-bezier(0.22, 1, 0.36, 1)")
        .style("z-index", "10")
        .style("padding", "25px")
        .style("overflow-x", "auto")
        .style("overflow-y", "auto")
        .style("color", "#ecf0f1")
        .style("font-family", "'Segoe UI', Roboto, sans-serif");

    // Add cyberpunk-style animated border
    dashboard.append("div")
        .style("position", "absolute")
        .style("top", "0")
        .style("left", "0")
        .style("width", "3px")
        .style("height", "100%")
        .style("background", "linear-gradient(to bottom, rgba(0,255,255,0), rgba(0,255,255,0.8), rgba(0,255,255,0))")
        .style("animation", "scanline 4s linear infinite");

    // Add close button with tech style
    dashboard.append("button")
        .style("position", "absolute")
        .style("top", "15px")
        .style("right", "15px")
        .style("background", "rgba(0, 255, 255, 0.1)")
        .style("border", "1px solid rgba(0, 255, 255, 0.3)")
        .style("width", "32px")
        .style("height", "32px")
        .style("border-radius", "50%")
        .style("cursor", "pointer")
        .style("color", "#00ffff")
        .style("font-size", "20px")
        .style("transition", "all 0.3s ease")
        .style("box-shadow", "0 0 10px rgba(0, 255, 255, 0.2)")
        .html("×")
        .on("mouseover", function() {
            d3.select(this)
                .style("background", "rgba(0, 255, 255, 0.3)")
                .style("box-shadow", "0 0 15px rgba(0, 255, 255, 0.4)");
        })
        .on("mouseout", function() {
            d3.select(this)
                .style("background", "rgba(0, 255, 255, 0.1)")
                .style("box-shadow", "0 0 10px rgba(0, 255, 255, 0.2)");
        });

    // Add dashboard header with tech font
    dashboard.append("h2")
        .style("margin-top", "0")
        .style("margin-bottom", "25px")
        .style("color", "#00ffff")
        .style("font-weight", "300")
        .style("letter-spacing", "1px")
        .style("text-shadow", "0 0 10px rgba(0, 255, 255, 0.3)")
        .style("border-bottom", "1px solid rgba(0, 255, 255, 0.2)")
        .style("padding-bottom", "10px")
        .text("COUNTRY DATA");

    const infoPanel = dashboard.append("div")
        .attr("class", "info-panel")
        .style("display", "grid")
        .style("gap", "15px");

    // Add CSS animations
    dashboard.append("style")
        .text(`
            @keyframes scanline {
                0% { background-position: 0 0; }
                100% { background-position: 0 100%; }
            }
            
            .info-item {
                background: rgba(32, 58, 67, 0.5);
                border-radius: 6px;
                padding: 15px;
                border: 1px solid rgba(0, 255, 255, 0.1);
                transition: all 0.3s ease;
            }
            
            .info-item:hover {
                background: rgba(32, 58, 67, 0.7);
                border-color: rgba(0, 255, 255, 0.3);
                box-shadow: 0 0 15px rgba(0, 255, 255, 0.1);
            }
            
            .info-item h3 {
                color: #00ffff;
                margin-top: 0;
                border-bottom: 1px dashed rgba(0, 255, 255, 0.3);
                padding-bottom: 8px;
            }
            
            .info-item p {
                margin: 8px 0;
            }
            
            .info-item strong {
                color: #4a90e2;
            }
        `);

    return dashboard;
}