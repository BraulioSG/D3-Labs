const SVG_HEIGHT = 400;
const SVG_WIDTH = 400;

const margin = { left: 100, right: 10, top: 10, bottom: 100 };
const svg = d3.select("#chart-area").append("svg").attr("width", SVG_WIDTH + margin.right + margin.left).attr("height", SVG_HEIGHT + margin.top + margin.bottom);

const group = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

d3.json("data/buildings.json").then(data => {
 //b = building
    const maxHeight = d3.max(data, b => b.height);
    const names = data.map(b => b.name);

    const x = d3.scaleBand().domain(names).range([0,400]).paddingInner(0.3).paddingOuter(0.3);
    const y = d3.scaleLinear().domain([0, maxHeight]).range([400, 0]);

    const rects =group.selectAll("rect").data(data);
    rects.enter().append("rect").
        attr("x", building => {return x(building.name)} ).
        attr("y", building => {return y(building.height)}).
        attr("width", 30).
        attr("height", building => SVG_HEIGHT - y(building.height)).
        attr("fill", "grey");

    const xAxisCall = d3.axisBottom(x).tickValues(names);
    const yAxisCall = d3.axisLeft(y).ticks(10);

    group.append("g").attr("class", "bottom axis").
        attr("transform", `translate(0, ${SVG_HEIGHT})`).
        call(xAxisCall).
        selectAll("text").
        attr("y", "10").
        attr("x", "3").
        attr("text-anchor", "end").
        attr("font-size" ,"9px").
        attr("transform", "rotate(-30)");

    group.append("g").attr("class", "y axis").
        call(yAxisCall).
        selectAll("text").
        attr("y", "10").
        attr("x", "-3").
        attr("text-anchor", "end");

    group.append("text").attr("class", "y axis-label").
        attr("x", -(SVG_HEIGHT / 2)).
        attr("y", -60).
        attr("font-size", "20px").
        attr("text-anchor", "middle").
        attr("transform", "rotate(-90)").
        style("fill", "black").
        text("Height (m)");

    group.append("text").attr("class", "x axis-label").
        attr("x", SVG_WIDTH / 2).
        attr("y", SVG_HEIGHT + 95).
        attr("font-size", "20px").
        attr("text-anchor", "middle").
        style("fill", "black").
        text("The world's tallest buildings");

}).catch(error => console.log(error));



