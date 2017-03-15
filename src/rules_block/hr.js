module.exports = function hr(state) {
    const cap = state.rules.hr.exec(state.src)
    if (cap) {
        const offsetLen = cap[0].length
        const offsetEnd = state.offset + offsetLen
        state.src = state.src.substring(offsetLen)
        state.tokens.push({
            type: 'hr',
            start: state.offset,
            end: offsetEnd
        })
        state.offset = offsetEnd
        return true
    }
    return false
}
