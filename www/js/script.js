if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js")
    .then(function() { console.log("Service Worker Registered"); });
}


setInterval(update, 10000);


let hist = {};
let wss = false;
let chart_length = 30;
let uncharted;


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
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}


function updateTempLabels(data) {
    if (data.Nom == "exterieur") {
        if (data.Valeur > 35){
            document.getElementById("exterieur").getElementsByTagName("h5")[1].style.visibility = "visible";
            document.getElementById("exterieur").getElementsByTagName("h5")[1].innerHTML = "Hot Hot Hot !";
            notify("Hot Hot Hot !")
            document.getElementById("exterieur").getElementsByTagName("h5")[1].style.color = "red";
        } else if (data.Valeur < 0) {
            document.getElementById("exterieur").getElementsByTagName("h5")[1].style.visibility = "visible";
            document.getElementById("exterieur").getElementsByTagName("h5")[1].innerHTML = "Banquise en vue !";
            notify("Banquise en vue !")
            document.getElementById("exterieur").getElementsByTagName("h5")[1].style.color = "blue";
        } else {
            document.getElementById("exterieur").getElementsByTagName("h5")[1].style.visibility = "hidden";
            // document.getElementById("exterieur").getElementsByTagName("h5")[1].innerHTML = "";
        }
    }

    if (data.Nom == "interieur") {
        if (data.Valeur > 22 && data.Valeur <= 50) {
            document.getElementById("interieur").getElementsByTagName("h5")[1].style.visibility = "visible";
            document.getElementById("interieur").getElementsByTagName("h5")[1].innerHTML = "Baissez le chauffage !";
            notify("Baissez le chauffage !")
            document.getElementById("interieur").getElementsByTagName("h5")[1].style.color = "orange";
        }
        else if (data.Valeur > 50) {
            document.getElementById("interieur").getElementsByTagName("h5")[1].style.visibility = "visible";
            document.getElementById("interieur").getElementsByTagName("h5")[1].innerHTML = "Appelez les pompiers ou arrêtez votre barbecue !";
            notify("Appelez les pompiers ou arrêtez votre barbecue !")
            document.getElementById("interieur").getElementsByTagName("h5")[1].style.color = "red";
        } else if (data.Valeur < 12 && data.Valeur >= 0) {
            document.getElementById("interieur").getElementsByTagName("h5")[1].style.visibility = "visible";
            document.getElementById("interieur").getElementsByTagName("h5")[1].innerHTML = "Montez le chauffage ou mettez un gros pull  !";
            notify("Montez le chauffage ou mettez un gros pull  !")
            document.getElementById("interieur").getElementsByTagName("h5")[1].style.color = "cyan";
        } else if (data.Valeur < 0) {
            document.getElementById("interieur").getElementsByTagName("h5")[1].style.visibility = "visible";
            document.getElementById("interieur").getElementsByTagName("h5")[1].innerHTML = "Canalisations gelées, appelez SOS plombier et mettez un bonnet !";
            notify("Canalisations gelées, appelez SOS plombier et mettez un bonnet !")
            document.getElementById("interieur").getElementsByTagName("h5")[1].style.color = "blue";
        }
        else {
            document.getElementById("interieur").getElementsByTagName("h5")[1].style.visibility = "hidden";
            // document.getElementById("interieur").getElementsByTagName("h5")[1].innerHTML = "";
        }
    }
}


// Definition des classes
class graph {
    constructor() {
        this.UnCharted = new Chart(
            document.getElementById("UnCharted").getContext("2d"), {
            type: "line",
            data: {
                labels: [],
                datasets: []
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                parsing: {
                    xAxisKey: "x",
                    yAxisKey: "y"
                }
            }
        });

        this.data = {}
    } // constructor()

    addData(label, x_data, y_data) {
        if (this.data[x_data] == undefined) {
            this.data[x_data] = {};
            if (Object.keys(this.data).length >= chart_length) {
                delete this.data[Object.keys(this.data).sort()[0]]
            }
            //this.trim()
        }

        if (this.data[x_data][label] == undefined) {
            this.data[x_data][label] = y_data;
        }
    } // addData()

    line(label) {
        let add_line = true;
        this.UnCharted.data.datasets.forEach((line) => {
            if (line.label === label) {
                add_line = false;
            }
        });

        // If line doesent exist create it
        if (add_line) {
            this.UnCharted.data.datasets.push({
                label: label,
                data: [],
                fill: false,
                borderColor: getRandomColor(), // Get random Color
                tension: 0.1
            })
        }
    } // line()

