module.exports = function def(state, env) {
    const cap = env.rules.def.exec(state.src)
    if ((!state.bq && state.top) && cap) {
        const offsetLen = cap[0].length
        const offsetEnd = state.offset + offsetLen
        const offsetStart = state.offset
        state.src = state.src.substring(offsetLen)
        env.links[cap[1].toLowerCase()] = {
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
