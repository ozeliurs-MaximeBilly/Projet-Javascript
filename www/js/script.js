const ctx = document.getElementById('UnCharted').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['1', '2', '3', '4', '5', '6'],
        datasets: [{
            label: 'Temperature Int',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: '#9b59b6'
        },
        {
            label: 'Temperature Ext',
            data: [0, 1, 2, 3, 4, 5],
            borderColor: '#2c3e50'
        },
    ]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});