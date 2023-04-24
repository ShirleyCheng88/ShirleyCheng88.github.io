document.addEventListener('DOMContentLoaded', function() {
  const ctx = document.getElementById('myChart').getContext('2d');
  const data = {
      labels: [],
      datasets: [{
          label: 'Random Values',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0.3
      }]
  };

  const config = {
      type: 'line',
      data: data,
      options: {
          plugins: {
              tooltip: {
                  callbacks: {
                      title: function(tooltipItems) {
                          const date = new Date(tooltipItems[0].parsed.x);
                          return date.toLocaleString();
                      }
                  }
              }
          },
          scales: {
              x: {
                  type: 'time',
                  display: true,
                  title: {
                      display: true,
                      text: 'Time',
                      color: '#000',
                      font: {
                          size: 14
                      }
                  },
                  time: {
                      unit: 'second',
                      displayFormats: {
                          second: 'h:mm:ss a'
                      }
                  }
              },
              y: {
                  display: true,
                  title: {
                      display: true,
                      text: 'Random Value',
                      color: '#000',
                      font: {
                          size: 14
                      }
                  },
                  min: -5,
                  max: 5
              }
          }
      }
  };

  const myChart = new Chart(ctx, config);

  function getRandomValue(min, max) {
      return Math.random() * (max - min) + min;
  }

  function addData() {
      const now = new Date();
      data.labels.push(now);
      data.datasets[0].data.push(getRandomValue(-5, 5));

      // Remove data points older than 60 seconds to keep the chart clean
      const cutoffTime = new Date(now.getTime() - 60000);
      while (data.labels[0] < cutoffTime) {
          data.labels.shift();
          data.datasets[0].data.shift();
      }

      myChart.update();
  }

  setInterval(addData, 1000);
});
