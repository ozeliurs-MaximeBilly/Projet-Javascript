export class LabelsSubscriber {
    update(event) {
        event.capteurs.forEach(capt => {
            if (capt.Nom == "exterieur") {
                if (capt.Valeur > 35){
                    document.getElementById("exterieur").getElementsByTagName("h5")[1].style.visibility = "visible";
                    document.getElementById("exterieur").getElementsByTagName("h5")[1].innerHTML = "Hot Hot Hot !";
                    notify("Hot Hot Hot !")
                    document.getElementById("exterieur").getElementsByTagName("h5")[1].style.color = "red";
                } else if (capt.Valeur < 0) {
                    document.getElementById("exterieur").getElementsByTagName("h5")[1].style.visibility = "visible";
                    document.getElementById("exterieur").getElementsByTagName("h5")[1].innerHTML = "Banquise en vue !";
                    notify("Banquise en vue !")
                    document.getElementById("exterieur").getElementsByTagName("h5")[1].style.color = "blue";
                } else {
                    document.getElementById("exterieur").getElementsByTagName("h5")[1].style.visibility = "hidden";
                    // document.getElementById("exterieur").getElementsByTagName("h5")[1].innerHTML = "";
                }
            }
        
            if (capt.Nom == "interieur") {
                if (capt.Valeur > 22 && capt.Valeur <= 50) {
                    document.getElementById("interieur").getElementsByTagName("h5")[1].style.visibility = "visible";
                    document.getElementById("interieur").getElementsByTagName("h5")[1].innerHTML = "Baissez le chauffage !";
                    notify("Baissez le chauffage !")
                    document.getElementById("interieur").getElementsByTagName("h5")[1].style.color = "orange";
                }
                else if (capt.Valeur > 50) {
                    document.getElementById("interieur").getElementsByTagName("h5")[1].style.visibility = "visible";
                    document.getElementById("interieur").getElementsByTagName("h5")[1].innerHTML = "Appelez les pompiers ou arrêtez votre barbecue !";
                    notify("Appelez les pompiers ou arrêtez votre barbecue !")
                    document.getElementById("interieur").getElementsByTagName("h5")[1].style.color = "red";
                } else if (capt.Valeur < 12 && capt.Valeur >= 0) {
                    document.getElementById("interieur").getElementsByTagName("h5")[1].style.visibility = "visible";
                    document.getElementById("interieur").getElementsByTagName("h5")[1].innerHTML = "Montez le chauffage ou mettez un gros pull  !";
                    notify("Montez le chauffage ou mettez un gros pull  !")
                    document.getElementById("interieur").getElementsByTagName("h5")[1].style.color = "cyan";
                } else if (capt.Valeur < 0) {
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
        });
        
    }
}