// let entradas = [1, 5, 0, 3, 1, 0, 1, 0];

let sigmoid = (t) => {
  return 1/(1+Math.pow(Math.E, -t));
}

let entradas2 = [];

let salidas = [];

let obtenerEntradas2 = (capa1, capa2, entradas, callback) => {
  for(let neurona of capa1) {
    let suma = 0;
    for(let [index, peso] of neurona.entries()) {
      let entrada = entradas[index] !== undefined ? entradas[index] : 1;
      suma = suma + (peso * entrada);
      // console.log(`estoy multiplicando ${peso} * ${entrada} y sale = ${peso * entrada}, la suma va en ${suma}`);
    }
    // console.log(suma);
    let activated = sigmoid(suma);
    entradas2.push(activated);
  }
  // console.log(`las entradas a la capa oculta al final quedan en `);
  // console.log(entradas2);
  let mierda = callback(capa2, entradas2);
  return mierda;
}

let obtenerSalidas = (capa2, inlets) => {
  for(let neurona of capa2) {
    let suma = 0;
    for(let [index, peso] of neurona.entries()) {
      let entrada = inlets[index] !== undefined ? inlets[index] : 1;
      suma = suma + (peso * entrada);
      // console.log(`estoy multiplicando ${peso} * ${entrada} y sale = ${peso * entrada}, la suma va en ${suma}`);
    }
    // console.log(suma);
    let activated = sigmoid(suma);
    salidas.push(activated);
  }
  // console.log(`las salidas al final quedan en :`);
  return salidas;
}

// console.log(obtenerEntradas2(capa1, capa2, entradas, obtenerSalidas));

module.exports = (capa1, capa2, entradas) => {
  let valor = obtenerEntradas2(capa1, capa2, entradas, obtenerSalidas);
  return valor;
}