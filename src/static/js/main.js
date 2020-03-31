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
        a.setAttribute('id', `${prefixId}-tab-${items[idx]}`);
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

function main() {
    const db = createDb();
    console.log(db);

    var kindPill = document.getElementById('pills-kind');
    generateKindPill(kindPill);

    var monthPill = document.getElementById('pills-month');
    generateMonthPill(monthPill);

    $('#pills-kind a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
        var target = $(e.target)
        console.log(target.data('type'));
    });

    $('#pills-month a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
        var target = $(e.target)
        console.log(target.data('type'));
    });

    $('#kind-tab-fish').tab('show');
    $('#month-tab-0').tab('show');

    var config = getDataTableColumnConfig('fish', db);

    $('#dataTable').DataTable(config);
}

$(document).ready(() => {
    main();
});
