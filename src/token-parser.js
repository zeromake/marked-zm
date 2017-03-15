const tokenParser = {
    space() {
        return ''
    },
    hr() {
        return this.renderer.hr()
    },
    heading() {
        return this.renderer.heading(
            this.inline.output(this.token.text),
            this.token.depth,
            this.token.text
        )
    },
    code() {
        return this.renderer.code(this.token.text,
            this.token.lang,
            this.token.escaped
        )
    },
    table() {
        let header = ''
        let body = ''
        let i
        let row
        let cell = ''
        let j

        // header
        for (i = 0; i < this.token.header.length; i++) {
            cell += this.renderer.tablecell(
                this.inline.output(this.token.header[i]), {
                    header: true,
                    align: this.token.align[i]
                }
            )
        }
        header += this.renderer.tablerow(cell);

        for (i = 0; i < this.token.cells.length; i++) {
            row = this.token.cells[i]

            cell = ''
            for (j = 0; j < row.length; j++) {
                cell += this.renderer.tablecell(
                    this.inline.output(row[j]), {
                        header: false,
                        align: this.token.align[j]
                    }
                )
            }

            body += this.renderer.tablerow(cell)
        }
        return this.renderer.table(header, body)
    },
    blockquote_start() {
        let body = ''
        while (this.next().type !== 'blockquote_end') {
            body += this.tok()
        }
        return this.renderer.blockquote(body)
    },
    list_start() {
        let body = ''
        const ordered = this.token.ordered
        const isChecked = this.token.checked
        while (this.next().type !== 'list_end') {
            body += this.tok()
        }
        return this.renderer.list(body, ordered, isChecked)
    },
    list_item_start() {
        let body = ''
        const isChecked = this.token.checked
        while (this.next().type !== 'list_item_end') {
            body += this.token.type === 'text' ? this.parseText() : this.tok()
        }

        return this.renderer.listitem(body, isChecked)
    },
    loose_item_start() {
        let body = ''
        const isChecked = this.token.checked
        while (this.next().type !== 'list_item_end') {
            body += this.tok()
        }

        return this.renderer.listitem(body, isChecked)
    },
    html() {
        const html = !this.token.pre && !this.options.pedantic ?
            this.inline.output(this.token.text) : this.token.text
        return this.renderer.html(html)
    },
    paragraph() {
        return this.renderer.paragraph(this.inline.output(this.token.text))
    },
    text() {
        return this.renderer.paragraph(this.parseText())
    },
    toc() {
        return this.tocHTML
    }
}
module.exports = tokenParser
