setInterval(update, 5000);

hist = {}

const socket = new WebSocket('wss://ws.hothothot.dog:9502');

socket.onopen = function (event) {
    socket.send('Hello HotHotHot, I am hothothot.ozeliurs.com');
}

socket.onmessage = function(event) {
    console.log(event.data)
}

const ctx = document.getElementById('UnCharted').getContext('2d');
const UnCharted = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperature Int',
            data: [],
            borderColor: '#9b59b6',
            tension: 0.3
        },
        {
            label: 'Temperature Ext',
            data: [],
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

var hist = {}

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
    // return {
    //     "temp_ext":{
    //         "timestamp": Date.now(),
    //         "value": getRandomInt(-10, 50)
    //     },
    //     "temp_int":{
    //         "timestamp": Date.now(),
    //         "value": getRandomInt(10, 30)
    //     }
    // }
}

// function fetch() {
//     fetch("https://hothothot.dog/api/capteurs")
//         .then(response => response.json())
//         .then(data => );
//     return response
// }

function update(event) {
    console.log(socket.readyState)
    // if (socket.readyState == 1) {
    //     var data = {}
    // } else {
    //     var data = getData();
    // }

    var data = getData();
    console.log(data)
    data.capteurs.forEach(capt => {

        // Ajout d'element si pas de element existant
        if (document.getElementById(capt.Nom) == null) {

            template = document.getElementById("temp-template")
            clone = document.importNode(template.content, true)
            
            clone.firstElementChild.setAttribute("id", capt.Nom)
            clone.getElementById("title").innerHTML = capt.Nom;
            clone.getElementById("value").innerHTML = capt.Valeur;

            var container = document.getElementById("now-container")
            container.appendChild(clone)
        }

        // Historique
        if (!capt.Nom in hist) {
            hist[capt.Nom] = []
        }
        hist[capt.Nom].push(capt.Valeur)
        
        // Population des elements
        document.getElementById(capt.Nom).getElementsByTagName("h1")[0].innerHTML = capt.Valeur + "°C";
        document.getElementById(capt.Nom).getElementsByTagName("b")[0].innerHTML = Math.min.apply(Math, hist[capt.Nom]) + "°C";
        document.getElementById(capt.Nom).getElementsByTagName("b")[1].innerHTML = Math.max.apply(Math, hist[capt.Nom]) + "°C";
    });

    console.log(hist)

    // hist["time"].push( new Date( data["temp_ext"]["timestamp"] ).toLocaleTimeString() )
    // hist["temp_ext"].push(data["temp_ext"]["value"])
    // hist["temp_int"].push(data["temp_int"]["value"])

    // UnCharted.data.labels = hist["time"]
    // UnCharted.data.datasets[0].data = hist["temp_int"];
    // UnCharted.data.datasets[1].data = hist["temp_ext"];

    // document.getElementById("temp-ext").getElementsByTagName("h1")[0].innerHTML = data["temp_ext"]["value"] + "°C";
    // document.getElementById("temp-ext").getElementsByTagName("b")[0].innerHTML = Math.min.apply(Math, hist["temp_ext"]) + "°C";
    // document.getElementById("temp-ext").getElementsByTagName("b")[1].innerHTML = Math.max.apply(Math, hist["temp_ext"]) + "°C";
    

    // Math.max(hist["temp_int"])
    // Math.min(hist["temp_int"])
    // document.getElementById("temp-int").getElementsByTagName("h1")[0].innerHTML = data["temp_int"]["value"] + "°C";
    // document.getElementById("temp-int").getElementsByTagName("b")[0].innerHTML = Math.min.apply(Math, hist["temp_int"]) + "°C";
    // document.getElementById("temp-int").getElementsByTagName("b")[1].innerHTML = Math.max.apply(Math, hist["temp_int"]) + "°C";

    // UnCharted.update();
}

document.getElementById("now").addEventListener("click", affNow);
document.getElementById("hist").addEventListener("click", affHist);