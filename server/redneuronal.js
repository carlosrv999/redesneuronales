
/** Funcion sigmoide */
let sigmoid = (t) => {
  return 1/(1+Math.pow(Math.E, -t));
}

/** Array temporal de entradas de la capa oculta */
let entradas2 = [];
/** Array temporal de salidas de la red */
let salidas = [];
/** Funcion para llenar el array temporal de entradas a la capa oculta */
let obtenerEntradas2 = (capa1, capa2, entradas, callback) => {
  /** Iterar sobre el array de neuronas de la capa oculta */
  for(let neurona of capa1) {
    /** Variable para almacenar la suma parcial de los pesos * salida de una neurona de la capa oculta */
    let suma = 0;
    /** Iterar sobre los pesos de una neurona (es decir, sobre el array de entradas + bias) */
    for(let [index, peso] of neurona.entries()) {
      /** Si la entrada es undefined, entonces es el BIAS, se le asigna 1 a la entrada */
      let entrada = entradas[index] !== undefined ? entradas[index] : 1;
      /** Agregar peso * entrada a la suma total */
      suma = suma + (peso * entrada);
    }
    /** Aplicar la funcion de activacion sigmoide a la entrada de la neurona */
    let activated = sigmoid(suma);
    /** Agregar la entrada de la capa oculta al array */
    entradas2.push(activated);
  }
  /** Llamar a la funcion obtenerSalidas, enviarle el array de entradas a la capa oculta */
  let salidaCallback = callback(capa2, entradas2);
  /** Retornar las salidas */
  return salidaCallback;
}

/** Funcion para obtener las salidas de la red neuronal, parametros: capa2 -> pesos de la capa de salida, inlets -> entradas de la capa oculta */
let obtenerSalidas = (capa2, inlets) => {
  /** Iterar sobre el array de neuronas de la capa de salida */
  for(let neurona of capa2) {
    /** Variable para almacenar la suma parcial de los pesos * salida de una neurona de la capa de salida */
    let suma = 0;
    /** Iterar sobre los pesos de una neurona (es decir, sobre el array de entradas + bias) */
    for(let [index, peso] of neurona.entries()) {
      /** Si la entrada es undefined, entonces es el BIAS, se le asigna 1 a la entrada */
      let entrada = inlets[index] !== undefined ? inlets[index] : 1;
      /** Agregar peso * entrada a la suma total */
      suma = suma + (peso * entrada);
    }
    /** Aplicar la funcion de activacion sigmoide a la entrada de la neurona */
    let activated = sigmoid(suma);
    /** Agregar la entrada de la capa oculta al array */
    salidas.push(activated);
  }
  /** Retornar las salidas de la red a la primera funcion */
  return salidas;
}

/** Exportar el modulo */
module.exports = (capa1, capa2, entradas) => {
  let valor = obtenerEntradas2(capa1, capa2, entradas, obtenerSalidas);
  entradas2 = [];
  salidas = [];
  return valor;
}