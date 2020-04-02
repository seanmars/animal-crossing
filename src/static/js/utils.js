const DefaultDateFormat = 'YYYY-MM-DD HH';

const CurrencyFormatter = new Intl.NumberFormat();
const AllHours = [...range(0, 23)];
const AllMonths = [...range(1, 12)];

function getRandom(min, max) {
    min = min === undefined ? 0 : min;
    max = max === undefined ? 0 : max;
    if (min === max) {
        return Math.random();
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function* range(start, end, max) {
    if (max !== undefined && start > max) {
        if (end >= start) {
            return;
        }

        start = 0;
    }

    yield start;

    if (start === end) {
        return;
    }

    yield* range(start + 1, end, max);
}

/**
 *
 * @param {Array<number>} allItems
 * @param {Array<number>} availableItems
 * @param {number} current
 */
function renderGrid(targetClass, allItems, availableItems, current) {
    if (!Array.isArray(allItems) || !Array.isArray(availableItems)) {
        console.error('Invalid input.', allItems, availableItems);
        return;
    }

    var div = document.createElement('div');
    div.className = `${targetClass} gridTable row justify-content-center align-self-center pl-4 pr-4`;

    var spans = [];
    var len = allItems.length - 1;
    for (let i = 0; i <= len; i++) {
        const element = allItems[i];

        let span = document.createElement('span');
        span.dataset.id = i;
        spans.push(span);

        span.className = 'col gridBase justify-content-center align-self-center';
        if (i === 0) {
            span.classList.add('gridBegin');
        } else if (i === len) {
            span.classList.add('gridEnd');
        }

        if (availableItems.includes(element)) {
            span.classList.add('enable');
        } else {
            span.classList.add('disable');
        }

        span.textContent = element;
        div.appendChild(span);
    }

    return div;
}

function getDataTableColumnConfig(kind, url) {
    switch (kind) {
        case 'fish':
            return {
                // data: dataset,
                ajax: {
                    url: url,
                    type: 'get',
                    dataSrc: 'data'
                },
                paging: false,
                columnDefs: [
                    {
                        targets: '_all',
                        className: 'dt-center align-middle'
                    }
                ],
                columns: [
                    {
                        data: "name",
                        title: '名稱',
                        className: 'dt-body-left',
                        render: function (data, type, row, meta) {
                            var name = data.split(',');
                            return '<pre>' + name[0] + '</pre>' + name[1];
                        }
                    },
                    {
                        data: "price",
                        title: "價錢",
                        render: function (data, type, row, meta) {
                            return CurrencyFormatter.format(data);
                        }
                    },
                    {
                        data: "time",
                        title: "時間",
                        render: function (data, type, row, meta) {
                            let ele = renderGrid('timeTable', AllHours, data);
                            return ele ? ele.outerHTML : '';
                        }
                    },
                    {
                        data: "shadowSize",
                        title: "影子",
                        render: function (data, type, row, meta) {
                            return ShadowSize.getName(data);
                        }
                    },
                    {
                        data: "location",
                        title: "地點",
                        render: function (data, type, row, meta) {
                            return Locations.getName(data);
                        }
                    },
                    {
                        data: "hemisphere",
                        title: "月份",
                        render: function (data, type, row, meta) {
                            let northern = data[HemisphereType.Northern.code];
                            let northernElement = renderGrid('hemisphereTable', AllMonths, northern.month);
                            northernElement.dataset.hemisphere = HemisphereType.Northern.code;

                            let northernTitle = document.createElement('span');
                            northernTitle.className = 'col gridBase gridTitle justify-content-center align-self-center mr-1 text-truncate';
                            northernTitle.textContent = HemisphereType.getName(HemisphereType.Northern.code);
                            northernElement.insertBefore(northernTitle, northernElement.firstChild);

                            let southern = data[HemisphereType.Southern.code];
                            let southernElement = renderGrid('hemisphereTable', AllMonths, southern.month);
                            southernElement.dataset.hemisphere = HemisphereType.Southern.code;

                            let southernTitle = document.createElement('span');
                            southernTitle.className = 'col gridBase gridTitle justify-content-center align-self-center mr-1';
                            southernTitle.textContent = HemisphereType.getName(HemisphereType.Southern.code);
                            southernElement.insertBefore(southernTitle, southernElement.firstChild);

                            return northernElement.outerHTML + southernElement.outerHTML;
                        }
                    }
                ]
            };

        case 'bug':
            return {

            };

        default:
            break;
    }
}

const utils = {
    refreshStyleByCurrentValue: function (className, currentValue) {
        var rootTables = document.getElementsByClassName(className);
        if (!rootTables) {
            console.error(`${className} table is not exists`);
            return;
        }

        for (let tIdx = 0; tIdx < rootTables.length; tIdx++) {
            const root = rootTables[tIdx];
            let spans = root.getElementsByTagName('span');
            for (let sIdx = 0; sIdx < spans.length; sIdx++) {
                const span = spans[sIdx];
                if (span.dataset.id == currentValue) {
                    span.classList.add('gridCurrent');
                } else {
                    span.classList.remove('gridCurrent');
                }
            }
        }
    },

    updateHemisphere: function (v) {
        var rootTables = document.getElementsByClassName('hemisphereTable ');
        if (!rootTables) {
            console.error(`${className} table is not exists`);
            return;
        }

        for (let tIdx = 0; tIdx < rootTables.length; tIdx++) {
            const root = rootTables[tIdx];
            console.log(root.dataset.hemisphere, ' ', v);

            if (v != HemisphereType.Both.code && root.dataset.hemisphere != v) {
                root.classList.add('d-none');
                root.classList.add('invisible');
            } else {
                root.classList.remove('d-none');
                root.classList.remove('invisible');
            }
        }
    },
};


