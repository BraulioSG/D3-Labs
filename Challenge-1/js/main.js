const SVG_HEIGHT = 400;
const SVG_WIDTH = 400;
const svg = d3.select("#chart-area").append("svg").attr("width",SVG_WIDTH).attr("height",SVG_HEIGHT);

d3.json("data/buildings.json").then(data => {


    let heights = data.map(building => +building.height);
    let max = heights[0];
    heights.forEach(h => {
        if(h > max) max = h;
    });

    const scaleFactor = SVG_HEIGHT / max; //svg height
    const spacing = 5;
    const barWidth = (SVG_WIDTH - (spacing * (heights.length - 1))) / heights.length;
 
    heights = heights.map(h => h * scaleFactor);
    console.log(heights);

    const rects = svg.selectAll("rect").data(heights);
    rects.enter().append("rect").
        attr("x", (_height, idx) => {return idx * (barWidth + spacing)}).
        attr("y", height => {return SVG_HEIGHT - height }).
        attr("width", barWidth).
        attr("height", height => height).
        attr("fill", "red");

}).catch(error => console.error(error));
