module.exports = function heading(state) {
    const cap = state.rules.heading.exec(state.src)
    if (cap) {
        const offsetLen = cap[0].length
        const offsetEnd = state.offset + offsetLen
        state.src = state.src.substring(offsetLen)
        const headToken = {
            type: 'heading',
            depth: cap[1].length,
            text: cap[2],
            start: state.offset,
            end: offsetEnd
        }
        state.tocs.push(headToken)
        state.tokens.push(headToken)
        state.offset = offsetEnd
        return true
    }
    return false
}
