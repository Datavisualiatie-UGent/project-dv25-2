import * as d3 from "../../../_node/d3@7.9.0/index.6063bdcc.js";

import {initSelectBoxContainer} from "./selectBox.243ef5b9.js";
import {createRadarChart} from "./radarChart.93dfdf1c.js";
import {createCategorySelector} from "./categorySelector.601b4dbc.js";

let categories = {};
let selectedAnswers = {};
let currentSelectedQuestion = null;
let radarChart = null;


export function renderRadarView(questions, eu_countries) {
    const dispatch = d3.dispatch("selectQuestion", "selectCategory", "selectCategoryValue");

    const container = d3.create("div")

    // Initialize the question selector (dropdown)
    const selectBoxContainer = initSelectBoxContainer(dispatch, questions);
    container.append(() => selectBoxContainer.node());

    const chartContainer = d3.create("div")
        .attr("class", "chart-container")
        .style("display", "flex")
        .style("justify-content", "center")
        .style("position", "relative")
        .style("align-items", "center")
        .style("flex-direction", "row")
        .style("border", "3px white solid")
        .style("border-radius", "10px")
        .style("top", "20px")
        .style("width", "99%")
        .style("height", "80vh")
        .style("background", "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)")
        .style("transition", "all 0.5s ease")

    container.append(() => chartContainer.node());

    // Event listener for question selection
    dispatch.on("selectQuestion", (questionId) => {
        chartContainer.selectAll("svg").remove();
        chartContainer.selectAll(".category").remove();

        const question = questions.find(q => q.id === questionId);
        if (question)
            initQuestion(question)
    });

    function initQuestion(question) {
        currentSelectedQuestion = question;
        selectedAnswers = {};
        categories = {...question.volume_B};
        categories.Countries = Object.keys(question.volume_A || {}).reduce((acc, key) => {
            if (Object.keys(eu_countries).includes(key))
                acc[eu_countries[key].name] = question.volume_A[key];
            return acc;
        }, {});
        redrawRadarChart()
        selectCategory("Countries");
    }

    // Event listener for category selection
    dispatch.on("selectCategory", (categoryName) => {
        chartContainer.selectAll(".category").remove();
        selectCategory(categoryName)

    });

    function selectCategory(categoryName) {
        const categoryValues = categories[categoryName];

        if (categoryValues) {
            selectedAnswers = {}
            const color = d3.scaleOrdinal([
                "#e6194b", "#3cb44b", "#ffe119", "#4363d8",
                "#f58231", "#911eb4", "#b6ffff", "#f032e6",
                "#bcf60c", "#fabebe", "#008080", "#e6beff",
                "#9a6324", "#fffac8", "#800000", "#aaffc3",
                "#808000", "#ffd8b1", "#000075", "#808080",
                "#ffffff", "#000000", "#a9a9a9", "#ff4500",
                "#2e8b57", "#4682b4", "#daa520", "#7b68ee",
                "#ff69b4", "#cd5c5c", "#26837a", "#1e90ff"
            ]);

            const categorySelector = createCategorySelector(dispatch, categoryValues, color);
            chartContainer.append(() => categorySelector);
            redrawRadarChart()
        }
    }


    dispatch.on("selectCategoryValue", (name, value, categoryColor, active) => {
        selectedAnswers[name] = active ? {value: value, color: categoryColor} : null;
        redrawRadarChart();
    });

    // Function to recalculate and redraw radar chart
    function redrawRadarChart() {
        // Calculate the highest value among selected answers
        const selectedPercentages = [...Object.values(selectedAnswers)
            .filter(ans => ans !== null)
            .flatMap(ans => ans.value.percentages.map(v => v * 100))]

        const maxPercentage = selectedPercentages.length > 0 ? Math.max(...selectedPercentages) : 100;
        const maxScale = Math.ceil(maxPercentage / 10) * 10 || 100;

        // Recreate the radar chart with the new scale
        chartContainer.selectAll("svg").remove();
        radarChart = createRadarChart(currentSelectedQuestion, selectedAnswers, maxScale);
        chartContainer.append(() => radarChart);
    }


    initQuestion(questions[0]);
    selectCategory("Countries");

    return container.node();
}


