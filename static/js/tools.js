function tsvJSON(tsv) {
    const lines = tsv.split('\n');
    const headers = lines.slice(0, 1)[0].split('\t');
    return lines.slice(1, lines.length).map(line => {
        const data = line.split('\t');
        return headers.reduce((obj, nextKey, index) => {
            obj[nextKey] = data[index];
            return obj;
        }, {});
    });
}

/**
 *
 * @param {string} timeText
 */
function transactionTime(timeText) {
    timeText = timeText.replace(/^"(.*)"$/, '$1');

    if (!timeText || timeText == '--') {
        return [];
    }

    if (timeText == '全天') {
        return [...range(0, 23)];
    }

    var result = [];
    const tmp = timeText.split(',');
    tmp.forEach(x => {
        x = x.replace(/點/ig, '');
        const beginEnd = x.split('-');
        begin = parseInt(beginEnd[0]);
        end = parseInt(beginEnd[1]);
        result = result.concat([...range(begin, end, 24)]);
    });

    return result;
}

function transactionMonth(obj) {
    var month = [];
    for (let i = 1; i <= 12; i++) {
        const ele = parseInt(obj[i]);
        if (ele) {
            month.push(i);
        }
    }

    return month;
}

/**
 *
 * @param {string} sizeText
 */
function transactionShadowSize(sizeText) {
    sizeText = sizeText.replace(/^"(.*)"$/, '$1');

    switch (sizeText) {
        case "特小": return ShadowSize.Tiny.code;
        case "小": return ShadowSize.Small.code;
        case "中偏小": return ShadowSize.Medium.code;
        case "中偏大": return ShadowSize.Large.code;
        case "大": return ShadowSize.VeryLarge.code;
        case "特大": return ShadowSize.Huge.code;
        case "細長": return ShadowSize.Narrow.code;
        case "背鰭": return ShadowSize.HugeWithFin.code;
        default: return ShadowSize.None.code;
    }
}

/**
 *
 * @param {string} locationText
 */
function transactionLocation(locationText) {
    locationText = locationText.replace(/^"(.*)"$/, '$1');

    switch (locationText) {
        case "河川": return Locations.River.code;
        case "池塘": return Locations.Pond.code;
        case "懸崖上": return Locations.RiverClifftop.code;
        case "出海口": return Locations.RiverMouth.code;
        case "大海": return Locations.Sea.code;
        case "碼頭": return Locations.Dock.code;
        case "大海(雨天)": return Locations.SeaWhenRaining.code;
        default: return Locations.None.code;
    }
}

/**
 *
 * @param {string} hemisphereText
 */
function transactionHemisphere(hemisphereText) {
    hemisphereText = hemisphereText.replace(/^"(.*)"$/, '$1');

    switch (hemisphereText) {
        case "北半球": return HemisphereType.Northern.code;
        case "南半球": return HemisphereType.Southern.code;
        default: return HemisphereType.None.code;
    }
}

/**
 *
 * @param {string} nameText
 */
function transactionName(nameText) {
    return nameText.replace(/^"(.*)"$/, '$1');
}

/**
 *
 * @param {string} priceText
 */
function transactionPrice(priceText) {
    priceText = priceText.replace(/^"(.*)"$/, '$1');
    return parseInt(priceText);
}

function tsvFishToData(tsv) {
    // Northern Hemisphere
    // Southern Hemisphere

    var rawData = tsvJSON(tsv);
    var allFish = [];
    rawData.forEach((v, idx) => {
        var realId = idx;
        if (idx % 2 == 1) {
            var preIdx = idx - 1;
            preV = rawData[preIdx];
            v.name = preV.name;
            v.cost8 = preV.cost8;
            v.cost = preV.cost;
            v.loc = preV.loc;
            v.size = preV.size;
            v.time = preV.time;

            v.hemisphere = transactionHemisphere(v.hemisphere);
            v.month = transactionMonth(v);

            realId = preV.id;
        } else {
            v.name = transactionName(v.name);
            v.cost = transactionPrice(v.cost);
            v.time = transactionTime(v.time);
            v.month = transactionMonth(v);
            v.size = transactionShadowSize(v.size);
            v.loc = transactionLocation(v.loc);
            v.hemisphere = transactionHemisphere(v.hemisphere);
        }

        v.id = realId;

        allFish.push(v);
    });



    var tmp = {};
    allFish.forEach(x => {
        if (tmp[x.id] != undefined) {
            tmp[x.id].hemisphere[x.hemisphere] = {
                month: x.month
            };
        } else {
            var f = {
                name: x.name,
                price: x.cost,
                time: x.time,
                shadowSize: x.size,
                location: x.loc,
                hemisphere: {}
            };

            f.hemisphere[x.hemisphere] = {
                month: x.month
            }

            tmp[x.id] = f;
        }
    });

    var result = []
    Object.keys(tmp).forEach(k => {
        result.push(tmp[k]);
    });

    return result;
}