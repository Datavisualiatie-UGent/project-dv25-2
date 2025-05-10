---
toc: false
title: Data-visualizing journey through Europe
theme: dark
---

```js
// Load general data
const svgContent = await FileAttachment("data/europe.svg").text();
const eu_countries = await FileAttachment("data/eu_countries.json").json();
const flags = await FileAttachment("data/flags.json").json();
```

```js
const mothertongue = await FileAttachment("data/questions/question_D48a.json").json(); // mothertongue
const percentage_bilingual = await FileAttachment("data/questions/question_D48f_2ndmtongues.json").json(); // bilangual percentage
const languages_amount = await FileAttachment("data/questions/question_D48count.json").json(); // amount languages
const second_language = await FileAttachment("data/questions/question_D48b.json").json(); // 2nd language
const politics_left_right = await FileAttachment("data/questions/question_D1.json").json(); // left-right politics
const education = await FileAttachment("data/questions/question_D8c.json").json(); // education
const age = await FileAttachment("data/questions/question_D11R.json").json(); // age
const living = await FileAttachment("data/questions/question_D25.json").json(); // living situation
const bills = await FileAttachment("data/questions/question_D60.json").json(); // bills
const household_class = await FileAttachment("data/questions/question_D63.json").json(); // household class
const direction_life = await FileAttachment("data/questions/question_D73_4.json").json(); // direction of life
const discuss_national_pol = await FileAttachment("data/questions/question_D71_1.json").json(); // discuss national politics
const direction_national = await FileAttachment("data/questions/question_D73_1.json").json(); // direction of national politics
const democracy_national = await FileAttachment("data/questions/question_SD18a.json").json(); // democracy national
const voice_national = await FileAttachment("data/questions/question_D72_2.json").json(); // voice in national politics
const discuss_eu_pol = await FileAttachment("data/questions/question_D71_2.json").json(); // discuss EU politics
const direction_eu = await FileAttachment("data/questions/question_D73_2.json").json(); // direction of EU
const democracy_eu = await FileAttachment("data/questions/question_SD18b.json").json(); // democracy EU
const voice_eu = await FileAttachment("data/questions/question_D72_1.json").json(); // voice in EU
const voice_country_eu = await FileAttachment("data/questions/question_D72_3.json").json(); // voice in country EU
const language_learning_advantages = await FileAttachment("data/questions/question_QB2.json").json(); // language learning advantages
const language_situation = await FileAttachment("data/questions/question_QB3.json").json(); // language situation
const language_importance = await FileAttachment("data/questions/question_QB1b.json").json(); // language importance
const language_methods = await FileAttachment("data/questions/question_QB4b.json").json(); // language learning methods
const discourage_learning = await FileAttachment("data/questions/question_QB5.json").json(); // discourage learning
const encourage_learning = await FileAttachment("data/questions/question_QB6.json").json(); // encourage learning
const often_use_first = await FileAttachment("data/questions/question_SD3_1.json").json(); // how often do you use first other language
const often_use_second = await FileAttachment("data/questions/question_SD3_2.json").json(); // how often do you use second other language
const often_use_third = await FileAttachment("data/questions/question_SD3_3.json").json(); // how often do you use third other language
const location_use_first = await FileAttachment("data/questions/question_SD4a.json").json(); // where do you use first other language
const location_use_second = await FileAttachment("data/questions/question_SD4b.json").json(); // where do you use second other language
const location_use_third = await FileAttachment("data/questions/question_SD4c.json").json(); // where do you use third other language
const location_use_mother = await FileAttachment("data/questions/question_SD4d.json").json(); // where do you use mother language
const question_Q48f_ru = await FileAttachment("data/questions/question_Q48f_ru.json").json();
const question_Q48f_fr = await FileAttachment("data/questions/question_Q48f_fr.json").json();
const question_Q48f_es = await FileAttachment("data/questions/question_Q48f_es.json").json();
const question_Q48f_de = await FileAttachment("data/questions/question_Q48f_de.json").json();
const question_Q48f_en = await FileAttachment("data/questions/question_Q48f_en.json").json();
const question_D15a = await FileAttachment("data/questions/question_D15a.json").json();
const question_QB4a = await FileAttachment("data/questions/question_QB4a.json").json();
```

