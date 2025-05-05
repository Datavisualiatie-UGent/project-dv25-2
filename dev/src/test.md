# test

```js
const svgContent = await FileAttachment("data/europe.svg").text();
const container = html`<div id="map-container"></div>`;
container.innerHTML = svgContent;
display(container);
```

```js
import {renderMap} from "./components/map.js"
display(await renderMap())
```