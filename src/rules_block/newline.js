module.exports = function newline(state, env) {
    const cap = env.rules.newline.exec(state.src)
    if (cap) {
        const offsetLen = cap[0].length
        const offsetEnd = state.offset + offsetLen
        state.src = state.src.substring(offsetLen)
        if (cap[0].length > 1) {
            env.tokens.push({
                type: 'space',
                start: state.offset,
                end: offsetEnd
            })
        }
        state.offset = offsetEnd
        return true
    }
    return false
}
