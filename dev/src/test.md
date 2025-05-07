---
toc: false

---

# test

```js
// Import the svg file
const svgContent = await FileAttachment("data/europe.svg").text();
```

```js
import {renderMapView} from "./components/mapView.js";
display(renderMapView(svgContent))
```