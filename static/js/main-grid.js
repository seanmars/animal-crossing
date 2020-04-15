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

/** @type {boolean}} */
let lockReDraw = false;

function reDrawTable() {

}

function init() {
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


}

$(document).ready(async () => {
    moment.locale('zh-tw');

    try {
        init();

        const response = await axios.get('res/fish.json');
        const dataset = response.data.data;
        console.log(dataset);
        let item = utils.generateItem(dataset[0]);
        console.log(item);

        let itemRoot = document.getElementById('itemRoot');
        itemRoot.appendChild(item);

        lockReDraw = true;
        $('#kind-tab-fish').tab('show');
        $('#month-tab-0').tab('show');
        $('#hemisphere-tab-1').tab('show');
        $('#pills-filter-valid-tab').tab('show');
        lockReDraw = false;
        reDrawTable();
    } catch (error) {
        console.error(error);
    }
});
