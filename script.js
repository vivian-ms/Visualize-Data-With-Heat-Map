const resource = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
const w = 1250;
const h = 400;
const xPadding = 75;
const yPadding = 80;
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const colors = [
  '#0080ff',
  '#2a95d4',
  '#55aaaa',
  '#7fbf7f',
  '#aad455',
  '#d4e92a',
  '#ffff00',
  '#ffd400',
  '#ffaa00',
  '#ff7f00',
  '#ff5500',
  '#ff2a00',
  '#ff0000'
]  // Source: http://www.zonums.com/online/color_ramp/


window.onload = () => {
  fetch(resource)
    .then(response => response.json())
    .then(data => {
      document.querySelector('#yr_range').innerHTML = `${d3.min(data.monthlyVariance, d => d.year)} - ${d3.max(data.monthlyVariance, d => d.year)}`;
      document.querySelector('#baseTemp').innerHTML = `${data.baseTemperature}°C`;
      createCanvas(data);
    })
    .catch(err => {
      console.log(`Error: ${err}`);
    });
};  // End window.onload()


function createCanvas(data) {
  let svg = d3.select('#svg_container')
              .append('svg')
              .attr('width', w + 2 * xPadding)
              .attr('height',h + 2 * yPadding)
              .append('g')
              .attr('transform', `translate(${xPadding}, ${yPadding / 5})`);

  createBars(svg, data);
}  // End createCanvas()


function createBars(svg, {baseTemperature, monthlyVariance}) {
  let minYr = d3.min(monthlyVariance, d => new Date(`${d.year} 00:00`));
  let maxYr = d3.max(monthlyVariance, d => new Date(`${d.year} 00:00`));
  let bar_width = w / (maxYr.getFullYear() - minYr.getFullYear() + 1);

  let xScale = d3.scaleTime()
                 .domain([minYr, maxYr])
                 .range([0, w]);
  let yScale = d3.scaleBand()
                 .domain(monthlyVariance.map(d => months[d.month - 1]))
                 .range([0, h]);

  let colorScale = d3.scaleQuantize()
                    .domain([
                      d3.min(monthlyVariance, d => baseTemperature + d.variance),
                      d3.max(monthlyVariance, d => baseTemperature + d.variance)])
                    .range(colors);

  let tooltip = d3.select('#svg_container')
                  .append('div')
                  .attr('id', 'tooltip')
                  .style('opacity', 0);

  svg.selectAll('rect')
    .data(monthlyVariance)
    .enter()
    .append('rect')
    .attr('x', d => xScale(new Date(`${d.year} 00:00`)))
    .attr('y', d => yScale(months[d.month - 1]))
    .attr('width', bar_width)
    .attr('height', yScale.bandwidth())
    .attr('fill', d => colorScale(baseTemperature + d.variance))
    .attr('stroke', 'lightgrey')
    .attr('stroke-width', 0.06)
    .attr('data-year', d => d.year)
    .attr('data-month', d => d.month - 1)
    .attr('data-temp', d => baseTemperature + d.variance)
    .classed('cell', true)
    .on('mouseover', (evt, d) => {
      let variance = d.variance < 0 ? `${(d.variance).toFixed(2)}` : `+${(d.variance).toFixed(2)}`;

      d3.select(evt.currentTarget).transition()
        .duration(50)
        .attr('stroke', 'black')
        .attr('stroke-width', 1);

      tooltip.transition()
             .duration(50)
             .style('opacity', 1)
             .style('left', `${d3.select(evt.currentTarget).attr('x')}px`)
             .style('top', `${d3.select(evt.currentTarget).attr('y') - 50}px`);
      tooltip.attr('data-year', d.year)
             .html(`${months[d.month - 1]} ${d.year} <br /> ${(baseTemperature + d.variance).toFixed(2)}°C (${variance}°C)`);
    })
    .on('mouseout', (evt, d) => {
      d3.select(evt.currentTarget).transition()
        .duration(50)
        .attr('stroke', 'lightgrey')
        .attr('stroke-width', 0.06);

      tooltip.transition()
             .duration(50)
             .style('opacity', 0);
    });

  createAxes(svg, xScale, yScale);
}  // End createBars()


function createAxes(svg, xScale, yScale) {
  let xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y')).ticks(d3.timeYear.every(10));
  svg.append('g')
     .attr('id', 'x-axis')
     .attr('transform', `translate(0, ${h})`)
     .call(xAxis);

  let yAxis = d3.axisLeft(yScale);
  svg.append('g')
     .attr('id', 'y-axis')
     .call(yAxis);
}  // End createAxes()
