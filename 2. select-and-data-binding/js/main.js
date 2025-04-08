const data = [25, 20, 15, 10, 5];

const svg = d3.select("#chart-area").append("svg").attr("width", 400).attr("height", 400);

const rects = svg.selectAll("rect").data(data); 

rects.enter().
    append("rect").
    attr("x", (_value, idx) => { return idx * 50 }).
    attr("y", (value) => { return 200 -  value } ).
    attr("width", 40).
    attr("height", (value) => { return value }).
    attr("fill", "red");
