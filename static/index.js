// Define variables to store the temperature values
let setTemp = 20.00;
let currentTemp = 20.00;
//Define for chart start time
let startTime = 0;

// Define a variable to store the timer for waiting after input
let inputTimer = null;

let temperatureData = [];
let timeLabels = [];


// Define a function to handle temperature changes
function changeTemperature() {
  let mainOptions = document.querySelector('.main-unit-options');
  let secondaryOptions = document.querySelector('.second-unit-options');
  let mainUnit = mainOptions.options[
    mainOptions.selectedIndex
  ].textContent.toLowerCase();
  let secondUnit = secondaryOptions.options[
    secondaryOptions.selectedIndex
  ].textContent.toLowerCase();
  
  // Define a function to format the input value with two decimal places
function formatInputValue(inputElement) {
  let value = parseFloat(inputElement.value);
  if (!isNaN(value)) {
    inputElement.value = value.toFixed(2);
  }
}
  // Add event listeners for the 'blur' event on the input fields
  document.getElementById('main-unit').addEventListener('blur', (event) => {
    formatInputValue(event.target);
  });

  document.getElementById('second-unit').addEventListener('blur', (event) => {
    formatInputValue(event.target);
  });

  // Get the input value and convert to a number
  let numberTyped = parseFloat(document.getElementById('main-unit').value);
   // Clamp the input value between -20 and 200
   if (numberTyped < -20) {
    numberTyped = -20;
    document.getElementById('main-unit').value = numberTyped.toFixed(2);
  } else if (numberTyped > 200) {
    numberTyped = 200;
    document.getElementById('main-unit').value = numberTyped.toFixed(2);
  }
  
  if (mainUnit === 'celsius') {
    if (secondUnit === 'kelvin') {
      setTemp = numberTyped + 273.15;
    } else if (secondUnit === 'fahrenheit') {
      setTemp = (numberTyped * 9) / 5 + 32;
    } else {
      setTemp = numberTyped;
    }
  } else if (mainUnit === 'kelvin') {
    if (secondUnit === 'celsius') {
      setTemp = numberTyped - 273.15;
    } else if (mainUnit === 'fahrenheit') {
      setTemp = ((numberTyped - 273.15) * 9) / 5 + 32;
    } else {
      setTemp = numberTyped;
    }
  } else if (mainUnit === 'fahrenheit') {
    if (secondUnit === 'celsius') {
      setTemp = ((numberTyped - 32) * 5) / 9;
    } else if (secondUnit === 'kelvin') {
      setTemp = ((numberTyped - 32) * 5) / 9 + 273.15;
    } else {
      setTemp = numberTyped;
    }
  }
  
  // If the input timer is running, clear it
  if (inputTimer !== null) {
    clearTimeout(inputTimer);
  }
  
  //add
  let currentTyped = parseFloat(document.getElementById('second-unit').value);
  // Clamp the input value between -20 and 200
  if (currentTyped < -20) {
    currentTyped = -20;
    document.getElementById('second-unit').value = currentTyped.toFixed(2);
  } else if (currentTyped > 200) {
    currentTyped = 200;
    document.getElementById('second-unit').value = currentTyped.toFixed(2);
  }

  // Start a new timer to check for temperature changes
  inputTimer = setTimeout(() => {
    // Get the current temperature and convert to a number
    let currentTyped = parseFloat(document.getElementById('second-unit').value);
    

    // If the temperatures are different, start a loop to change the current temperature gradually
   if (currentTyped !== setTemp) {
      // Define variables for the loop
      let test=setTemp - currentTyped;
      
      let increment = (setTemp - currentTyped) /30.00; // Change in temperature for each step
      console.log('Increment:', increment); 
      let delay = 300; // Delay between steps (in ms)
      let counter = 0; // Counter for the loop
      
      // Define a function to change the temperature and update the display
      function updateTemperature() {
      // Calculate the remaining steps
      const remainingSteps = 100 - counter;
      // Calculate the remaining temperature difference
      const remainingDiff = setTemp - currentTyped;
       // Generate a random number between -1 and 1, then multiply it by a scale factor
      const scaleFactor = 2 * Math.abs(remainingDiff) / remainingSteps;
      const randomIncrement = (Math.random() * 2 - 1) * scaleFactor;

      // Calculate the new temperature by adding the random increment
      const newTemp = currentTyped + randomIncrement;

      // Check if the loop has run 30 times
      if (counter >= 99) {
       // Set the temperature to the exact setTemp value
        document.getElementById('second-unit').value = setTemp.toFixed(2);
      } else {
        // Update the current temperature with the new value and continue the loop
        currentTyped = newTemp;
        document.getElementById('second-unit').value = currentTyped.toFixed(2);
        counter++;
        setTimeout(updateTemperature, delay);
      }
      }
      
      // Start the loop to change the temperature
      setTimeout(updateTemperature, delay);
    }
  }, 2200); // Wait 2.2 seconds before checking for changes
}


// Define a function to start the chart updating
function startChart() {
  chartIntervalId = setInterval(() => {
    // Fetch the current temperature value and add it to the data array
    let currentTemp = parseFloat(document.getElementById('second-unit').value);
    let currentTime = new Date();
    temperatureData.push(currentTemp);

    // Add the current time to the time labels array
    timeLabels.push(currentTime.toLocaleTimeString());

    // Update the chart with the new data and labels
    temperatureChart.data.datasets[0].data = temperatureData;
    temperatureChart.data.labels = timeLabels;
    temperatureChart.update();
  }, 1000);
}

// Define a function to stop the chart updating
function stopChart() {
  clearInterval(chartIntervalId);
}

// Add event listeners for temperature input changes
document.getElementById('main-unit').addEventListener('input', changeTemperature);
document.getElementById('second-unit').addEventListener('input', changeTemperature);

// Initialize the chart
let temperatureChart = new Chart('temperature-chart', {
  type: 'line',
  data: {
    labels:timeLabels,
    datasets: [{
      label: 'Current Temperature Diagram (°C)',
      data: temperatureData,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      fill: false
    }]
  },
  options: {
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          displayFormats: {
            minute: 'h:mm a'
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  }
});



// Add event listeners for the start and stop buttons
document.getElementById('start-chart-button').addEventListener('click', startChart);
document.getElementById('stop-chart-button').addEventListener('click', stopChart);
