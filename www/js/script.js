setInterval(update, 1000);

const socket = new WebSocket('wss://ws.hothothot.dog:9502');

socket.addEventListener('open', function (event) {
    socket.send('Hello HotHotHot');
   });

socket.addEventListener('message', function (event) {
    console.log('Voici un message du serveur', event.data);
});

const ctx = document.getElementById('UnCharted').getContext('2d');
const UnCharted = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['1', '2', '3', '4', '5', '6'],
        datasets: [{
            label: 'Temperature Int',
            data: [12, 19, 3, 5, 2, 3],
            borderColor: '#9b59b6',
            tension: 0.3
        },
        {
            label: 'Temperature Ext',
            data: [0, 1, 2, 3, 4, 5],
            borderColor: '#2c3e50',
            tension: 0.3
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

var hist = {"time":[] ,"temp_ext":[], "temp_int":[]}

function affHist() {
    document.getElementById("now-container").style.display = 'none';
    document.getElementById("hist-container").style.display = 'flex';
}

function affNow() {
    document.getElementById("now-container").style.display = 'flex';
    document.getElementById("hist-container").style.display = 'none';
}

function getRandomInt(min, max) {
    if (min > max) {return false}
    return Math.floor(Math.random() * (max-min) + min);
}

function getData() {
    return {
        "temp_ext":{
            "timestamp": Date.now(),
            "value": getRandomInt(-10, 50)
        },
        "temp_int":{
            "timestamp": Date.now(),
            "value": getRandomInt(10, 30)
        }
    }
}

function update(event) {
    let data = getData();
    hist["time"].push( new Date( data["temp_ext"]["timestamp"]  ).toLocaleTimeString()  )
    hist["temp_ext"].push(data["temp_ext"]["value"])
    hist["temp_int"].push(data["temp_int"]["value"])

    UnCharted.data.labels = hist["time"]
    UnCharted.data.datasets[0].data = hist["temp_int"];
    UnCharted.data.datasets[1].data = hist["temp_ext"];

    document.getElementById("temp-ext").getElementsByTagName("h1")[0].innerHTML = data["temp_ext"]["value"] + "°C";
    document.getElementById("temp-ext").getElementsByTagName("b")[0].innerHTML = Math.min.apply(Math, hist["temp_ext"]) + "°C";
    document.getElementById("temp-ext").getElementsByTagName("b")[1].innerHTML = Math.max.apply(Math, hist["temp_ext"]) + "°C";
    

    Math.max(hist["temp_int"])
    Math.min(hist["temp_int"])
    document.getElementById("temp-int").getElementsByTagName("h1")[0].innerHTML = data["temp_int"]["value"] + "°C";
    document.getElementById("temp-int").getElementsByTagName("b")[0].innerHTML = Math.min.apply(Math, hist["temp_int"]) + "°C";
    document.getElementById("temp-int").getElementsByTagName("b")[1].innerHTML = Math.max.apply(Math, hist["temp_int"]) + "°C";

    UnCharted.update();
}

document.getElementById("now").addEventListener("click", affNow);
document.getElementById("hist").addEventListener("click", affHist);