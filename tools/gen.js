const ExcelJS = require('exceljs');

let workbook = new ExcelJS.Workbook();
workbook.xlsx.readFile('res/data.xlsx')
    .then(wb => {
        var ws = wb.getWorksheet('fish');
        ws.eachRow((row, rowNumber) => {
            console.log(`Row ${rowNumber}`);
            row.eachCell((cell, colNumber) => {
                console.log(colNumber, cell.value);
            });
        });
    });
