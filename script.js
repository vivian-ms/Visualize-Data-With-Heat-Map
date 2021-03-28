const resource = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';


window.onload = () => {
  fetch(resource)
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(err => {
      console.log(`Error: ${err}`);
    });
};  // End window.onload()