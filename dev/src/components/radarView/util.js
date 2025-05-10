import * as d3 from "d3";

export const wrapText = (text, max_token_length) => {
    const parts = text.split(" ");
    let lines = [];
    let line = [];

    for (const part of parts) {
        if (line.join(" ").length + part.length > max_token_length) {
            lines.push(line.join(" "));
            line = [];
        }
        line.push(part);
    }
    lines.push(line.join(" "));

    return lines;
}


export function getTextColor(backgroundColor) {
    const rgb = d3.color(backgroundColor).rgb();
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

export function generateGridLevels(maxScale) {
    const step = maxScale / 5;
    const levels = [];
    for (let i = 1; i <= 5; i++)
        levels.push(i * step);
    return levels;
}