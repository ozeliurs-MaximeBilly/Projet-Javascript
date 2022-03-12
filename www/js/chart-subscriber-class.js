export class ChartSubscriber {
    update(event) {
        if (event === "") { return }
        event.capteurs.forEach(capt => {
            
            // Add label if missing
            if (!UnCharted.data.labels.includes(capt.Timestamp)) {
                UnCharted.data.labels.push(capt.Timestamp)
                if (UnCharted.data.labels.length > chart_length) {
                    UnCharted.data.labels.shift()
                }
            }

            // Check if Add line for new sensor
            add_line = true
            UnCharted.data.datasets.forEach(line => {
                if (line.label === capt.Nom) {
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
                if (line.label === capt.Nom) {
                    line.data.push(capt.Valeur)
                    console.log(line)
                    if (line.data.length > chart_length) {
                        line.data.shift()
                    }
                }
            });
        });

        // Update Chart
        UnCharted.update('resize')
    }
}