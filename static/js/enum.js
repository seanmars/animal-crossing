/** @typedef {Object} HemisphereData
 * @property {Array<number>} month
 */

/** @typedef {Object} HemisphereSet
 * @property {HemisphereData} 1
 * @property {HemisphereData} 2
 */

/**
 * The Fish Data
 * @typedef {Object} FishData
 * @property {number} id
 * @property {string} name
 * @property {string} engName
 * @property {string} icon
 * @property {number} price
 * @property {number} location
 * @property {number} shadowSize
 * @property {Array<number>} time
 * @property {HemisphereSet} hemisphere
 */

const Locations = {
    None: { code: 0, name: '無' },
    Sea: { code: 1, name: "海洋" },
    River: { code: 2, name: "河川" },
    RiverClifftop: { code: 3, name: "河川(崖頂)" },
    RiverPondClifftop: { code: 4, name: "池塘(崖頂)" },
    RiverMouth: { code: 5, name: "河口" },
    Pond: { code: 6, name: "池塘" },
    SeaWhenRaining: { code: 7, name: "海洋(下雨時)" },
    Dock: { code: 8, name: "碼頭" },

    getName: function (code) {
        code = parseInt(code);
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                const element = this[key];
                if (element.code == code) {
                    return element.name;
                }
            }
        }

        return this.None.name;
    },
}

const ShadowSize = {
    None: { code: 0, name: '無' },
    Tiny: { code: 1, name: '特小' },
    Small: { code: 2, name: '小' },
    Medium: { code: 3, name: '中' },
    Large: { code: 4, name: '大' },
    VeryLarge: { code: 5, name: '特大' },
    Huge: { code: 6, name: '巨大' },
    HugeWithFin: { code: 7, name: '巨大有鰭' },
    Massive: { code: 8, name: '超巨大' },
    Narrow: { code: 9, name: '細長' },

    getName: function (code) {
        code = parseInt(code);
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                const element = this[key];
                if (element.code == code) {
                    return element.name;
                }
            }
        }

        return this.None.name;
    },
}

const HemisphereType = {
    None: { code: 0, name: '無' },
    Northern: { code: 1, name: '北', fullName: '北半球' },
    Southern: { code: 2, name: '南', fullName: '南半球' },
    Both: { code: 3, name: 'Both' },

    getName: function (code) {
        code = parseInt(code);
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                const element = this[key];
                if (element.code == code) {
                    return element.name;
                }
            }
        }

        return this.None.name;
    },
}

const FilterMonthValid = {
    None: { code: 0, name: '' },
    All: { code: 1, name: 'all' },
    valid: { code: 2, name: 'valid' },
}
