
const zescape = require('./utils/zescape')

function Renderer(options) {
    this.options = options || {};
}

Renderer.prototype.code = function renCode(code, lang, escaped) {
    if (this.options.highlight) {
        let codeOut = this.options.highlight(code, lang);
        if (typeof codeOut === 'object') {
            lang = codeOut.language
            codeOut = codeOut.value
        }
        if (codeOut != null && codeOut !== code) {
            escaped = true;
            code = codeOut;
        }
    }

    if (!lang) {
        return '<pre><code>'
        + (escaped ? code : zescape(code, true))
        + '\n</code></pre>'
    }
    return '<pre class="code '
    + this.options.langPrefix
    + zescape(lang, true)
    + '"><code class="'
    + this.options.langPrefix
    + zescape(lang, true)
    + '">'
    + (escaped ? code : zescape(code, true))
    + '\n</code></pre>\n'
}

Renderer.prototype.blockquote = function blockquote(quote) {
    return '<blockquote>\n' + quote + '</blockquote>\n'
}

const renHtml = function renHtml(html) {
    return html
}

Renderer.prototype.html = renHtml

Renderer.prototype.heading = function heading(text, level) {
    const escapedText = text.toLowerCase()
    return '<h'
    + level
    + '><a class="anchor" name="'
    + zescape(escapedText)
    + '" href="#'
    + zescape(escapedText)
    + '"><svg aria-hidden="true" class="octicon octicon-link" height="16"'
    + ' version="1.1" viewBox="0 0 16 16" width="16">'
    + '<path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55'
    + ' 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45'
    + ' 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 '
    + '9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5'
    + ' 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9'
    + ' 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>'
    + text
    + '</h'
    + level
    + '>'
}

Renderer.prototype.hr = function hr() {
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n'
}

Renderer.prototype.list = function list(body, ordered, checked) {
    const listType = ordered ? 'ol' : 'ul'
    const listClass = checked ? 'contains-task-list' : 'contains-list'
    return '<' + listType
    + ' class="'
    + listClass
    + '">\n'
    + body
    + '</'
    + listType
    + '>\n'
}

Renderer.prototype.listitem = function listitem(text, checked) {
    const isCheckedItem = typeof checked === 'boolean'
    const itemclass = isCheckedItem ? 'task-list-item' : 'list-item'
    const checkeddom = isCheckedItem ? '<input class="task-list-item-checkbox"'
    + (checked ? ' checked="checked"' : '')
    + ' type="checkbox" disabled="disabled">\n' : ''
    return '<li class="' + itemclass + '">' + checkeddom + text + '</li>\n'
}

Renderer.prototype.paragraph = function paragraph(text) {
    return '<p>' + text + '</p>\n'
}

Renderer.prototype.table = function table(header, body) {
    return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n'
}

Renderer.prototype.tablerow = function tablerow(content) {
    return '<tr>\n' + content + '</tr>\n'
}

Renderer.prototype.tablecell = function tablecell(content, flags) {
    const tableType = flags.header ? 'th' : 'td';
    const tableTag = flags.align ?
    '<' + tableType + ' style="text-align:' + flags.align + '">' : '<' + tableType + '>'
    return tableTag + content + '</' + tableType + '>\n'
}

// span level renderer
Renderer.prototype.strong = function strong(text) {
    return '<strong>' + text + '</strong>'
}

Renderer.prototype.em = function em(text) {
    return '<em>' + text + '</em>'
}

Renderer.prototype.codespan = function codespan(text) {
    return '<code>' + text + '</code>'
}

Renderer.prototype.br = function br() {
    return this.options.xhtml ? '<br/>' : '<br>'
}

Renderer.prototype.del = function del(text) {
    return '<del>' + text + '</del>'
}

Renderer.prototype.link = function link(href, title, text) {
    const jsStr = 'javascript'
    if (this.options.sanitize) {
        let prot
        try {
            prot = decodeURIComponent(unescape(href))
                .replace(/[^\w:]/g, '')
                .toLowerCase()
        } catch (e) {
            return ''
        }
        if (prot.indexOf(jsStr + ':') === 0 ||
            prot.indexOf('vbscript:') === 0 ||
            prot.indexOf('data:') === 0) {
            return ''
        }
    }
    let out = '<a href="' + href + '"'
    if (title) {
        out += ' title="' + title + '"'
    }
    out += '>' + text + '</a>'
    return out
}

Renderer.prototype.image = function image(href, title, text) {
    let out = '<img src="' + href + '" alt="' + text + '"'
    if (title) {
        out += ' title="' + title + '"'
    }
    out += this.options.xhtml ? '/>' : '>'
    return out
}

Renderer.prototype.text = renHtml
Renderer.prototype.blank = renHtml
Renderer.prototype.toc = function renToc(items) {
    items[0] = '<ul class="toc-tree">'
    const html = '<div class="toc">'
    + items.join('\n')
    + '</div>'
    return html
}
Renderer.prototype.tocItem = function tocItem(id, level, text) {
    if (!id && !text && level) {
        return '<li class="toc-item toc-level-' + level + '">'
    }
    return '<li class="toc-item toc-level-'
        + level
        + '"><a class="toc-link" href="#'
        + zescape(id)
        + '"><span class="toc-number"></span><span class="toc-text">'
        + text
        + '</span></a>'
}
/* Renderer.prototype.emoji = function emoji(emojiName) {
    const title = ':' + zescape(emojiName) + ':'
    return '<img src="https://cdn.bootcss.com/emojify.js/1.0/images/basic/'
        + encodeURIComponent(emojiName)
        + '.png" alt="'
        + title
        + '" title="'
        + title
        + '" class="emoji" align="absmiddle"' + this.options.xhtml ? "/>" : ">"
} */
module.exports = Renderer
