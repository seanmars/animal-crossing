/**
 *
 * @param {HTMLDivElement} target
 */
function generateMonthPill(target) {
    const months = [
        'All', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'
    ];

    months.forEach((x, idx) => {

        var a = document.createElement('a');
        a.classList.add('nav-link');
        a.setAttribute('id', `month-tab-${idx}`);
        a.setAttribute('href', '#');
        a.setAttribute('role', 'tab');
        a.setAttribute('aria-controls', idx);
        a.setAttribute('aria-selected', false);
        a.dataset.toggle = 'pill';
        a.dataset.type = idx;
        a.text = x;

        var li = document.createElement('li');
        li.appendChild(a);

        target.appendChild(li);
    });
}

function main() {
    const db = createDb();
    console.log(db);
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

    $('#month-tab-0').tab('show')
}

main();