const currencyFormatter = new Intl.NumberFormat();

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
 * @param {Array<number>} items
 * @returns {HTMLElement}
 */
function renderHourGrid(items) {
    const allHours = [...range(0, 23)];

    if (!items) {
        return;
    }

    var div = document.createElement('div');
    div.className = 'gridTable';

    var len = allHours.length - 1;
    for (let i = 0; i <= len; i++) {
        const element = allHours[i];

        let span = document.createElement('span');
        span.classList.add('gridBase');
        if (i === 0) {
            span.classList.add('gridBegin');
        } else if (i === len) {
            span.classList.add('gridEnd');
        }

        if (items.includes(element)) {
            span.classList.add('enable');
        } else {
            span.classList.add('disable');
        }

        span.textContent = element;
        div.appendChild(span);
    }

    return div;
}

function getDataTableColumnConfig(kind, dataset) {
    switch (kind) {
        case 'fish':
            return {
                data: dataset,
                paging: false,
                columnDefs: [
                    {
                        targets: '_all',
                        className: 'dt-center'
                    }
                ],
                columns: [
                    {
                        data: "name",
                        title: '名稱',
                        className: 'dt-body-left'
                    },
                    {
                        data: "price",
                        title: "價錢",
                        render: function (data, type, row, meta) {
                            return currencyFormatter.format(data);
                        }
                    },
                    {
                        data: "time",
                        title: "時間",
                        render: function (data, type, row, meta) {
                            let ele = renderHourGrid(data);
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
                            return JSON.stringify(data);
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
