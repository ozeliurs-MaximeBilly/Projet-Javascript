setInterval(update, 10000);

hist = {}
charthist = {}

no_data_detect = false // see if at least one message from websocket has arrived
no_data_timeout = 0 // count how many updates have run with no messages from websocket

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
    updateDisplay(event.data)
    no_data_detect == true
    console.log(event.data)
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

function updateDisplay(data) {
    data.capteurs.forEach(capt => {

        // Ajout d'element si pas de element existant
        if (document.getElementById(capt.Nom) == null) {
            if (capt.type == "Thermique") {
                console.log("Ajout d'un capt thermique")
                template = document.getElementById("temp-template")
                clone = document.importNode(template.content, true)
            } else {
                console.log("Ajout d'un capt basique")
                template = document.getElementById("basic-template")
                clone = document.importNode(template.content, true)
            }
            
            clone.firstElementChild.setAttribute("id", capt.Nom)
            clone.getElementById("title").innerHTML = capt.Nom;

            var container = document.getElementById("now-container")
            container.appendChild(clone)
        }

        // Historique
        if (hist[capt.Nom] == undefined) {
            hist[capt.Nom] = []
        }
        hist[capt.Nom].push(capt.Valeur)
        
        // Population des elements
        document.getElementById(capt.Nom).getElementsByTagName("h1")[0].innerHTML = capt.Valeur + "°C";
        document.getElementById(capt.Nom).getElementsByTagName("b")[0].innerHTML = Math.min.apply(Math, hist[capt.Nom]) + "°C";
        document.getElementById(capt.Nom).getElementsByTagName("b")[1].innerHTML = Math.max.apply(Math, hist[capt.Nom]) + "°C";


        // Update Chart

        // Add label if missing
        if (!UnCharted.data.labels.includes(capt.Timestamp)) {
            UnCharted.data.labels.push(capt.Timestamp)
        }

        // Check if Add line for new sensor
        add_line = true
        UnCharted.data.datasets.forEach(line => {
            if (line.label == capt.Nom) {
                add_line = false
            }
        });

        // If line doesent exist create it
        if (add_line) {
            UnCharted.data.datasets.push({
                label: capt.Nom,
                data: [],
                fill: false,
                borderColor: getRandomColor(), // Get random Color
                tension: 0.1
            })
        }

        // add data to the line
        UnCharted.data.datasets.forEach(line => {
            if (line.label == capt.Nom) {
                line.data.push(capt.Valeur)
            }
        });
        
    });

    UnCharted.update()
}

function update(event) { // called every 5 seconds if wss fails
    if (no_data_timeout < 5) {
        if (no_data_detect == 0) {
            no_data_timeout += 1
        }

        if (socket.readyState == 1) {
            return
        }
    }

    fetchAPIandUpdate();
    // var data = getData(); // Fake data
    // updateDisplay(data);
}

update()