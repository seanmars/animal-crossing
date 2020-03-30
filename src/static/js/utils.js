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

function getDataTableColumnConfig(kind, dataset) {
    switch (kind) {
        case 'fish':
            return {
                data: dataset,
                paging: false,
                columnDefs: [{
                    targets: '_all',
                    className: 'dt-center'
                }],
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
                            // render time with html
                            // https://editor.datatables.net/examples/simple/simple.html
                            // https://datatables.net/reference/option/columns.render
                            return 0;
                        }
                    },
                    {
                        data: "shadowSize",
                        title: "影子",
                        render: function (data, type, row, meta) {
                            return JSON.stringify(data);
                        }
                    },
                    {
                        data: "location",
                        title: "地點",
                        render: function (data, type, row, meta) {
                            return JSON.stringify(data);
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
