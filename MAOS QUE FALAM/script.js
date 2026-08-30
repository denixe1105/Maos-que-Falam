const URL = "https://teachablemachine.withgoogle.com/models/HKeGS5c8k/";

let model;
let webcam;
let maxPredictions;

async function iniciar() {
  try {
    document.getElementById("resultado").innerText = "Cargando modelo...";

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);

    maxPredictions = model.getTotalClasses();

    webcam = new tmImage.Webcam(300, 300, true);
    await webcam.setup();
    await webcam.play();

    document.getElementById("webcam-container").innerHTML = "";
    document.getElementById("webcam-container").appendChild(webcam.canvas);

    window.requestAnimationFrame(ciclo);
  } catch (error) {
    console.error(error);
    document.getElementById("resultado").innerText =
      "❌ No se pudo iniciar la cámara.";
  }
}

async function ciclo() {
  webcam.update();

  await predecir();

  window.requestAnimationFrame(ciclo);
}

async function predecir() {
  const predicciones = await model.predict(webcam.canvas);

  let mejor = predicciones[0];

  for (let i = 1; i < predicciones.length; i++) {
    if (predicciones[i].probability > mejor.probability) {
      mejor = predicciones[i];
    }
  }

  const porcentaje = (mejor.probability * 100).toFixed(0);

  document.getElementById("resultado").innerText =
    mejor.className + " — " + porcentaje + "%";
}

function escuchar() {
  const texto = document.getElementById("resultado").innerText;

  if ("speechSynthesis" in window) {
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "es-ES";
    speechSynthesis.speak(voz);
  } else {
    alert("Tu navegador no permite lectura por voz.");
  }
}
