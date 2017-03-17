module.exports = function code(state, env) {
    let cap = env.rules.code.exec(state.src)
    if (cap) {
        const offsetLen = cap[0].length
        const offsetEnd = state.offset + offsetLen
        state.src = state.src.substring(offsetLen)
        cap = cap[0].replace(/^ {4}/gm, '')
        env.tokens.push({
            type: 'code',
            text: !env.options.pedantic ? cap.replace(/\n+$/, '') : cap,
            start: state.offset,
            end: offsetEnd
        })
        state.offset = offsetEnd
        return true
    }
    return false
}
