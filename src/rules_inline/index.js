function newline (state) {

}

function icon (state) {

}

function escape (state) {

}

function autolink (state) {

}

function url (state) {

}

function tag (state) {

}

function link (state) {

}

function refnolink (state) {

}

function strong (state) {

}

function em (state) {

}

function code (state) {

}

function br (state) {

}

function del (state) {

}

function text (state) {

}

const _rules = [
    ['newline', newline, 10],
    ['icon', icon, 20],
    ['escape', escape, 30],
    ['autolink', autolink, 40],
    ['url', url, 50],
    ['tag', tag, 60],
    ['link', link, 70],
    ['refnolink', refnolink, 80],
    ['strong', strong, 90],
    ['em', em, 100],
    ['code', code, 110],
    ['br', br, 120],
    ['del', del, 130],
    ['text', text, 140]
]
