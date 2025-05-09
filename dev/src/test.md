---
toc: false
---

# Mapview

```js
// Load the questions for mapview
const mothertongue = await FileAttachment("data/question_D48a.json").json(); // mothertongue
const percentage_bilingual = await FileAttachment("data/question_D48f_2ndmtongues.json").json(); // bilangual percentage
const languages_amount = await FileAttachment("data/question_D48count.json").json(); // amount languages
const second_language = await FileAttachment("data/question_D48b.json").json(); // 2nd language

const politics_left_right = await FileAttachment("data/question_D1.json").json(); // left-right politics
const education = await FileAttachment("data/question_D8c.json").json(); // education
const age = await FileAttachment("data/question_D11R.json").json(); // age
const living = await FileAttachment("data/question_D25.json").json(); // living situation
const bills = await FileAttachment("data/question_D60.json").json(); // bills
const household_class = await FileAttachment("data/question_D63.json").json(); // household class

const questions = [mothertongue, percentage_bilingual, languages_amount, second_language, politics_left_right, education, age, living, bills, household_class];
```

```js
// Load other data for mapview
const svgContent = await FileAttachment("data/europe.svg").text();
const eu_countries = await FileAttachment("data/eu_countries.json").json();
```

```js
import {renderMapView} from "./components/mapView.js";
display(renderMapView(svgContent, questions, eu_countries));
```

<style>


</style>