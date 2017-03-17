module.exports = function toc(state, env) {
    const cap = env.rules.toc.exec(state.src)
    if (cap) {
        const offsetLen = cap[0].length
        const offsetEnd = state.offset + offsetLen
        state.src = state.src.substring(offsetLen)
        env.tokens.push({
            type: 'toc',
            start: state.offset,
            end: offsetEnd
        })
        state.offset = offsetEnd
        return true
    }
    return false
}
