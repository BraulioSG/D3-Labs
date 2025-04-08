const SVG_HEIGHT = 400;
const SVG_WIDTH = 400;
const svg = d3.select("#chart-area").append("svg").attr("width",SVG_WIDTH).attr("height",SVG_HEIGHT);

d3.json("data/buildings.json").then(data => {
    //b = building
    const maxHeight = d3.max(data, b => b.height);

    const x = d3.scaleBand().domain(data.map(b => b.name)).range([0,400]).paddingInner(0.3).paddingOuter(0.3);
    const y = d3.scaleLinear().domain([0, maxHeight]).range([0, 400]);

    const rects = svg.selectAll("rect").data(data);
    rects.enter().append("rect").
        attr("x", building => {return x(building.name)} ).
        attr("y", building => {return SVG_HEIGHT - y(building.height) }).
        attr("width", 30).
        attr("height", building => y(building.height)).
        attr("fill", "red");


}).catch(error => console.error(error));
