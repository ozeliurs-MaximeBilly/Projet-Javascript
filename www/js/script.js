if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then(() => { console.log("Service Worker Registered"); });
}

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
    document.getElementById("hist").classList = "button primary";
    document.getElementById("now").classList = "button";
}

function affNow() {
    document.getElementById("now-container").style.display = 'flex';
    document.getElementById("hist-container").style.display = 'none';
    document.getElementById("now").classList = "button primary";
    document.getElementById("hist").classList = "button";
}

function changeNotif() {
    if (!('Notification' in window)) {
        console.log("Ce navigateur ne prend pas en charge les notifications.");
    }
    else if (Notification.permission !== "granted") {
        Notification.requestPermission();

        //document.getElementById("notif").style.display = "none";
    }
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
            "value": getRandomInt(-50, 60)
        }
    }
}

function updateTempLabels(data) {
    if (data["temp_ext"]["value"] > 35){
        document.getElementById("temp-ext").getElementsByTagName("h5")[1].innerHTML = "Hot Hot Hot !";
        document.getElementById("temp-ext").getElementsByTagName("h5")[1].style.color = "red";
    }
    else if (data["temp_ext"]["value"] < 0) {
        document.getElementById("temp-ext").getElementsByTagName("h5")[1].innerHTML = "Banquise en vue !";
        document.getElementById("temp-ext").getElementsByTagName("h5")[1].style.color = "blue";
    }
    else {
        document.getElementById("temp-ext").getElementsByTagName("h5")[1].innerHTML = "";
    }

    if (data["temp_int"]["value"] > 22 && data["temp_int"]["value"] <= 50){
        document.getElementById("temp-int").getElementsByTagName("h5")[1].innerHTML = "Baissez le chauffage !";
        document.getElementById("temp-int").getElementsByTagName("h5")[1].style.color = "orange";
    }
    else if (data["temp_int"]["value"] > 50){
        document.getElementById("temp-int").getElementsByTagName("h5")[1].innerHTML = "Appelez les pompiers ou arrêtez votre barbecue !";
        document.getElementById("temp-int").getElementsByTagName("h5")[1].style.color = "red";
    }
    else if (data["temp_int"]["value"] < 12 && data["temp_int"]["value"] >= 0){
        document.getElementById("temp-int").getElementsByTagName("h5")[1].innerHTML = "Montez le chauffage ou mettez un gros pull  !";
        document.getElementById("temp-int").getElementsByTagName("h5")[1].style.color = "cyan";
    }
    else if (data["temp_int"]["value"] < 0){
        document.getElementById("temp-int").getElementsByTagName("h5")[1].innerHTML = "Canalisations gelées, appelez SOS plombier et mettez un bonnet !";
        document.getElementById("temp-int").getElementsByTagName("h5")[1].style.color = "blue";
    }
    else {
        document.getElementById("temp-int").getElementsByTagName("h5")[1].innerHTML = "";
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

    updateTempLabels(data);

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
document.getElementById("notif").addEventListener("click", changeNotif);
