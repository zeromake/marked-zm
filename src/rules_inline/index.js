const { escape } = require('../utils')

function newline(state) {
    const cap = /^\n+/.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += '<br/>'
        return 1
    }
    return -1
}

function emoji(state) {
    const cap = state.rules.emoji.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += this.renderer.emoji(cap[1])
        return 1
    }
    return -1
}

function icon(state) {
    const cap = state.rules.icon.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += this.renderer.html(cap[0])
        return 1
    }
    return -1
}

function ruleEscape(state) {
    const cap = state.rules.escape.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += cap[1]
        return 1
    }
    return -1
}

function autolink(state) {
    const cap = state.rules.autolink.exec(state.src)
    if (cap) {
        let texts
        let href
        state.src = state.src.substring(cap[0].length)
        if (cap[2] === '@') {
            texts = cap[1].charAt(6) === ':' ? this.mangle(cap[1].substring(7)) : this.mangle(cap[1]);
            href = this.mangle('mailto:') + texts
        } else {
            texts = escape(cap[1])
            href = texts
        }
        state.out += this.renderer.link(href, null, texts)
        return 1
    }
    return -1
}

function url(state) {
    const cap = state.rules.url.exec(state.src)
    if (!state.inLink && cap) {
        state.src = state.src.substring(cap[0].length)
        const texts = escape(cap[1])
        const href = texts
        state.out += this.renderer.link(href, null, texts)
        return 1
    }
    return -1
}

function tag(state) {
    const cap = state.rules.tag.exec(state.src)
    if (cap) {
        if (!state.inLink && /^<a /i.test(cap[0])) {
            state.inLink = true
        } else if (state.inLink && /^<\/a>/i.test(cap[0])) {
            state.inLink = false
        }
        state.src = state.src.substring(cap[0].length)
        let addOut = this.options.sanitize && this.options.sanitizer ?
        this.options.sanitizer(cap[0]) : escape(cap[0])
        addOut = this.options.sanitize ? addOut : cap[0]
        state.out += addOut
        return 1
    }
    return -1
}

function link(state) {
    const cap = state.rules.link.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.inLink = true
        state.out += this.outputLink(cap, {
            href: cap[2],
            title: cap[3],
        })
        state.inLink = false
        return 1
    }
    return -1
}

function refnolink(state) {
    const cap = state.rules.reflink.exec(state.src) || state.rules.nolink.exec(state.src)
    if (cap) {
        let linkObj
        state.src = state.src.substring(cap[0].length)
        linkObj = (cap[2] || cap[1]).replace(/\s+/g, ' ')
        linkObj = this.links[linkObj.toLowerCase()]
        if (!linkObj || !linkObj.href) {
            state.out += cap[0].charAt(0)
            state.src = cap[0].substring(1) + state.src
            return 1
        }
        state.inLink = true
        state.out += this.outputLink(cap, linkObj)
        state.inLink = false
        return 1
    }
    return -1
}

function strong(state) {
    const cap = state.rules.strong.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += this.renderer.strong(state.output(cap[2] || cap[1]))
        return 1
    }
    return -1
}

function em(state) {
    const cap = state.rules.em.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += this.renderer.em(state.output(cap[2] || cap[1]))
        return 1
    }
    return -1
}

function code(state) {
    const cap = state.rules.code.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += this.renderer.codespan(escape(cap[2], true))
        return 1
    }
    return -1
}

function br(state) {
    const cap = state.rules.br.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += this.renderer.br()
        return 1
    }
    return -1
}

function del(state) {
    const cap = state.rules.del.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += this.renderer.del(state.output(cap[1]))
        return 1
    }
    return -1
}

function text(state) {
    const cap = state.rules.text.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += this.renderer.text(escape(this.smartypants(cap[0])))
        return 1
    }
    return -1
}

const _rules = [
    ['newline', newline, 10],
    ['emoji', emoji, 20],
    ['icon', icon, 30],
    ['escape', ruleEscape, 40],
    ['autolink', autolink, 50],
    ['url', url, 60],
    ['tag', tag, 70],
    ['link', link, 80],
    ['refnolink', refnolink, 90],
    ['strong', strong, 100],
    ['em', em, 110],
    ['code', code, 120],
    ['br', br, 130],
    ['del', del, 140],
    ['text', text, 150]
]
module.exports = _rules
