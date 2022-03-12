export class NowSubscriber {
    update(event) {
        event.capteurs.forEach(capt => {

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
        });
    }
}