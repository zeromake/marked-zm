function Renderer(options) {
    this.options = options || {};
}

Renderer.prototype.code = function renCode(code, lang, escaped) {
    if (this.options.highlight) {
        const codeOut = this.options.highlight(code, lang);
        if (codeOut != null && codeOut !== code) {
            escaped = true;
            code = codeOut;
        }
    }

    if (!lang) {
        return '<pre><code>'
        + (escaped ? code : escape(code, true))
        + '\n</code></pre>'
    }

    return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n'
};

Renderer.prototype.blockquote = function blockquote(quote) {
    return '<blockquote>\n' + quote + '</blockquote>\n'
};

Renderer.prototype.html = function renHtml(html) {
    return html
};

Renderer.prototype.heading = function heading(text, level, raw) {
    return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">' + text + '</h' + level + '>\n';
};

Renderer.prototype.hr = function hr() {
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n'
};

Renderer.prototype.list = function list(body, ordered) {
    const listType = ordered ? 'ol' : 'ul'
    return '<' + listType + '>\n' + body + '</' + listType + '>\n'
};

Renderer.prototype.listitem = function listitem(text) {
    return '<li>' + text + '</li>\n'
};

Renderer.prototype.paragraph = function paragraph(text) {
    return '<p>' + text + '</p>\n'
};

Renderer.prototype.table = function table(header, body) {
    return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function tablerow(content) {
    return '<tr>\n' + content + '</tr>\n'
};

Renderer.prototype.tablecell = function tablecell(content, flags) {
    const tableType = flags.header ? 'th' : 'td';
    const tableTag = flags.align ?
    '<' + tableType + ' style="text-align:' + flags.align + '">' : '<' + tableType + '>'
    return tableTag + content + '</' + tableType + '>\n'
};

// span level renderer
Renderer.prototype.strong = function strong(text) {
    return '<strong>' + text + '</strong>'
};

Renderer.prototype.em = function em(text) {
    return '<em>' + text + '</em>'
};

Renderer.prototype.codespan = function codespan(text) {
    return '<code>' + text + '</code>'
};

Renderer.prototype.br = function br() {
    return this.options.xhtml ? '<br/>' : '<br>'
};

Renderer.prototype.del = function del(text) {
    return '<del>' + text + '</del>'
};

Renderer.prototype.link = function link(href, title, text) {
    if (this.options.sanitize) {
        let prot
        try {
            prot = decodeURIComponent(unescape(href))
                .replace(/[^\w:]/g, '')
                .toLowerCase()
        } catch (e) {
            return ''
        }
        if (prot.indexOf('javascript:') === 0 ||
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
};

Renderer.prototype.image = function image(href, title, text) {
    let out = '<img src="' + href + '" alt="' + text + '"'
    if (title) {
        out += ' title="' + title + '"'
    }
    out += this.options.xhtml ? '/>' : '>'
    return out
}

Renderer.prototype.text = function renText(text) {
    return text
}

export default Renderer
