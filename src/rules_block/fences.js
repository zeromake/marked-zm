module.exports = function fences(state, env) {
    const cap = env.rules.fences.exec(state.src)
    if (cap) {
        const offsetLen = cap[0].length
        const offsetEnd = state.offset + offsetLen
        state.src = state.src.substring(offsetLen)
        env.tokens.push({
            type: 'code',
            lang: cap[2],
            text: cap[3] || '',
            start: state.offset,
            end: offsetEnd
        })
        state.offset = offsetEnd
        return true
    }
    return false
}
