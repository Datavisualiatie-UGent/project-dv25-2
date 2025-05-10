import * as d3 from "d3";

const DEFAULT_TEXT = "";

export function initSelectBoxContainer(dispatch, questions) {
    // Create a container for the select box and title
    const container = d3.create("div")
        .style("display", "flex")
        .style("position", "relative")
        .style("align-items", "center")
        .style("justify-content", "center")
        .style("flex-direction", "column");

    const questionSelectBox = createSelectbox(questions);
    container.append(() => questionSelectBox.node());

    const categorySelectBox = createAnswerSelectbox(questions[0]);
    container.append(() => categorySelectBox.node());


    const title = container.append("div")
        .style("font-size", "35px")
        .style("height", "50px")
        .text("");

    // Add event listener for select box change
    questionSelectBox.on("change", function () {
        const selectedValue = d3.select(this).property("value");
        console.log(selectedValue)
        if (selectedValue) {
            const question = questions.find(q => q.id === selectedValue);
            populateQuestionSelectBox(question);
            return;
        }
        title.text(DEFAULT_TEXT);
        dispatch.call("selectQuestion", this, null);
        categorySelectBox.style("display", "none");
    });

    categorySelectBox.on("change", function () {
        const selectedValue = d3.select(this).property("value");
        dispatch.call("selectCategory", this, selectedValue);
    })

    function createAnswerSelectbox(question) {
        let categories = question.volume_B
        categories.Countries = question.volume_A

        const categorySelectBox = d3.create("select")
            .style("position", "absolute")
            .style("top", "150px")
            .style("left", "20px")
            .style("padding", "10px")
            .style("width", "200px")
            .style("z-index", "10")

        categorySelectBox.selectAll("option.answer-option")
            .data(Object.keys(categories))
            .enter()
            .append("option")
            .attr("class", "answer-option")
            .attr("value", d => d)
            .text(d => d);
        // Make the second select box visible
        categorySelectBox.style("display", "block");

        categorySelectBox.property("value", "Countries");
        dispatch.call("selectCategory", this, "Countries");


        return categorySelectBox;
    }

    function createSelectbox(questions) {
        const selectBox = d3.create("select")
            .style("position", "absolute")
            .style("top", "100px")
            .style("left", "20px")
            .style("padding", "10px")
            .style("width", "300px")
            .style("z-index", "10");

        // Add options to the selection box
        selectBox.selectAll("option.question-option")
            .data(questions)
            .enter()
            .append("option")
            .attr("selected", d => d.id === questions[0].id ? true : null)
            .attr("class", "question-option")
            .attr("value", d => d.id)
            .text(d => d.title || `Question ${d.id}`);

        return selectBox;
    }

    function populateQuestionSelectBox(question) {
        const titleText = question.title;

        // Update the title text
        title.text(titleText);
        // Dispatch the event with the selected question
        dispatch.call("selectQuestion", this, question.id);
        categorySelectBox.property("value", "Countries");
    }


    populateQuestionSelectBox(questions[0]);

    return container;
}





