import ChartSubscriber from '/js/chart-subsciber-class.js';
import LabelsSubscriber from '/js/labels-subsciber-class.js';
import NowSubscriber from '/js/now-subsciber-class.js';
import Subscriber from '/js/subsciber-class.js';
import Publisher from '/js/publisher-class.js';


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then(() => { console.log("Service Worker Registered"); });
}

setInterval(update, 10000);

let hist = {}
let wss = false;
let no_data_detect = false; // see if at least one message from websocket has arrived
let no_data_timeout = 0; // count how many updates have run with no messages from websocket
let chart_length = 20;

// utility functions
function getRandomInt(min, max) {
    if (min > max) {return false}
    return Math.floor(Math.random() * (max-min) + min);
}

function getData() {
    return {
        "HotHotHot":"Api v1.0",
        "capteurs":[
            {
                "type":"Thermique",
                "Nom":"interieur",
                "Valeur": getRandomInt(-10, 50),
                "Timestamp": Date.now()
            },
            {
                "type":"Thermique",
                "Nom":"exterieur",
                "Valeur": getRandomInt(-10, 50),
                "Timestamp": Date.now()
            }
        ]
    }
}

function* entries(obj) {
    for (let key of Object.keys(obj)) {
        yield [key, obj[key]];
    }  
}

function getRandomColor() {
    colors = [
        "#1abc9c",
        "#16a085",
        "#f1c40f",
        "#f39c12",
        "#2ecc71",
        "#27ae60",
        "#e67e22",
        "#d35400",
        "#3498db",
        "#2980b9",
        "#e74c3c",
        "#c0392b",
        "#9b59b6",
        "#8e44ad",
        "#ecf0f1",
        "#bdc3c7",
        "#34495e",
        "#2c3e50",
        "#95a5a6",
        "#7f8c8d"
    ]
    return colors[Math.floor(Math.random() * colors.length)]
}


// Socket connection
const socket = new WebSocket('wss://ws.hothothot.dog:9502');

socket.onopen = function (event) {
    socket.send('Hello HotHotHot, I am hothothot.ozeliurs.com');
}

socket.onmessage = function(event) {
    if (wss){
        updateDisplay(event.data)
        no_data_detect = true
        console.log(event.data)
    }
}

// Hide/Visibility Buttons
document.getElementById("now").addEventListener("click", event => {
    document.getElementById("now-container").style.display = 'flex';
    document.getElementById("hist-container").style.display = 'none';
    document.getElementById("now").classList = "button primary";
    document.getElementById("hist").classList = "button";
}); // affNow()

document.getElementById("hist").addEventListener("click", event => {
    document.getElementById("now-container").style.display = 'none';
    document.getElementById("hist-container").style.display = 'flex';
    document.getElementById("hist").classList = "button primary";
    document.getElementById("now").classList = "button";
});

document.getElementById("notif").addEventListener("click", event => {

    if (!('Notification' in window)) {
        console.log('Ce navigateur ne prend pas en charge la notification de bureau')
    }
    
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission()
        .then((permission) => {
            if (permission === 'granted') {
                const notification = new Notification('Hothothot', {
                    body: 'Notifications activées !',
                    icon: '/icons/webIcon.png'
                })
            }
        })
    }
})

document.getElementById("temp-type").addEventListener("click", event => {
    if (document.getElementById("temp-type").innerHTML === "WSS") {
        document.getElementById("temp-type").innerHTML = "FETCH";
        wss = false;
    } else {
        document.getElementById("temp-type").innerHTML = "WSS";
        wss = true;
    }
})

function notify(message) {
    if (!('Notification' in window)) { return }
    
    if (Notification.permission !== 'granted') { return }

    new Notification('Hothothot', {
        body: message,
        icon: '/icons/webIcon.png'
    })
}


// Chart Config
const ctx = document.getElementById('UnCharted').getContext('2d');
const UnCharted = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


function fetchAPIandUpdate() {
    fetch("https://hothothot.dog/api/capteurs")
    .then(response => {
        if (!response.ok) {
            throw new Error(`Request failed with status ${reponse.status}`)
        }
        return response.json()
    })
    .then(data => {
        updateDisplay(data);
    })
    .catch(error => console.log(error))
}

function update(event) { // called every 10 seconds checks if wss fails

    if (!wss) {fetchAPIandUpdate()}
    
    //var data = getData(); // Fake data
    //updateDisplay(data);
}

document.addEventListener('DOMContentLoaded', event => {
    // Get data from localstorage
    local_hist = localStorage.getItem("hist")
    if (local_hist) {
        console.log("Read history from localstorage !")
        hist = JSON.parse(local_hist)
    }

    let chart = new ChartSubscriber();
    let now = new NowSubscriber();
    let labels = new LabelsSubscriber();
    let publisher = new Publisher();
    publisher.subscribe(chart)
    publisher.subscribe(now)
    publisher.subscribe(labels)

    update()
})