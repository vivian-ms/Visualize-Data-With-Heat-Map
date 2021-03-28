const resource = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';
const w = 1250;
const h = 400;
const xPadding = 75;
const yPadding = 80;
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


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
}


function createBars(svg, {baseTemperature, monthlyVariance}) {
  let xScale = d3.scaleTime()
                 .domain([
                   d3.min(monthlyVariance, d => new Date(`${d.year} 00:00`)),
                   d3.max(monthlyVariance, d => new Date(`${d.year} 00:00`))
                 ])
                 .range([0, w]);
  let yScale = d3.scaleBand()
                 .domain(monthlyVariance.map(d => months[d.month - 1]))
                 .range([0, h]);
}  // End createBars()
