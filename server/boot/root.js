'use strict';
const redsita = require("../example");

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  var Peso = server.models.Peso;

// http://localhost:3000/calcularPesos?area=1&riesgo_deslizamiento=4&riesgo_inundacion=0&mov_masas=2&inundacion=2&infra_niv_i=0&infra_niv_ii=0&infra_niv_iii=1
  router.get('/calcularPesos', async (req, res, next) => {
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
      console.log(result.capa1);
      let salida = null;
      let capa1 = result[0].capa1;
      let capa2 = result[0].capa2;
      salida = redsita(capa1, capa2, entradas);
      console.log(salida);
      return res.status(200).send(salida);
    })
    // console.log(salida);
  })
  server.use(router);
};
