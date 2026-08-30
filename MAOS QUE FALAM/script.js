// ================================
// MAOS QUE FALAM
// Reconocimiento de lenguaje de señas
// ================================

// URL de nuestro modelo de Teachable Machine
const URL = "https://teachablemachine.withgoogle.com/models/HKeGS5c8k/";

let model;
let webcam;
let maxPredictions;

// Iniciar la aplicación
async function init() {

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Cargar el modelo
    model = await tmImage.load(modelURL, metadataURL);

    // Número de clases que tiene nuestro modelo
    maxPredictions = model.getTotalClasses();

    // Activar cámara
    const flip = true;

    webcam = new tmImage.Webcam(300, 300, flip);

    await webcam.setup();
    await webcam.play();

    // Mostrar cámara
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    // Crear espacio para mostrar resultado
    const labelContainer = document.getElementById("label-container");

    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    // Comenzar reconocimiento
    window.requestAnimationFrame(loop);
}


// Bucle de reconocimiento
async function loop() {

    webcam.update();

    await predict();

    window.requestAnimationFrame(loop);
}


// Reconocer el gesto
async function predict() {

    const prediction = await model.predict(webcam.canvas);

    let mayor = 0;
    let resultado = "";

    for (let i = 0; i < maxPredictions; i++) {

        const porcentaje =
            prediction[i].probability * 100;

        // Mostrar cada resultado
        document.getElementById("label-container")
            .childNodes[i].innerHTML =
            prediction[i].className +
            ": " +
            porcentaje.toFixed(1) +
            "%";

        // Buscar la predicción más alta
        if (prediction[i].probability > mayor) {

            mayor = prediction[i].probability;
            resultado = prediction[i].className;
        }
    }

    // Mostrar el gesto reconocido
    document.getElementById("resultado").innerHTML =
        resultado;
}
    

  

      

    

   
