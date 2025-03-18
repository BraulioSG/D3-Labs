const svg = d3.select("#chart-area").append("svg").attr("width", 400).attr("height", 400);

d3.json("data/ages.json").then(data=> {
    const ages = data.map(d => +d.age);

    const circles = svg.selectAll("circle").data(ages); 

    circles.enter().
        append("circle").
        attr("cx", (_age, idx) => (idx * 50) + 50).
        attr("cy", 200).
        attr("r", age => 2*age).
        attr("fill", age => age > 10 ? "blue" : "red" );

}).catch(error => console.error("Error while reading data"));
