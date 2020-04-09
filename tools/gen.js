const ExcelJS = require('exceljs');
const db = require('./db.js');

const FishColumnIndex = {
    id: 1,
    name: 2,
    nameEng: 3,
    price: 4,
    location: 5,
    shadowSize: 6,
    timeBegin: 7,
    timeEnd: 30,
    monthBegin: 31,
    monthEnd: 42,
    icon: 43
};

async function readData() {
    let loader = new ExcelJS.Workbook();
    let wb = await loader.xlsx.readFile('res/data.xlsx');
    let ws = await wb.getWorksheet('fish');
    ws.columns = [
        { header: 'id', key: 'id' },
    ];

    let dataset = [];
    ws.eachRow((row, rowNumber) => {
        let id = row.getCell('id');
        if (rowNumber == 1 || id.value == null || rowNumber > 3) {
            return;
        }
        console.log(`Row ${rowNumber}`);

        let name = row.getCell(FishColumnIndex.name);
        let price = row.getCell(FishColumnIndex.price);
        let location = row.getCell(FishColumnIndex.location);
        let shadowSize = row.getCell(FishColumnIndex.shadowSize);
        let times = [];
        for (let i = FishColumnIndex.timeBegin; i <= FishColumnIndex.timeEnd; i++) {
            let cell = row.getCell(i);
            let v = cell.value;
            times.push(!v ? 0 : 1);
        }
        let months = [];
        for (let i = FishColumnIndex.monthBegin; i <= FishColumnIndex.monthEnd; i++) {
            let cell = row.getCell(i);
            let v = cell.value;
            months.push(!v ? 0 : 1);
        }

        dataset.push({
            name: name.value,
            price: !price.value ? 0 : price.value,
            location: !location.value ? 0 : location.value,
            shadowSize: !shadowSize.value ? 0 : shadowSize.value,
            times: times,
            months: months
        });
    });

    console.log(dataset);
    return dataset;
}

async function dataToTSV() {
    let data = db();
    console.log(data);
}

(async () => {
    // let dataset = await readData();
    await dataToTSV();
})();
