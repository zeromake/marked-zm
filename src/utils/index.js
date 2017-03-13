const merge = function merge(obj) {
    let target
    let key
    let i = 1
    const len = arguments.length
    for (; i < len; i++) {
        target = arguments[i]
        for (key in target) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                obj[key] = target[key]
            }
        }
    }
    return obj
}
const escape = function escape(html, encode) {
    html = html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
    return html
}

const replace = function replace(regex, opt) {
    regex = regex.source
    opt = opt || ''
    return function self(name, val) {
        if (!name) return new RegExp(regex, opt)
        val = val.source || val
        val = val.replace(/(^|[^[])\^/g, '$1')
        regex = regex.replace(name, val)
        return self
    }
}
const noop = function noop() {}
noop.exec = noop

module.exports = {
    merge,
    escape,
    replace,
    noop,
}
