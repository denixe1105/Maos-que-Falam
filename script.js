const URL =
  "https://teachablemachine.withgoogle.com/models/fwpePaHB7/";

let modelo;
let camara;
let palabraActual = "Esperando...";


async function iniciar() {

  document.getElementById("palabra").innerText =
    "Cargando...";

  try {

    modelo = await tmImage.load(
      URL + "model.json",
      URL + "metadata.json"
    );

    camara = new tmImage.Webcam(300, 300, true);

    await camara.setup();

    await camara.play();

    document
      .getElementById("camara")
      .appendChild(camara.canvas);

    document.getElementById("botonCamara").innerText =
      "📷 CÁMARA ACTIVA";

    reconocer();

  } catch (error) {

    console.error(error);

    document.getElementById("palabra").innerText =
      "No se pudo iniciar la cámara";

    document.getElementById("confianza").innerText =
      "Comprueba los permisos de cámara";

  }
}


async function reconocer() {

  camara.update();

  const predicciones =
    await modelo.predict(camara.canvas);

  let mejor =
    predicciones[0];


  for (
    let i = 1;
    i < predicciones.length;
    i++
  ) {

    if (
      predicciones[i].probability >
      mejor.probability
    ) {

      mejor =
        predicciones[i];

    }

  }


  const porcentaje =
    mejor.probability * 100;


  if (porcentaje >= 70) {

    palabraActual =
      mejor.className;

    document
      .getElementById("palabra")
      .innerText =
      palabraActual;

    document
      .getElementById("confianza")
      .innerText =
      "Confianza: " +
      porcentaje.toFixed(1) +
      "%";

  } else {

    palabraActual =
      "No reconocida";

    document
      .getElementById("palabra")
      .innerText =
      "No reconocida";

    document
      .getElementById("confianza")
      .innerText =
      "Intenta nuevamente";

  }


  requestAnimationFrame(reconocer);

}


function escuchar() {

  if (
    palabraActual === "Esperando..." ||
    palabraActual === "No reconocida"
  ) {

    return;

  }


  const voz =
    new SpeechSynthesisUtterance(
      palabraActual
    );


  voz.lang =
    "es-ES";

  voz.rate =
    0.9;


  speechSynthesis.speak(voz);

}