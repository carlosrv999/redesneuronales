'use strict';

const upload = require('../upload');
const RedNeuronal = require("../redneuronal");
const fs = require('fs');
const xlsx = require('node-xlsx').default;

module.exports = function (server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  var Peso = server.models.Peso;

  // http://localhost:3000/calcularPesos?area=1&riesgo_deslizamiento=4&riesgo_inundacion=0&mov_masas=2&inundacion=2&infra_niv_i=0&infra_niv_ii=0&infra_niv_iii=1
  router.get('/calcularPesos', async (req, res, next) => {
    if (req.query.area === undefined) return res.status(400).send({ error: "falta el parametro area" })
    if (req.query.riesgo_deslizamiento === undefined) return res.status(400).send({ error: "falta el parametro riesgo_deslizamiento" })
    if (req.query.riesgo_inundacion === undefined) return res.status(400).send({ error: "falta el parametro riesgo_inundacion" })
    if (req.query.mov_masas === undefined) return res.status(400).send({ error: "falta el parametro mov_masas" })
    if (req.query.inundacion === undefined) return res.status(400).send({ error: "falta el parametro inundacion" })
    if (req.query.infra_niv_i === undefined) return res.status(400).send({ error: "falta el parametro infra_niv_i" })
    if (req.query.infra_niv_ii === undefined) return res.status(400).send({ error: "falta el parametro infra_niv_ii" })
    if (req.query.infra_niv_iii === undefined) return res.status(400).send({ error: "falta el parametro infra_niv_iii" })
    let area = req.query.area;
    let riesgo_deslizamiento = req.query.riesgo_deslizamiento;
    let riesgo_inundacion = req.query.riesgo_inundacion;
    let mov_masas = req.query.mov_masas;
    let inundacion = req.query.inundacion;
    let infra_niv_i = req.query.infra_niv_i;
    let infra_niv_ii = req.query.infra_niv_ii;
    let infra_niv_iii = req.query.infra_niv_iii;
    const entradas = [area, riesgo_deslizamiento, riesgo_inundacion, mov_masas, inundacion, infra_niv_i, infra_niv_ii, infra_niv_iii];

    Peso.find({}, (err, result) => {
      let salida = null;
      let capa1 = result[0].capa1;
      let capa2 = result[0].capa2;
      salida = RedNeuronal(capa1, capa2, entradas);
      return res.status(200).send(salida);
    })
    // console.log(salida);
  })

  router.post('/upload', upload);

  router.post('/confirmar', (req, res) => {
    let name;
    fs.readdirSync('server/temp')
      .forEach(file => {
        console.log(file);
        name = file;
      });
    const workSheetsFromBuffer = xlsx.parse(`server/temp/${name}`);
    let hoja = workSheetsFromBuffer[0].data;
    let capa1 = [];
    let capa2 = [];

    for(let j = 1; j <=19 ; j = j+2) {
      let neurona = [];
      for(let i = 5; i <= 13; i ++) {
        neurona.push(hoja[i][j]);
      }
      capa1.push(neurona);
      neurona = [];
    }
    for(let a = 1; a <= 7; a = a + 2) {
      let neurona = [];
      for(let b = 18; b<=28; b++) {
        neurona.push(hoja[b][a]);
      }
      capa2.push(neurona);
      neurona = [];
    }
    
    console.log('************** capa 1 ****************');
    console.log(capa1);
    console.log('************** capa 2 ****************');
    console.log(capa2);

    let newPesos = {
      capa1: capa1,
      capa2: capa2
    };

    Peso.destroyAll((err, result) => {
      Peso.create(newPesos, (err, models) => {
        fs.unlinkSync(`server/temp/${name}`);
        return res.status(200).send(models);
      })
    })

  });

  server.use(router);
};
