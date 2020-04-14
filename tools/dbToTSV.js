const fs = require('fs');
const db = require('./db.js');

async function dataToTSV() {
    let data = db();
    let result = [];
    data.forEach((x, idx) => {
        let n = x.name.split(',');
        let id = idx + 1;
        let content = '';
        content = `${id}\t${n[0]}\t${n[1]}\t${x.price}\t${x.location}\t${x.shadowSize}\t`;

        let tFlag = [];
        for (let k = 0; k <= 23; k++) {
            tFlag.push(x.time.includes(k) ? 1 : 0);
        }
        content += tFlag.join('\t');
        content += '\t';

        let mFlag = [];
        for (let k = 0; k < 12; k++) {
            mFlag.push(x.hemisphere[1].month.includes(k) ? 1 : 0);
        }
        content += mFlag.join('\t');
        result.push(content);

        content = '\t'.repeat(6);
        content += '\t'.repeat(23);
        content += '\t';
        mFlag = [];
        for (let k = 1; k <= 12; k++) {
            mFlag.push(x.hemisphere[2].month.includes(k) ? 1 : 0);
        }
        content += mFlag.join('\t');
        result.push(content);
    });

    console.log(result);
    await fs.writeFileSync('tmp.text', result.join('\n'));
    return result;
}

(async () => {
    await dataToTSV();
})();
