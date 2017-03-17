const tokenParser = {
    space() {
        return ''
    },
    hr(env) {
        return env.renderer.hr()
    },
    heading(env) {
        return env.renderer.heading(
            env.inline.output(env.token.text),
            env.token.depth,
            env.token.text
        )
    },
    code(env) {
        return env.renderer.code(env.token.text,
            env.token.lang,
            env.token.escaped
        )
    },
    table(env) {
        let header = ''
        let body = ''
        let i
        let row
        let cell = ''
        let j

        // header
        for (i = 0; i < env.token.header.length; i += 1) {
            cell += env.renderer.tablecell(
                env.inline.output(env.token.header[i]), {
                    header: true,
                    align: env.token.align[i]
                }
            )
        }
        header += env.renderer.tablerow(cell);

        for (i = 0; i < env.token.cells.length; i += 1) {
            row = env.token.cells[i]

            cell = ''
            for (j = 0; j < row.length; j += 1) {
                cell += env.renderer.tablecell(
                    env.inline.output(row[j]), {
                        header: false,
                        align: env.token.align[j]
                    }
                )
            }

            body += env.renderer.tablerow(cell)
        }
        return env.renderer.table(header, body)
    },
    blockquote_start(env) {
        let body = ''
        while (env.next().type !== 'blockquote_end') {
            body += env.tok()
        }
        return env.renderer.blockquote(body)
    },
    list_start(env) {
        let body = ''
        const ordered = env.token.ordered
        const isChecked = env.token.checked
        while (env.next().type !== 'list_end') {
            body += env.tok()
        }
        return env.renderer.list(body, ordered, isChecked)
    },
    list_item_start(env) {
        let body = ''
        const isChecked = env.token.checked
        while (env.next().type !== 'list_item_end') {
            body += env.token.type === 'text' ? env.parseText() : env.tok()
        }

        return env.renderer.listitem(body, isChecked)
    },
    loose_item_start(env) {
        let body = ''
        const isChecked = env.token.checked
        while (env.next().type !== 'list_item_end') {
            body += env.tok()
        }

        return env.renderer.listitem(body, isChecked)
    },
    html(env) {
        const html = !env.token.pre && !env.options.pedantic ?
            env.inline.output(env.token.text) : env.token.text
        return env.renderer.html(html)
    },
    paragraph(env) {
        return env.renderer.paragraph(env.inline.output(env.token.text))
    },
    text(env) {
        return env.renderer.paragraph(env.parseText())
    },
    toc(env) {
        let i
        const len = env.tocs.length
        if (len === 0) {
            return ''
        }
        let last = 0
        const body = []
        for (i = 0; i < len; i += 1) {
            const tocItem = env.tocs[i]
            const id = tocItem.text.toLowerCase()
            const texts = env.inline.output(tocItem.text)
            const renText = env.renderer.tocItem(id, tocItem.depth, texts)
            let offset = tocItem.depth - last
            if (offset >= 1) {
                let j = 1
                while (j < offset) {
                    body.push(
                        '<ul>',
                        env.renderer.tocItem(null, last + j)
                    )
                    j += 1
                }
                body.push('<ul>', renText)
            } else if (offset === 0) {
                body.push('</li>', renText)
            } else if (offset < 0) {
                while (offset < 0) {
                    offset += 1
                    body.push('</li></ul>')
                }
                body.push(renText)
            }
            last = tocItem.depth
        }
        while (last) {
            last -= 1
            body.push('</li></ul>')
        }

        return env.renderer.toc(body)
    }
}
module.exports = tokenParser
