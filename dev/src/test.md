---
toc: false
---

# Mapview

```js
// Load the questions for mapview
const question1 = await FileAttachment("data/question_D48count.json").json(); // amount languages
const question2 = await FileAttachment("data/question_D48f_2ndmtongues.json").json(); // bilangual percentage
const question3 = await FileAttachment("data/question_D48b.json").json(); // 2nd language
const questions = [question1, question2, question3];
```

```js
// Import the svg file
const svgContent = await FileAttachment("data/europe.svg").text();
```

```js
import {renderMapView} from "./components/mapView.js";
display(renderMapView(svgContent, questions))
```