module.exports = function blockquote(state, env) {
    let cap = env.rules.blockquote.exec(state.src)
    if (cap) {
        const offsetLen = cap[0].length
        const offsetEnd = state.offset + offsetLen
        const offsetStart = state.offset
        state.src = state.src.substring(offsetLen)
        env.tokens.push({
            type: 'blockquote_start',
            start: offsetStart,
            end: offsetEnd
        })

        cap = cap[0].replace(/^ *> ?/gm, '')

        // Pass `top` to keep the current
        // "toplevel" state. This is exactly
        // how markdown.pl works.
        env.token(cap, state.top, true, offsetStart)
        env.tokens.push({
            type: 'blockquote_end'
        })
        state.offset = offsetEnd
        return true
    }
    return false
}
