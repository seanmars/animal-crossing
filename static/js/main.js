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

    var target = options.target;
    var prefixId = options.id;
    var items = options.items;
    var controls = options.controls;
    var types = options.types;
    var texts = options.texts;

    items.forEach((x, idx) => {
        var a = document.createElement('a');
        a.classList.add('nav-link');
        a.setAttribute('id', `${prefixId}-tab-${x}`);
        a.setAttribute('href', '#');
        a.setAttribute('role', 'tab');
        a.setAttribute('aria-controls', controls[idx]);
        a.setAttribute('aria-selected', false);
        a.dataset.toggle = 'pill';
        a.dataset.type = types[idx];
        a.text = texts[idx];

        var li = document.createElement('li');
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
        HemisphereType.Both.name, '北半球', '南半球'
    ];
    const items = [
        HemisphereType.Both.code,
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

function refreshByTime(month, hour) {
    utils.refreshStyleByCurrentValue('hemisphereTable', month);
    utils.refreshStyleByCurrentValue('timeTable', hour);
}

function refreshByHemisphere(v) {
    v = parseInt(v);
    utils.updateHemisphere(v);
}

/**
 * @type {DataTables.Api}
 */
var tableData;

function reDrawTable() {
    if (!tableData) {
        return;
    }
    tableData.draw();
}

function init() {
    $.fn.dataTable.ext.search.push(
        function (settings, data, dataIndex) {
            var filterValid = document.getElementById('filterValid');
            var type = filterValid.dataset['type'];
            if (type == undefined || type == FilterValid.All.code) {
                return true;
            }

            var row = tableData.row(dataIndex);
            var data = row.data();

            var timeDisplay = document.getElementById('timeDisplay');
            var month = parseInt(timeDisplay.dataset.month) + 1;
            var hemispheres = document.getElementById('hemispheres')
            var hemisphereType = parseInt(hemispheres.dataset.type);

            /** @type {Array} */
            var hemisphere = [];
            switch (hemisphereType) {
                case HemisphereType.Northern.code:
                case HemisphereType.Southern.code:
                    hemisphere = data.hemisphere[hemisphereType].month;
                    break;

                case HemisphereType.Both.code:
                    hemisphere = [].concat(data.hemisphere[HemisphereType.Northern.code].month,
                        data.hemisphere[HemisphereType.Southern.code].month);
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
        refreshByTime(timeDisplay.dataset.month, timeDisplay.dataset.hour);
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
    var kindPill = document.getElementById('pills-kind');
    generateKindPill(kindPill);
    $('#pills-kind a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
        var target = $(e.target)
        // console.log(target.data('type'));
    });


    // month
    var monthPill = document.getElementById('pills-month');
    generateMonthPill(monthPill);
    $('#pills-month a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
        var target = $(e.target)
        // console.log(target.data('type'));
    });

    // hemisphere
    var hemispherePill = document.getElementById('pills-hemisphere');
    generateHemispherePill(hemispherePill);
    $('#pills-hemisphere a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
        var target = $(e.target)
        var type = target.data('type');
        var hemispheres = document.getElementById('hemispheres')
        if (hemispheres) {
            hemispheres.dataset.type = type;
        }
        refreshByHemisphere(type);

        reDrawTable();
    });

    // filter
    $('#pills-filter a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
        var target = $(e.target);
        var type = target.data('type');

        var filterValid = document.getElementById('filterValid');
        filterValid.dataset['type'] = parseInt(type);

        reDrawTable();
    });

    $('#kind-tab-fish').tab('show');
    $('#month-tab-0').tab('show');
    $('#hemisphere-tab-3').tab('show');

    var config = getDataTableColumnConfig('fish', 'res/fish.json');
    tableData = $('#dataTable').DataTable(config);
    tableData.on('draw', () => {
        var timeDisplay = document.getElementById('timeDisplay');
        refreshByTime(timeDisplay.dataset.month, timeDisplay.dataset.hour);
    });

    $('#pills-filter-valid-tab').tab('show');
}

$(document).ready(() => {
    moment.locale('zh-tw');

    init();
});
