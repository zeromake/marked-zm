const block = require('../block')

module.exports = function list(state, env) {
    let cap = env.rules.list.exec(state.src)
    if (cap) {
        const isChecked = env.rules.checkedlist.test(state.src)
        const offsetLen = cap[0].length
        const offsetEnd = state.offset + offsetLen
        const offsetStart = state.offset
        let checked
        state.src = state.src.substring(offsetLen)
        const bull = cap[2]
        env.tokens.push({
            type: 'list_start',
            ordered: bull.length > 1,
            checked: isChecked,
            start: offsetStart,
            end: offsetEnd
        })

        // Get each top-level item.
        cap = cap[0].match(isChecked ? env.rules.checkeditem : env.rules.item)

        let next = false
        const l = cap.length
        let i = 0
        let itemOffsetStart = offsetStart
        let itemOffsetEnd
        for (; i < l; i += 1) {
            let item = cap[i]
            // Remove the list item's bullet
            // so it is seen as the next token.
            let space = item.length
            itemOffsetEnd = itemOffsetStart + space
            item = item.replace(/^ *([*+-]|\d+\.) +/, '')
            if (isChecked) {
                checked = /^\[x\]/.test(item)
                item = item.replace(/^\[(x| *)\]/, '')
            } else {
                checked = null
            }

            // Outdent whatever the
            // list item contains. Hacky.
            if (~item.indexOf('\n ')) {
                space -= item.length;
                item = !env.options.pedantic ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '') : item.replace(/^ {1,4}/gm, '');
            }

            // Determine whether the next list item belongs here.
            // Backpedal if it does not belong in this list.
            if (env.options.smartLists && i !== l - 1) {
                const b = block.bullet.exec(cap[i + 1])[0]
                if (bull !== b && !(bull.length > 1 && b.length > 1)) {
                    state.src = cap.slice(i + 1).join('\n') + state.src
                    i = l - 1
                }
            }

            // Determine whether item is loose or not.
            // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
            // for discount behavior.
            let loose = next || /\n\n(?!\s*$)/.test(item)
            if (i !== l - 1) {
                next = item.charAt(item.length - 1) === '\n'
                if (!loose) loose = next
            }

            env.tokens.push({
                type: loose ? 'loose_item_start' : 'list_item_start',
                checked,
                start: itemOffsetStart,
                end: itemOffsetEnd
            })
            // Recurse.
            env.token(item, false, state.bq, itemOffsetStart)

            env.tokens.push({
                type: 'list_item_end'
            })
            itemOffsetStart = itemOffsetEnd
        }
        env.tokens.push({
            type: 'list_end'
        })
        state.offset = offsetEnd
        return true
    }
    return false
}
