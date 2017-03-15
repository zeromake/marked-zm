module.exports = function lheading(state) {
    const cap = state.rules.lheading.exec(state.src)
    if (cap) {
        const offsetLen = cap[0].length
        const offsetEnd = state.offset + offsetLen
        state.src = state.src.substring(offsetLen)
        const headToken = {
            type: 'heading',
            depth: cap[2] === '=' ? 1 : 2,
            text: cap[1],
            start: state.offset,
            end: offsetEnd
        }
        state.tokens.push(headToken)
        state.tocs.push(headToken)
        state.offset = offsetEnd
        return true
    }
    return false
}
