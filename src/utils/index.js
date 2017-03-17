const merge = function merge(...args) {
    const obj = args[0]
    let target
    let key
    let i = 1
    const len = args.length
    for (; i < len; i += 1) {
        target = args[i]
        for (key in target) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                obj[key] = target[key]
            }
        }
    }
    return obj
}
const zescape = function zescape(html, encode) {
    html = html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
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

const sortRules = function sortRules(rules) {
    return rules.sort((a, b) => {
        if (a && b && a.length > 2 && b.length > 2) {
            return a[2] - b[2]
        }
        return 0
    })
}

module.exports = {
    merge,
    zescape,
    replace,
    noop,
    sortRules
}
