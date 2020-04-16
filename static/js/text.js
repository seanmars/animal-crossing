let _text = {
    'price': '價錢',
    'location': '地點',
    'size': '影子大小',
};

const getText = function (text) {
    return _text[text] == undefined ? text : _text[text];
};
