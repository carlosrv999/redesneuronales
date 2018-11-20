const IncomingForm = require('formidable').IncomingForm;
const xlsx = require('node-xlsx').default;
const fs = require('fs');

module.exports = function upload(req, res) {
  var form = new IncomingForm();
  let hoja;
  let isCorrect = true;
  form.on('file', (field, file) => {
    const workSheetsFromBuffer = xlsx.parse(file.path);
    hoja = workSheetsFromBuffer[0].data;

    /** validar archivo */
    for(j = 1; j <=19 ; j = j+2) {
      for(i = 5; i <= 13; i ++) {
        if(typeof hoja[i][j] != 'number') isCorrect = false;
      }
    }

    for(a = 1; a <= 7; a = a + 2) {
      for(b = 18; b<=28; b++) {
        if(hoja[b]){
          if(hoja[b][a]){
            if(typeof hoja[b][a] != 'number') isCorrect = false;
          } else {isCorrect = false; break;}
        } else {isCorrect = false; break;}
      }
    }

    if(isCorrect) {
      fs.createReadStream(file.path).pipe(fs.createWriteStream(`server/temp/archivo${new Date().getTime()}.xlsx`));
    }

  });
  form.on('end', () => {
    return res.status(200).send({correct: isCorrect});
  });
  form.parse(req);
};