# test

```js
// Import the svg file
const svgContent = await FileAttachment("data/europe.svg").text();
```

```js
import {renderMap} from "./components/map.js"
display(renderMap(svgContent))
```