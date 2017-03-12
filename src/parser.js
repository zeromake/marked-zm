const Renderer = require('./renderer')
const InlineLexer = require('./inlinelexer')
const defaults = require('./defaults')

function Parser(options) {
    this.tokens = []
    this.token = null
    this.options = options || defaults
    this.options.renderer = this.options.renderer || new Renderer()
    this.renderer = this.options.renderer
    this.renderer.options = this.options
}

/**
 * Static Parse Method
 */

Parser.parse = function staticParse(param, options, renderer) {
    const parser = new Parser(options, renderer)
    return parser.parse(param)
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function parse(param) {
    const src = param.tokens
    const tocs = param.tocs
    this.inline = new InlineLexer(src.links, this.options, this.renderer)
    const tocItems = []
    tocs.forEach((token) => {
        const id = token.text.toLowerCase()
        tocItems.push(this.renderer.tocItem(id, token.depth, token.text))
    })
    this.tocHTML = this.renderer.toc(tocItems.join('\n'))
    this.tokens = src.reverse()
    let parseOut = ''
    while (this.next()) {
        parseOut += this.tok()
    }
    return parseOut
};

/**
 * Next Token
 */

Parser.prototype.next = function parNext() {
    this.token = this.tokens.pop()
    return this.token
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function peek() {
    return this.tokens[this.tokens.length - 1] || 0
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function parseText() {
    let textBody = this.token.text

    while (this.peek().type === 'text') {
        textBody += '\n' + this.next().text
    }

    return this.inline.output(textBody)
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function parTok() {
    switch (this.token.type) {
    case 'space':
        {
            return '';
        }
    case 'hr':
        {
            return this.renderer.hr()
        }
    case 'heading':
        {
            return this.renderer.heading(
                this.inline.output(this.token.text),
                this.token.depth,
                this.token.text
            )
        }
    case 'code':
        {
            return this.renderer.code(this.token.text,
                this.token.lang,
                this.token.escaped
            )
        }
    case 'table':
        {
            let header = ''
            let body = ''
            let i
            let row
            let cell
            // let flags
            let j

            // header
            cell = '';
            for (i = 0; i < this.token.header.length; i++) {
                /* flags = {
                    header: true,
                    align: this.token.align[i]
                }; */
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
        }
    case 'blockquote_start':
        {
            let body = ''

            while (this.next().type !== 'blockquote_end') {
                body += this.tok()
            }

            return this.renderer.blockquote(body)
        }
    case 'list_start':
        {
            let body = ''
            const ordered = this.token.ordered
            const isChecked = this.token.checked
            while (this.next().type !== 'list_end') {
                body += this.tok()
            }

            return this.renderer.list(body, ordered, isChecked)
        }
    case 'list_item_start':
        {
            let body = ''
            const isChecked = this.token.checked
            while (this.next().type !== 'list_item_end') {
                body += this.token.type === 'text' ? this.parseText() : this.tok()
            }

            return this.renderer.listitem(body, isChecked)
        }
    case 'loose_item_start':
        {
            let body = ''
            const isChecked = this.token.checked
            while (this.next().type !== 'list_item_end') {
                body += this.tok()
            }

            return this.renderer.listitem(body, isChecked)
        }
    case 'html':
        {
            const html = !this.token.pre && !this.options.pedantic ?
                this.inline.output(this.token.text) : this.token.text
            return this.renderer.html(html)
        }
    case 'paragraph':
        {
            return this.renderer.paragraph(this.inline.output(this.token.text))
        }
    case 'text':
        {
            return this.renderer.paragraph(this.parseText())
        }
    case 'toc':
        {
            return this.tocHTML
        }
    case 'checked':
        {
            const checkedDom = '<div class="checked-item"><input '
            + (this.token.isCheck ? 'checked="checked"' : '')
            + ' type="checkbox">'
            return checkedDom + this.inline.output(this.token.text) + '</div>'
        }
    default:
        {
            const renderer = this.renderer[this.token.type]
            if (typeof renderer === 'function') {
                return renderer.call(this, this.token.text, this.renderer)
            }
        }
    }
}

module.exports = Parser
