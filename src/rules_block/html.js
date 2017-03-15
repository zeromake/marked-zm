module.exports = function html(state) {
    const cap = state.rules.html.exec(state.src)
    if (cap) {
        const offsetLen = cap[0].length
        const offsetEnd = state.offset + offsetLen
        const offsetStart = state.offset
        state.src = state.src.substring(offsetLen)
        state.tokens.push({
            type: this.options.sanitize ? 'paragraph' : 'html',
            pre: !this.options.sanitizer && (
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
