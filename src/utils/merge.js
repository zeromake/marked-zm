const merge = function mergeFun(...args) {
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

module.exports = merge
