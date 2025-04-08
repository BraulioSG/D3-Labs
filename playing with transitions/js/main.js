const SVG_HEIGHT = 400;
const SVG_WIDTH = 400;

const margin = { left: 100, right: 10, top: 10, bottom: 100 };
const svg = d3.select("#chart-area").append("svg").attr("width", SVG_WIDTH + margin.right + margin.left).attr("height", SVG_HEIGHT + margin.top + margin.bottom);
const group = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

var x = d3.scaleBand().range([0, SVG_WIDTH]).padding(0.2);
var y = d3.scaleLinear().range([SVG_HEIGHT, 0]);
var xAxisGroup = group.append("g").attr("class", "x axis").attr("transform", `translate(0, ${SVG_HEIGHT})`);
var yAxisGroup = group.append("g").attr("class", "y-axis");
var flag = true;

var yLabel = group.append("text").attr("class", "y axis-label").
        attr("x", -(SVG_HEIGHT / 2)).
        attr("y", -60).
        attr("font-size", "20px").
        attr("text-anchor", "middle").
        attr("transform", "rotate(-90)").
        style("fill", "black").
        text(`Revenue (dlls.)`);

var xLabel = group.append("text").attr("class", "x axis-label").
        attr("x", SVG_WIDTH / 2).
        attr("y", SVG_HEIGHT + 70).
        attr("font-size", "20px").
        attr("text-anchor", "middle").
        style("fill", "black").
        text("Month");

const tran = d3.transition().duration(750)

d3.json("data/revenues.json").then(data => {
    data.forEach((d) => {
        d.revenue= +d.revenue;
        d.profit= +d.profit;
    })

    d3.interval(() => {
        var newData = flag ? data: data.slice(1);
        update(newData);
        flag = !flag;
    }, 1000);

}).catch(error => console.log(error));

function update(data){
    const value = flag ? "revenue" : "profit";
    const maxRevenue = d3.max(data, b => b.revenue);
    const names = data.map(d => d.month)

    x.domain(names);
    y.domain([0, d3.max(data, (d) => { return d[value] })]);


    var rects =group.selectAll("rect").data(data);
    rects.exit().remove()
    rects.attr("y", (d) => { return y(d[value]); }).
        attr("x", (d) => { return x(d.month); }).
        attr("height", (d) => { return SVG_HEIGHT - y(d[value]); })
    rects.enter().append("rect").
        attr("x", data => {return x(data.month)} ).
        attr("y", data => {return y(data[value])}).
        attr("width", 30).
        attr("height", data => SVG_HEIGHT - y(data[value])).
        attr("fill", "yellow");

    const xAxisCall = d3.axisBottom(x).tickValues(names);
    const yAxisCall = d3.axisLeft(y).ticks(10).tickFormat(d3.format("$.1s"));

    xAxisGroup.transition(tran).call(xAxisCall);
    yAxisGroup.transition(tran).call(yAxisCall);

    yLabel.text(`${value} (dlls.)`);
}
