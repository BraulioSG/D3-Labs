const SVG_HEIGHT = 400;
const SVG_WIDTH = 600;

const margin = { left: 100, right: 10, top: 10, bottom: 100 };
const svg = d3.select("#chart-area").append("svg").attr("width", SVG_WIDTH + margin.right + margin.left).attr("height", SVG_HEIGHT + margin.top + margin.bottom);

const group = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

var x = d3.scaleLog().domain([142, 150000]).range([0, SVG_WIDTH]);
var y = d3.scaleLinear().domain([0,90]).range([0, SVG_HEIGHT]);
var a = d3.scaleLinear().domain([200,1400000000]).range([25*Math.PI, 1500*Math.PI]);
var c = d3.scaleOrdinal().range(["#FFADADEE", "#FFD6A5", "#CAFFBF", "#9BF6FF", "#BDB2FF"])

var yAxisGroup = group.append("g").attr("class", "y-axis");
var xAxisGroup = group.append("g").attr("class", "x-axis").
    attr("transform", `translate(0, ${SVG_HEIGHT})`);

var yLabel = group.append("text").attr("class", "y axis-label").
        attr("x", -(SVG_HEIGHT / 2)).
        attr("y", -60).
        attr("font-size", "20px").
        attr("text-anchor", "middle").
        attr("transform", "rotate(-90)").
        style("fill", "black").
        text(`Life expectancy (years)`);

var xLabel = group.append("text").attr("class", "x axis-label").
        attr("x", SVG_WIDTH / 2).
        attr("y", SVG_HEIGHT + 70).
        attr("font-size", "20px").
        attr("text-anchor", "middle").
        style("fill", "black").
        text("GDP per capita ($)");

var yearLabel = group.append("text").attr("class", "y axis-label").
        attr("x", SVG_WIDTH - 60).
        attr("y", SVG_HEIGHT - 10).
        attr("font-size", "40px").
        attr("text-anchor", "middle").
        style("fill", d3.rgb(220,220,250)).
        text(`0000`);

const tran = d3.transition().duration(750)


d3.json("data/data.json").then(function(data){
    let idx = 0; 
    const formattedData = data.map((year) => {

        return year["countries"].filter((country) => {

            var dataExists = (country.income && country.life_exp);

            return dataExists

        }).map((country) => {

            country.income = +country.income;

            country.life_exp = +country.life_exp;

            return country;

	    })
    });

    var legend = group.append("g").
        attr("transform", `translate(${SVG_WIDTH - 10}, ${SVG_HEIGHT - 125})`);

    var continents = ["europe", "asia", "americas", "africa"];
    continents.forEach((continent, i) => {

        var legendRow = legend.append("g")
            .attr("transform", `translate(${SVG_WIDTH - 30},  ${SVG_HEIGHT - 80 - i * 20})`);

        legendRow.append("rect").
            attr("width", 10).
            attr("height", 10).
            attr("fill",c(continent));

        legendRow.append("text").
            attr("x", -10).
            attr("y", 10).
            attr("text-anchor", "end").
            style("text-transform", "capitalize")
            .text(continent);

    });

    d3.interval(() => {
        yearLabel.text(data[idx].year);
        update(formattedData[idx]);
        idx = (idx + 1)%data.length;
    },1000)
})

function update(data){
    var circles = group.selectAll("circle").data(data);
    circles.exit().transition(tran).remove();


    circles.transition(tran).
        attr("cx", (d) => { return x(d.income) }).
        attr("cy", (d) => {return y(d.life_exp) }).
        attr("r", (d) => {return Math.sqrt(a(d.population) / Math.PI) }).
        attr("fill", (d) => {return c(d.continent) });

    circles.enter().append("circle").attr("class", "enter").transition(tran).
        attr("cx", (d) => { return x(d.income) }).
        attr("cy", (d) => {return y(d.life_exp) }).
        attr("r", (d) => {return Math.sqrt(a(d.population) / Math.PI) }).
        attr("fill", (d) => {return c(d.continent) });


    const yAxisCall = d3.axisLeft(y);
    const xAxisCall = d3.axisBottom(x).tickValues([400, 4000, 40000]).tickFormat(d3.format("$"));
    xAxisGroup.call(xAxisCall);
    yAxisGroup.call(yAxisCall);
}
