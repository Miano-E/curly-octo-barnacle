const chartOptions = {
    responsive: true,
    
    scales: {
        x: {
            ticks: {
                color: '#333'
            },
            title: {
                display: true,
                color: '#000'
            }
        },
        y: {
            ticks: {
                color: '#333'
            },
            title: {
                display: true,
                color: '#333'
            }
        }
    },
    plugins: {
        legend: {
            labels: {
                color: '#000'
            }
        },
        tooltip: {
            titleColor: '#fff', 
            bodyColor: '#fff'
        }
    }
};


const ctxMonthlyEggProduction = document.getElementById('monthlyEggProductionChart').getContext('2d');
const monthlyEggProductionChart = new Chart(ctxMonthlyEggProduction, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Eggs Produced',
            data: [],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.3)',
            borderWidth: 1,
            fill: true,
            tension: 0.1
        }]
    },
    options: {
        ...chartOptions,
        scales: {
            ...chartOptions.scales,
            y: {
                ...chartOptions.scales.y,
                title: {
                    display: true,
                    text: 'Number of Eggs'
                }
            },
            x: {
                ...chartOptions.scales.x,
                title: {
                    display: true,
                    text: 'Months'
                }
            }
        }
    }
});

fetch('./includes/fetch_records.php?type=monthly_eggs')
    .then(response => response.json())
    .then(data => {
        const eggCounts = data.map(record => record.total_eggs);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        monthlyEggProductionChart.data.labels = months;
        monthlyEggProductionChart.data.datasets[0].data = eggCounts;
        monthlyEggProductionChart.update();
    });



const ctxMonthlySales = document.getElementById('monthlySalesChart').getContext('2d');
const monthlySalesChart = new Chart(ctxMonthlySales, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Sales (Kshs)',
            data: [],
            backgroundColor: [
                '#FF5733', '#C70039', '#900C3F', '#581845', '#FF6F61', '#9C27B0', '#673AB7', '#3F51B5', 
                '#2196F3', '#00BCD4', '#009688', '#4CAF50'
            ],
            borderColor: '#FFF',
            borderWidth: 1,
            hoverBackgroundColor: '#FFD700'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Sales in Kshs'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Months'
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
            }
        },
        barPercentage: 1.25,
        categoryPercentage: 0.9 
    }
});
fetch('./includes/fetch_records.php?type=monthly_sales')
    .then(response => response.json())
    .then(data => {
        const salesAmounts = new Array(12).fill(0);

        // Map the data received from the server to the correct month
        data.forEach(record => {
            const monthIndex = record.sale_month - 1;  // Adjust for zero-based index (Jan = 0, Dec = 11)
            salesAmounts[monthIndex] = record.total_sales;
        });

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        monthlySalesChart.data.labels = months;
        monthlySalesChart.data.datasets[0].data = salesAmounts;
        monthlySalesChart.update();
    })
    .catch(error => console.error('Error fetching sales data:', error));





const ctxFeedConsumption = document.getElementById('feedConsumptionChart').getContext('2d');
const feedConsumptionChart = new Chart(ctxFeedConsumption, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Feed Consumed (kg)',
            data: [],
            borderColor: '#FF5722',
            backgroundColor: 'rgba(255, 87, 34, 0.3)',
            borderWidth: 1,
            fill: true,
            tension: 0.1
        }]
    },
    options: {
        ...chartOptions,
        scales: {
            ...chartOptions.scales,
            y: {
                ...chartOptions.scales.y,
                title: {
                    display: true,
                    text: 'Feed Consumed (kg)'
                }
            },
            x: {
                ...chartOptions.scales.x,
                title: {
                    display: true,
                    text: 'Months'
                }
            }
        }
    }
});
fetch('./includes/fetch_records.php?type=monthly_feed')
    .then(response => response.json())
    .then(data => {
        const feedConsumed = data.map(record => record.total_feed);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        feedConsumptionChart.data.labels = months;
        feedConsumptionChart.data.datasets[0].data = feedConsumed;
        feedConsumptionChart.update();
    });

    

// Load the Google Charts library
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(fetchAndDrawChart);

function fetchAndDrawChart() {
    // Fetch data from the backend
    fetch('/EPMS/includes/fetch_records.php?type=employee_roles')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {

            if (data.length === 0) {
                console.error('No data found');
                return;
            }

            // Map the data to format compatible with Google Charts
            const chartDataArray = [['Role', 'Salary']];
            data.forEach(record => {
                chartDataArray.push([record.employee_role, parseFloat(record.employee_salary)]);
            });

            // Convert array to DataTable format required by Google Charts
            const chartData = google.visualization.arrayToDataTable(chartDataArray);

            // Set chart options
            const options = {
                is3D: true,
                colors: [
                    '#66bb6a',
                    '#ffa726', 
                    '#42a5f5',  
                    '#ab47bc',  
                    '#ef5350', 
                    '#ffeb3b', 
                    '#8d6e63', 
                    '#26c6da', 
                    '#d4e157', 
                    '#B0C4DE' 
                ],
                fontSize: 12,
                chartArea: {
                    width: '90%', 
                    height: '80%'  
                },
                legend: { position: 'right' }
            };

            // Draw the pie chart
            const chart = new google.visualization.PieChart(document.getElementById('employeeRolesChart'));
            chart.draw(chartData, options);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
}