<div class="header">
    <h1>Data-Visualizing Journey Through Europe</h1>
    <div class="subtitle">Exploring the EU's linguistic and political landscape</div>
</div>

<div class="data-source">
    <strong>Data source:</strong> Special Eurobarometer 540 (2023), European Commission
</div>

<div class="intro">
    <h2>Introduction</h2>
    <p>Europe's rich tapestry of cultures, languages, and political landscapes makes it one of the world's most fascinating regions to explore through data. This project reveals the continent's diversity through interactive visualizations. From the Nordic fjords to the Mediterranean coast, each nation tells its own story through numbers and patterns. Let's discover what makes each country unique and how they come together in the European Union.</p>
    <p>This project aims to provide a comprehensive overview of the EU's linguistic and political landscape, showcasing the diversity of languages spoken, the political spectrum, and the various factors that shape public opinion across member states. This is all based on the survey conducted by the European Commission, which gathered insights from citizens across the EU.</p>
</div>

<div class="visualization-section">
    <div class="visualization-header">Map View: Exploring the EU's Geographical and Cultural Diversity</div>
    <div class="visualization-content">
        <p>Europe is a tapestry of cultures, languages, and histories, each nation contributing its own unique identity to the European Union. This interactive map invites you to explore the geographical and cultural diversity across EU member states.</p>
        <p>By navigating through the regions, you'll uncover key differences in language, political landscapes, and societal values that shape each country's role within the EU. Hover over countries to reveal insights—whether it's the prevalence of multilingualism, shifting political sentiments, or regional perspectives on European unity.</p>
        <p>This visualization not only highlights contrasts but also underscores the shared connections that bind the EU together. Use the filters to compare specific aspects, such as dominant languages or political leanings, and discover how geography influences national identity within the union.</p>
    </div>
</div>

```js
// Mapview
// Load the questions for mapview
const mapViewQuestions = [
    mothertongue,
    percentage_bilingual,
    languages_amount,
    second_language,
    politics_left_right,
    education,
    age,
    living,
    bills,
    household_class
];
import {renderMapView} from "./components/mapView/mapView.js";

display(renderMapView(svgContent, mapViewQuestions, eu_countries));
```

<div class="visualization-section">
    <div class="visualization-header">Stacked Bar Chart: Political Landscape of the EU</div>
    <div class="visualization-content">
        <p>While the EU claims to be a democratic union that connects its member states, the thoughts about the direction of national and EU politics are not always the same in each member state.</p>
        <p>The following stacked bar chart visualizes the differences in satisfaction with the direction of life, national politics, and EU politics. Each category represents the level of satisfaction with these three aspects. The different colors represent the spectrum of satisfaction levels, ranging from <span class="highlight">very satisfied</span> to <span class="highlight">very dissatisfied</span>.</p>
        <p class="chart-note">Hover over each segment to view exact percentages. Use the legend to toggle between different satisfaction levels.</p>
    </div>
</div>

```js
// Barview
// Load the questions for barview
const barViewQuestions = [
    direction_life,
    discuss_national_pol,
    direction_national,
    democracy_national,
    voice_national,
    discuss_eu_pol,
    direction_eu,
    democracy_eu,
    voice_eu,
    voice_country_eu
];
import {renderBarView} from "./components/barView/barView.js";

display(renderBarView(barViewQuestions, eu_countries, flags));
```

