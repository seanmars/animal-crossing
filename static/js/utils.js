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

const utils = {
    /**
     * @param {FishData} data
     * @returns {HTMLDivElement}
     */
    generateCardItem: function (data) {
        if ('content' in document.createElement('template')) {
            let t = document.querySelector('template#itemCardTemplate');
            let root = t.content.querySelector('#itemCard');
            /** @type {HTMLDivElement} */
            let resultDiv = document.importNode(root, true);

            // data-toggle="collapse" data-target="#collapseExample"
            resultDiv.dataset.toggle = 'collapse';
            resultDiv.dataset.target = `data-${data.id}`;

            resultDiv.dataset.raw = JSON.stringify({
                north: data.hemisphere[1].month,
                south: data.hemisphere[2].month,
                time: data.time
            });

            // title
            let title = resultDiv.querySelector('#title');
            title.textContent = data.name;
            // sub title
            let subTitle = resultDiv.querySelector('#subTitle');
            subTitle.textContent = data.engName;

            // icon
            let icon = resultDiv.querySelector('#icon');
            icon.setAttribute('src', `res/fish/${data.icon}`);

            let info = resultDiv.querySelector('#info');
            // price
            let price = document.createElement('li');
            price.className = 'list-group-item';
            price.textContent = `${getText('price')}：${CurrencyFormatter.format(data.price)}`;
            info.appendChild(price);
            // location
            let location = document.createElement('li');
            location.className = 'list-group-item';
            location.textContent = `${getText('location')}：${Locations.getName(data.location)}`;
            info.appendChild(location);
            // size of shadow
            let size = document.createElement('li');
            size.className = 'list-group-item';
            size.textContent = `${getText('size')}：${ShadowSize.getName(data.shadowSize)}`;
            info.appendChild(size);

            let moreInfo = resultDiv.querySelector('#moreInfo');
            moreInfo.id = `data-${data.id}`;
            moreInfo.className = 'collapse';
            // time
            let time = document.createElement('div');
            for (let idx = 0; idx < AllHours.length; idx++) {
                const t = AllHours[idx];
                let span = document.createElement('span');
                span.className = 'gridBase';
                span.textContent = t;

                if (data.time.includes(t)) {
                    span.classList.add('enable');
                } else {
                    span.classList.add('disable');
                }

                time.appendChild(span);
            }

            moreInfo.appendChild(time);

            return resultDiv;
        }
        else {
            // 不支援 template
        }
    },

    /**
     * @param {FishData} data
     */
    generateItem: function (data) {
        function newItemText(content) {
            let span = document.createElement('span');
            span.textContent = content;
            return span;
        }

        if ('content' in document.createElement('template')) {
            let t = document.querySelector('template#gridItem');
            let root = t.content;
            /** @type {Element} */
            let clone = document.importNode(root, true);
            /** @type {HTMLSpanElement} */
            let span;

            // title
            let title = clone.querySelector('span#title');
            title.textContent = `${data.name} (${data.engName})`
            // icon
            let icon = clone.querySelector('img#icon');
            icon.setAttribute('src', `res/fish/${data.icon}`);

            let info = clone.querySelector('div#info');
            // price
            let price = document.createElement('div');
            price.className = 'item-text';
            span = newItemText(`${getText('price')}：`);
            price.appendChild(span);
            span = newItemText(CurrencyFormatter.format(data.price));
            price.appendChild(span);
            info.appendChild(price);
            // location
            let location = document.createElement('div');
            location.className = 'item-text';
            span = newItemText(`${getText('location')}：`);
            location.appendChild(span);
            span = newItemText(Locations.getName(data.location));
            location.appendChild(span);
            info.appendChild(location);
            // size of shadow
            let size = document.createElement('div');
            size.className = 'item-text';
            span = newItemText(`${getText('size')}：`);
            size.appendChild(span);
            span = newItemText(ShadowSize.getName(data.shadowSize));
            size.appendChild(span);
            info.appendChild(size);

            // time

            return clone;
        }
        else {
            // 不支援 template
        }
    },
}
