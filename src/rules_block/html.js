module.exports = function html(state, env) {
    const cap = env.rules.html.exec(state.src)
    if (cap) {
        const offsetLen = cap[0].length
        const offsetEnd = state.offset + offsetLen
        const offsetStart = state.offset
        state.src = state.src.substring(offsetLen)
        env.tokens.push({
            type: env.options.sanitize ? 'paragraph' : 'html',
            pre: !env.options.sanitizer && (
                cap[1] === 'pre'
                || cap[1] === 'script'
                || cap[1] === 'style'
            ),
            text: cap[0],
            start: offsetStart,
            end: offsetEnd
        })
        state.offset = offsetEnd
        return true
    }
    return false
}