<div class="visualization-section">
    <div class="visualization-header">Radar Chart: The usage of languages in the EU</div>
    <div class="visualization-content">
        <p>Not only political engagement in Europe comes with a variety of perspectives, but also the usage of languages differs greatly from person to person in regards to origin, age and other demografic factors.</p>
        <p>The following radar chart visualizes the differences in the usage of languages in the EU. Each axis represents a different aspect of habits, opinions and situations regarding the usage of languages.</p>
        <p>By selecting different questions one can compare the literal shape of a certain demographic group.</p>
    </div>
</div>

```js
// Radarview
// Load questions for radarview
const radarViewQuestions = [
    language_learning_advantages,
    language_situation,
    encourage_learning,
    often_use_first,
    often_use_second,
    often_use_third,
    location_use_first,
    location_use_second,
    location_use_third,
    location_use_mother
];
import {renderRadarView} from "./components/radarView/radarView.js";

display(renderRadarView(radarViewQuestions, eu_countries));
```

<div class="visualization-section">
    <div class="visualization-header">Bubble Chart: Language Learning in the EU</div>
    <div class="visualization-content">
        <p>Language learning is a crucial aspect of the EU's cultural and linguistic diversity. The following bubble chart visualizes the differences in language learning across EU member states.</p>
        <p>The visualization uses bubbles to represent survey responses about language learning habits and attitudes. Each bubble's <span class="highlight">size corresponds to the number of people</span> who gave that particular response, allowing quick identification of the most common perspectives across Europe.</p>
        <p class="chart-note">Interact with the chart: Hover over bubbles for details, click to filter by country, or use the legend to focus on specific categories.</p>
    </div>
</div>

```js
// Bubbleview
// Load the questions for bubbleview
const bubbleViewQuestions = [
    language_learning_advantages,
    language_situation,
    language_importance,
    language_methods,
    discourage_learning,
    encourage_learning,
];
import {renderBubbleView} from "./components/bubbleView/bubbleView.js";

display(renderBubbleView(bubbleViewQuestions, eu_countries));
```

```js
const timelineQuestions = [
    question_QB4a,
    language_methods,
    discourage_learning,
    encourage_learning,
    languages_amount,
    question_Q48f_ru,
    question_Q48f_fr,
    question_Q48f_es,
    question_Q48f_de,
    question_Q48f_en,
    bills,
    language_learning_advantages,
    language_situation,
    question_D15a
];
import {renderTimelineView} from "./components/timelineView/timelineView.js";

display(renderTimelineView(timelineQuestions, flags));
```

<style>
    body {
        font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        line-height: 1.6;
        color: #e0e0e0;
        margin: 0 auto;
        padding: 20px;
        background-color: #1a1a1a;
    }

    .header {
        text-align: center;
        margin-bottom: 40px;
        padding-bottom: 20px;
        border-bottom: 1px solid #2d2d2d;
    }

    .header h1 {
        font-size: 2.5rem;
        color: #ffffff;
        margin-left: 25%;
        margin-bottom: 10px;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 1px;
        text-shadow: 0 1px 3px rgba(0,0,0,0.2);
        
    }

    .header .subtitle {
        font-size: 1.1rem;
        color: #aaaaaa;
        font-style: italic;
    }

    .data-source {
        background-color: #252525;
        padding: 15px;
        border-radius: 6px;
        margin: 20px 0;
        font-size: 0.9rem;
        color: #a0c4e0;
        border-left: 3px solid #4a90e2;
    }

    .intro {
        font-size: 1.1rem;
        margin-bottom: 30px;
        padding: 25px;
        background-color: #252525;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        white-space: collapse;
    }

    .intro p {
    }

    .visualization-section {
        margin: 40px 0;
        background-color: #252525;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #333;
    }

    .visualization-header {
        background-color: #333;
        color: #ffffff;
        padding: 16px 25px;
        font-size: 1.3rem;
        font-weight: 500;
    }

    .visualization-content {
        padding-left: 25px;
    }

    .visualization-content p {
        margin-bottom: 16px;
        color: #e0e0e0;
    }
</style>
