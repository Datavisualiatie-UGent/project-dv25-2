---
toc: false
title: A data-visualizing journey through Europe
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
```

<div class="europe-container">
  <h1 class="europe-title">A Data-Visualizing Journey Through Europe</h1>

<p class="europe-source">
    <em>Data source: Special Eurobarometer 540 (2023), European Commission</em>
  </p>

  <p class="europe-intro">
    Europe's rich tapestry of cultures, languages, and political landscapes makes it one of the world's most fascinating regions to explore through data. This project reveals the continent's diversity through interactive visualizations.
  </p>

  <p class="europe-intro">
    From the Nordic fjords to the Mediterranean coast, each nation tells its own story through numbers and patterns. Let's discover what makes each country unique and how they come together in the European Union.
  </p>
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

<style>
  .europe-container {
    margin: 0 auto;
    padding: 0 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-wrap: balance;
    text-align: center;
  }
  .europe-title {
    max-width: none;
    color: #253b82;
    text-align: center;
    margin-bottom: 1rem;
    font-size: 2rem;
  }
  .europe-intro {
    max-width: none;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }
  .europe-section {
    max-width: none;
    margin: 2rem 0;
  }
  .europe-subtitle {
    max-width: none;
    color: #253b82;
    border-bottom: 2px solid #00ffff;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    font-size: 1.4rem;
  }
  .europe-highlight {
    max-width: none;
    font-weight: bold;
    color: #253b82;
  }
  .europe-divider {
    border: 0;
    height: 1px;
    background: #ddd;
    margin: 2rem 0;
  }
  .europe-callout {
    max-width: none;
    font-weight: bold;
    text-align: center;
    margin: 1.5rem 0;
  }
  .europe-source {
    max-width: none;
    font-size: 0.9rem;
    color: #666;
    text-align: center;
    margin-top: 2rem;
  }

.map-container {
    margin: 0 auto;
    padding: 0 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    text-wrap: balance;
    text-align: center;
  }
</style>
