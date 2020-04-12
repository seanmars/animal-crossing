/**
 *
 * @param {Object} options
 * @param {HTMLElement} options.target
 * @param {string} options.id
 * @param {Array} options.items
 * @param {Array} options.controls
 * @param {Array} options.types
 * @param {Array} options.texts
 */
function generateNav(options) {
    if (!options) {
        return;
    }

    let target = options.target;
    let prefixId = options.id;
    let items = options.items;
    let controls = options.controls;
    let types = options.types;
    let texts = options.texts;

    items.forEach((x, idx) => {
        let a = document.createElement('a');
        a.classList.add('nav-link');
        a.setAttribute('id', `${prefixId}-tab-${x}`);
        a.setAttribute('href', '#');
        a.setAttribute('role', 'tab');
        a.setAttribute('aria-controls', controls[idx]);
        a.setAttribute('aria-selected', false);
        a.dataset.toggle = 'pill';
        a.dataset.type = types[idx];
        a.text = texts[idx];

        let li = document.createElement('li');
        li.appendChild(a);

        target.appendChild(li);
    });
}

/**
 *
 * @param {HTMLDivElement} target
 */
function generateKindPill(target) {
    const kinds = [
        '魚類',
        // '昆蟲',
    ];
    const items = [
        'fish',
        // 'bug',
    ];

    generateNav({
        id: 'kind',
        target: target,
        items: items,
        controls: items,
        types: items,
        texts: kinds
    });
}

/**
 *
 * @param {HTMLDivElement} target
 */
function generateMonthPill(target) {
    const months = [
        'All', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'
    ];
    const items = [...range(0, 12)];

    generateNav({
        id: 'month',
        target: target,
        items: items,
        controls: items,
        types: items,
        texts: months
    });
}

/**
 *
 * @param {HTMLDivElement} target
 */
function generateHemispherePill(target) {
    const months = [
        '北半球', '南半球'
    ];
    const items = [
        HemisphereType.Northern.code,
        HemisphereType.Southern.code
    ];

    generateNav({
        id: 'hemisphere',
        target: target,
        items: items,
        controls: items,
        types: items,
        texts: months
    });
}

function updateStyleByTime(month, hour) {
    utils.refreshStyleByCurrentValue('hemisphereTable', month);
    utils.refreshStyleByCurrentValue('timeTable', hour);
}

function refreshByHemisphere(v) {
    v = parseInt(v);
    utils.updateHemisphere(v);
}

/** @type {DataTables.Api} */
let tableData;
/** @type {boolean}} */
let lockReDraw = false;

/**
 *
 * @param {Object} options
 * @param {Array<Object>} options.data
 * @param {string} options.month
 * @param {string} options.hour
 * @param {string} options.hemisphere
 */
function updateInformation(options) {
    /**
     * @param {HTMLElement} target
     * @param {Array<FishData>} items
     */
    function appendTo(target, title, items) {
        let div = document.createElement('div');
        div.textContent = title;
        target.appendChild(div);
        div = document.createElement('div');
        target.appendChild(div);
        if (items.length) {
            items.forEach(x => {
                let names = x.name.split(',');
                let text = `${names[0]} (${names[1]})`;
                let ele = document.createElement('button');
                ele.type = 'button';
                ele.className = 'btn btn-link';
                ele.textContent = text;
                target.appendChild(ele);
            });
        }
    }

    // console.log(options);
    if (!options.data.length) {
        return;
    }

    let currentMonth = parseInt(options.month) + 1;
    if (currentMonth > 12) {
        currentMonth = 1;
    }
    let nextMonth = currentMonth + 1;
    if (nextMonth > 12) {
        nextMonth = 1;
    }

    let currentHemisphere = parseInt(options.hemisphere);

    /** @type {Array<FishData>} */

    /** @type {Array<FishData>} */
    let northernDisappear = [];
    /** @type {Array<FishData>} */
    let southernDisappear = [];

    /** @type {Array<FishData>} */
    let northernAppear = [];
    /** @type {Array<FishData>} */
    let southernAppear = [];

    let allData = options.data;
    for (let index = 0; index < allData.length; index++) {
        const data = allData[index];

        /** @type {HemisphereData} */
        let norHemisphere = data.hemisphere[HemisphereType.Northern.code];
        /** @type {HemisphereData} */
        let souHemisphere = data.hemisphere[HemisphereType.Southern.code];

        // disappear
        if (norHemisphere.month.includes(currentMonth) &&
            !norHemisphere.month.includes(nextMonth)) {
            northernDisappear.push(data);
        }
        if (souHemisphere.month.includes(currentMonth) &&
            !souHemisphere.month.includes(nextMonth)) {
            southernDisappear.push(data);
        }

        // appear
        if (!norHemisphere.month.includes(currentMonth) &&
            norHemisphere.month.includes(nextMonth)) {
            northernAppear.push(data);
        }
        if (!souHemisphere.month.includes(currentMonth) &&
            souHemisphere.month.includes(nextMonth)) {
            southernAppear.push(data);
        }
    }

    northernDisappear = northernDisappear.sort((x, y) => {
        return y.price - x.price;
    });
    southernDisappear = southernDisappear.sort((x, y) => {
        return y.price - x.price;
    });
    northernAppear = northernAppear.sort((x, y) => {
        return y.price - x.price;
    });
    southernAppear = southernAppear.sort((x, y) => {
        return y.price - x.price;
    });

    let nextDisappear = document.getElementById('nextDisappear');
    nextDisappear.innerHTML = '';
    let nextAppear = document.getElementById('nextAppear');
    nextAppear.innerHTML = '';

    if (currentHemisphere == HemisphereType.Both.code ||
        currentHemisphere == HemisphereType.Northern.code) {
        appendTo(nextDisappear, HemisphereType.Northern.fullName, northernDisappear);
        appendTo(nextAppear, HemisphereType.Northern.fullName, northernAppear);
    }

    if (currentHemisphere == HemisphereType.Both.code ||
        currentHemisphere == HemisphereType.Southern.code) {
        appendTo(nextDisappear, HemisphereType.Southern.fullName, southernDisappear);
        appendTo(nextAppear, HemisphereType.Southern.fullName, southernAppear);
    }
}

