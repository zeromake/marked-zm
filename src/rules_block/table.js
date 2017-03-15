module.exports = function table(state) {
    const cap = state.rules.table.exec(state.src)
    if (state.top && cap) {
        let i
        const offsetLen = cap[0].length
        const offsetEnd = state.offset + offsetLen
        const offsetStart = state.offset
        state.src = state.src.substring(offsetLen)

        const item = {
            type: 'table',
            header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
            align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
            cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n'),
            start: offsetStart,
            end: offsetEnd
        }

        for (i = 0; i < item.align.length; i++) {
            if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = 'right'
            } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = 'center'
            } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = 'left'
            } else {
                item.align[i] = null
            }
        }

        for (i = 0; i < item.cells.length; i++) {
            item.cells[i] = item.cells[i]
                .replace(/^ *\| *| *\| *$/g, '')
                .split(/ *\| */)
        }

        state.tokens.push(item)
        state.offset = offsetEnd
        return true
    }
    return false
}
