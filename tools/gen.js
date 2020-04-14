const fs = require('fs');
const ExcelJS = require('exceljs');

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

/**
 * @typedef {Object} FishRecord
 * @property {String} icon
 * @property {Number} id
 * @property {Number} location
 * @property {Object} months
 * @property {String} name
 * @property {Number} price
 * @property {Number} shadowSize
 * @property {Array} times
 */

/**
 * @returns {Array<FishRecord>}
 */
async function readData() {
    let loader = new ExcelJS.Workbook();
    let wb = await loader.xlsx.readFile('res/data.xlsx');
    let ws = await wb.getWorksheet('fish');
    ws.columns = [
        { header: 'id', key: 'id' },
    ];

    let dataset = [];
    ws.eachRow((row, rowNumber) => {
        let idCell = row.getCell('id');
        let id = idCell.value;
        if (rowNumber <= 2 || id == null) {
            return;
        }

        let name = row.getCell(FishColumnIndex.name).value;
        let engName = row.getCell(FishColumnIndex.nameEng).value;
        let price = row.getCell(FishColumnIndex.price).value;
        let location = row.getCell(FishColumnIndex.location).value;
        let shadowSize = row.getCell(FishColumnIndex.shadowSize).value;

        let times = [];
        let t = 0;
        for (let i = FishColumnIndex.timeBegin; i <= FishColumnIndex.timeEnd; i++) {
            let cell = row.getCell(i);
            let v = cell.value;
            if (v) {
                times.push(t);
            }

            t++
        }

        let hemisphere = {
            '1': { 'month': [] },
            '2': { 'month': [] },
        };
        let southernRow = ws.getRow(rowNumber + 1);
        let month = 1;
        for (let i = FishColumnIndex.monthBegin; i <= FishColumnIndex.monthEnd; i++) {
            let northernCell = row.getCell(i);
            let northernValue = northernCell.value;
            let southernCell = southernRow.getCell(i);
            let southernValue = southernCell.value;

            if (northernValue) {
                hemisphere['1'].month.push(month);
            }

            if (southernValue) {
                hemisphere['2'].month.push(month);
            }

            month++
        }

        dataset.push({
            id: id,
            name: name,
            engName: engName,
            price: !price ? 0 : price,
            location: !location ? 0 : location,
            shadowSize: !shadowSize ? 0 : shadowSize,
            time: times,
            hemisphere: hemisphere,
            icon: `${idCell}.webp`
        });
    });

    // console.dir(dataset, { depth: null });
    return dataset;
}

(async () => {
    let dataset = await readData();
    // write the data to json file
    let output = JSON.stringify({ data: dataset });
    let path = '../res/fish.json';
    await fs.writeFileSync(path, output);
})();