function reDrawTable() {
    if (!tableData || lockReDraw) {
        return;
    }

    tableData.draw();

    let timeDisplay = document.getElementById('timeDisplay');
    updateStyleByTime(timeDisplay.dataset.month, timeDisplay.dataset.hour);

    let hemispheres = document.getElementById('hemispheres');
    refreshByHemisphere(hemispheres.dataset.type);
}

function init() {
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            let filterMonthValid = document.getElementById('filterMonthValid');
            let type = filterMonthValid.dataset.type;
            if (type == undefined || type == FilterMonthValid.All.code) {
                return true;
            }

            let row = tableData.row(dataIndex);
            let rowData = row.data();

            let timeDisplay = document.getElementById('timeDisplay');
            let month = parseInt(timeDisplay.dataset.month) + 1;
            let hemispheres = document.getElementById('hemispheres')
            let hemisphereType = parseInt(hemispheres.dataset.type);

            /** @type {Array} */
            let hemisphere = [];
            switch (hemisphereType) {
                case HemisphereType.Northern.code:
                case HemisphereType.Southern.code:
                    hemisphere = rowData.hemisphere[hemisphereType].month;
                    break;

                case HemisphereType.Both.code:
                    hemisphere = [].concat(rowData.hemisphere[HemisphereType.Northern.code].month,
                        rowData.hemisphere[HemisphereType.Southern.code].month);
                    break;

                default:
                    return false;
            }

            return hemisphere.includes(month);
        }
    );

    $('#currentTime').on('change.datetimepicker', e => {
        let timeDisplay = document.getElementById('timeDisplay');

        /** @type {moment.Moment} */
        let date = e.date;

        let t = `${date.format(DefaultDateFormat)}:00`;
        timeDisplay.setAttribute('value', t);
        timeDisplay.dataset.month = date.month();
        timeDisplay.dataset.hour = date.hour();

        reDrawTable();
    });

    $('#currentTime').datetimepicker({
        format: 'MM HH',
        locale: moment.locale('zh-tw'),
        icons: {
            time: 'fas fa-clock',
            date: 'fas fa-calendar',
            up: 'fas fa-arrow-up',
            down: 'fas fa-arrow-down',
            previous: 'fas fa-chevron-left',
            next: 'fas fa-chevron-right',
            today: 'fas fa-calendar-day',
            clear: 'fas fa-calendar-minus',
            close: 'fas fa-times'
        },
        inline: true,
        sideBySide: true,
        buttons: {
            showToday: true,
            showClear: false,
            showClose: false
        }
    });

    // kind
    let kindPill = document.getElementById('pills-kind');
    generateKindPill(kindPill);
    $('#pills-kind a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
        let target = $(e.target)
        // console.log(target.data('type'));
    });


    // month
    let monthPill = document.getElementById('pills-month');
    generateMonthPill(monthPill);
    $('#pills-month a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
        let target = $(e.target)
        // console.log(target.data('type'));
    });

    // hemisphere
    let hemispherePill = document.getElementById('pills-hemisphere');
    generateHemispherePill(hemispherePill);
    $('#pills-hemisphere a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
        let target = $(e.target)
        let type = target.data('type');

        let hemispheres = document.getElementById('hemispheres');
        if (hemispheres) {
            hemispheres.dataset.type = type;
        }

        reDrawTable();
    });

    // filter
    $('#pills-filter a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
        let target = $(e.target);
        let type = target.data('type');

        let filterMonthValid = document.getElementById('filterMonthValid');
        filterMonthValid.dataset.type = parseInt(type);

        reDrawTable();
    });

    let config = getDataTableColumnConfig('fish', 'res/fish.json');
    tableData = $('#dataTable').DataTable(config);
    tableData.on('draw', () => {
        let timeDisplay = document.getElementById('timeDisplay');
        updateStyleByTime(timeDisplay.dataset.month, timeDisplay.dataset.hour);

        // update information
        let hemispheres = document.getElementById('hemispheres');
        updateInformation({
            data: tableData.rows().data(),
            month: timeDisplay.dataset.month,
            hour: timeDisplay.dataset.hour,
            hemisphere: hemispheres.dataset.type
        });
    });

    lockReDraw = true;
    $('#kind-tab-fish').tab('show');
    $('#month-tab-0').tab('show');
    $('#hemisphere-tab-1').tab('show');
    $('#pills-filter-valid-tab').tab('show');
    lockReDraw = false;
    reDrawTable();
}

$(document).ready(() => {
    moment.locale('zh-tw');

    init();
});
