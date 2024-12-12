let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
let req = new XMLHttpRequest();
let res;
let values;

req.open('GET', url, true);
req.onload = () => {
  res = JSON.parse(req.responseText);
  values = res.data;
  console.table(values);
  drawCan();
  generateSc();
  drawBars();
  generateAxes();
};
req.send();

let heightSc;
let xScale;
let xAxisScale;
let yAxisScale;

let w = 800;
let h = 600;
let pad = 40;

let svg = d3.select('svg');

let drawCan = () => {
  svg.attr('width', w);
  svg.attr('height', h);
}

let generateSc = () => {
  heightSc = d3.scaleLinear()
               .domain([0, d3.max(values, item => item[1])]) // max input value to be expected
               .range([0, h - (2 * pad)]); // range of values that data can go within
                // console.log(heightSc, "heightSc");

  xScale = d3.scaleLinear()
             .domain([0, values.length - 1]) // lowest and highest index
             .range([pad, w - pad]);

  let datesArr = values.map(item => new Date(item[0]));
  console.log(datesArr, "datesArr")

  xAxisScale = d3.scaleTime()
                 .domain([d3.min(datesArr), d3.max(datesArr)]) //smallest and highest values in dates array
                 .range([pad, w - pad]); // scale for x axis to be drawn

  yAxisScale = d3.scaleLinear()
                 .domain([0, d3.max(values, item => item[1])])
                 .range([h - pad, pad]);
}

let drawBars = () => {
  let tooltip = d3.select('body')
                  .append('div')
                  .attr('id', 'tooltip')
                  .style('visibility', 'hidden')
                  .style('width', '200px')
                  .style('height', '100px');
          
                  
  svg.selectAll('rect')
     .data(values)
     .enter()
     .append('rect')
     .attr('class', 'bar')
     .attr('width', (w - (2 * pad)) / values.length)
    //.attr('fill', 'cyan')
     .attr('data-date', item => item[0])
     .attr('data-gdp', item => item[1])
     .attr('height', item => heightSc(item[1]))
     .attr('x', (item, i) => xScale(i)) // puts values into graph albeit upside down
     .attr('y', item => (h - pad) - heightSc(item[1])) // puts data the right way round and in right place
     .on('mouseover', (event, item) => {
        // this.set('fill', 'white')
        tooltip.transition()
               .style('visibility', 'visible');
        tooltip.text(item[0] + ' $' + item[1] + ' Billion');
        document.querySelector('#tooltip').setAttribute('data-date', item[0]);
        // document.querySelector('.bar').style('background', 'white');
        tooltip.style('left', (event.pageX + 10) + 'px')
               .style('top', (event.pageY - 28) + 'px');
      })
     .on('mouseleave', item => tooltip.transition().style('visibility', 'hidden'))
}

let generateAxes = () => {
  let xAxis = d3.axisBottom(xAxisScale);

  svg.append('g')
     .call(xAxis)
     .attr('id', 'x-axis')
     .attr('transform', 'translate(0, ' + (h - pad) + ')')
     .style('color', 'darkslategrey');

  let yAxis = d3.axisLeft(yAxisScale);

  svg.append('g')
     .call(yAxis)
     .attr('id', 'y-axis')
     .attr('transform', 'translate(' + pad + ', 0)' )
     .style('color', 'darkslategrey');
}

