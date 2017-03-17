module.exports = function paragraph(state, env) {
    const cap = env.rules.paragraph.exec(state.src)
    if (state.top && cap) {
        const offsetLen = cap[0].length
        const offsetEnd = state.offset + offsetLen
        const offsetStart = state.offset
        state.src = state.src.substring(offsetLen)
        env.tokens.push({
            type: 'paragraph',
            text: cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1],
            start: offsetStart,
            end: offsetEnd
        })
        state.offset = offsetEnd
        return true
    }
    return false
}
