module.exports = function text(state, env) {
    const cap = env.rules.text.exec(state.src)
    if (cap) {
        // Top-level should never reach here.
        const offsetLen = cap[0].length
        const offsetEnd = state.offset + offsetLen
        const offsetStart = state.offset
        state.src = state.src.substring(offsetLen)
        env.tokens.push({
            type: 'text',
            text: cap[0],
            start: offsetStart,
            end: offsetEnd
        })
        state.offset = offsetEnd
        return true
    }
    return false
}