    setValues(label, lst) {
        this.UnCharted.data.datasets.forEach((line) => {
            if (line.label === label) {
                line.data = lst;
            }
        });
    }

    update() {
        this.labels = []
        this.datasets = {}

        // Get all the labels
        this.UnCharted.data.labels = []
        Object.keys(this.data).sort().forEach((x_data) => {
                this.UnCharted.data.labels.push(new Date(x_data * 1000).toLocaleTimeString())
            }
        )
        this.x_values = Object.keys(this.data).sort();

        // Get all the datasets titles
        this.x_values.forEach((key) => {
            Object.keys(this.data[key]).forEach((label) => {
                if (!Object.keys(this.datasets).includes(label)) {
                    this.datasets[label] = [];
                    this.line(label); // add line if missing
                };
            });
        });

        // Get all the datasets data
        this.x_values.forEach((key) => {
            Object.keys(this.data[key]).forEach((label) => {
                if (this.data[key][label] != undefined) {
                    this.datasets[label].push(this.data[key][label])
                } else {
                    this.datasets[label].push(0)
                }
                this.setValues(label, this.datasets[label])
            });
        });

        //this.UnCharted.update();
        this.UnCharted.update("resize")
    } // update()
}


// Socket connection ---------------------------
const socket = new WebSocket("wss://ws.hothothot.dog:9502");


socket.onopen = function (event) {
    socket.send("Hello HotHotHot, I am hothothot.ozeliurs.com");
}


socket.onmessage = function(event) {
    wss = true;
    updateDisplay(event.data);
}


// Hide/Visibility Buttons
document.getElementById("now").addEventListener("click", (event) => {
    document.getElementById("now-container").style.display = "flex";
    document.getElementById("hist-container").style.display = "none";
    document.getElementById("now").classList = "button primary";
    document.getElementById("hist").classList = "button";
}); // affNow()

document.getElementById("hist").addEventListener("click", (event) => {
    document.getElementById("now-container").style.display = "none";
    document.getElementById("hist-container").style.display = "flex";
    document.getElementById("hist").classList = "button primary";
    document.getElementById("now").classList = "button";
});

document.getElementById("notif").addEventListener("click", (event) => {

    if (!("Notification" in window)) {
        console.log("Ce navigateur ne prend pas en charge la notification de bureau")
    }

    else if (Notification.permission !== "denied") {
        Notification.requestPermission()
        .then((permission) => {
            if (permission === "granted") {
                const notification = new Notification("Hothothot", {
                    body: "Notifications activées !",
                    icon: "/icons/webIcon.png"
                })
            }
        })
    }
})


function notify(message) {
    if (!("Notification" in window)) { return; }

    if (Notification.permission !== "granted") { return; }

    new Notification("Hothothot", {
        body: message,
        icon: "/icons/webIcon.png"
    });
}


function fetchAPIandUpdate() {
    fetch("https://hothothot.dog/api/capteurs")
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Request failed with status ${reponse.status}`)
        };
        return response.json();
    })
    .then((data) => {
        updateDisplay(data);
    })
    .catch((error) => console.log(error));
}


function updateDisplay(data) {
    if (data === "") { return; }

    data.capteurs.forEach((capt) => {

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

        localStorage.setItem("hist", JSON.stringify(hist))

        // Population des elements
        document.getElementById(capt.Nom).getElementsByTagName("h1")[0].innerHTML = capt.Valeur + "°C";
        document.getElementById(capt.Nom).getElementsByTagName("b")[0].innerHTML = Math.min.apply(Math, hist[capt.Nom]) + "°C";
        document.getElementById(capt.Nom).getElementsByTagName("b")[1].innerHTML = Math.max.apply(Math, hist[capt.Nom]) + "°C";

        // Add funny notes to the temperatures
        updateTempLabels(capt)

        uncharted.addData(capt.Nom, (capt.Timestamp).toString(), capt.Valeur);
    });

    uncharted.update();
}


function update(event) { // called every 10 seconds checks if wss fails
    if (!wss) {fetchAPIandUpdate()}
}


document.addEventListener("DOMContentLoaded", (event) => {
    // Get data from localstorage
    local_hist = localStorage.getItem("hist")
    if (local_hist) {
        console.log("Read history from localstorage !")
        hist = JSON.parse(local_hist)
    }

    uncharted = new graph()
    update()
})