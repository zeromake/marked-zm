module.exports = function def(state) {
    const cap = state.rules.def.exec(state.src)
    if ((!state.bq && state.top) && cap) {
        const offsetLen = cap[0].length
        const offsetEnd = state.offset + offsetLen
        const offsetStart = state.offset
        state.src = state.src.substring(offsetLen)
        state.links[cap[1].toLowerCase()] = {
            href: cap[2],
            title: cap[3],
            start: offsetStart,
            end: offsetEnd
        }
        state.offset = offsetEnd
        return true
    }
    return false
}
