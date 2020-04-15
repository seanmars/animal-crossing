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
 * <div class="item-body">
                        <span class="item-title h5">title</span>
                        <img class="item-icon" src="files/fish/龍睛金魚.webp">
                        <span class="item-text">
                            <span>info:</span>
                            <span>content</span>
                        </span>
                    </div>
 */
const utils = {
    /**
     * @param {FishData} data
     */
    generateItem: function (data) {
        if ('content' in document.createElement('template')) {
            let t = document.querySelector('template#gridItem');
            let title = t.content.querySelector('span#title');
            title.textContent = `${data.name} (${data.engName})`

            let clone = document.importNode(t.content, true);
            return clone;
        }
        else {
            // 不支援 template
        }
    },
}
