const { zescape } = require('../utils')

function newline(state) {
    const cap = /^\n+/.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += '<br/>'
        return 1
    }
    return false
}

function emoji(state, env) {
    const cap = env.rules.emoji.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += env.renderer.emoji(cap[1])
        return 1
    }
    return false
}

function html(state, env) {
    const cap = env.rules.html.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += env.renderer.html(cap[0])
        return 1
    }
    return false
}

function ruleEscape(state, env) {
    const cap = env.rules.escape.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += cap[1]
        return 1
    }
    return false
}

function autolink(state, env) {
    const cap = env.rules.autolink.exec(state.src)
    if (cap) {
        let texts
        let href
        state.src = state.src.substring(cap[0].length)
        if (cap[2] === '@') {
            texts = cap[1].charAt(6) === ':' ? env.mangle(cap[1].substring(7)) : env.mangle(cap[1])
            href = env.mangle('mailto:') + texts
        } else {
            texts = zescape(cap[1])
            href = texts
        }
        state.out += env.renderer.link(href, null, texts)
        return 1
    }
    return false
}

function url(state, env) {
    const cap = env.rules.url.exec(state.src)
    if (!env.inLink && cap) {
        state.src = state.src.substring(cap[0].length)
        const texts = zescape(cap[1])
        const href = texts
        state.out += env.renderer.link(href, null, texts)
        return 1
    }
    return false
}

function tag(state, env) {
    const cap = env.rules.tag.exec(state.src)
    if (cap) {
        if (!env.inLink && /^<a /i.test(cap[0])) {
            env.inLink = true
        } else if (env.inLink && /^<\/a>/i.test(cap[0])) {
            env.inLink = false
        }
        state.src = state.src.substring(cap[0].length)
        let addOut = env.options.sanitize && env.options.sanitizer ?
        env.options.sanitizer(cap[0]) : zescape(cap[0])
        addOut = env.options.sanitize ? addOut : cap[0]
        state.out += addOut
        return 1
    }
    return false
}

function link(state, env) {
    const cap = env.rules.link.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        env.inLink = true
        state.out += env.outputLink(cap, {
            href: cap[2],
            title: cap[3],
        })
        env.inLink = false
        return 1
    }
    return false
}

function refnolink(state, env) {
    const cap = env.rules.reflink.exec(state.src) || env.rules.nolink.exec(state.src)
    if (cap) {
        let linkObj
        state.src = state.src.substring(cap[0].length)
        linkObj = (cap[2] || cap[1]).replace(/\s+/g, ' ')
        linkObj = env.links[linkObj.toLowerCase()]
        if (!linkObj || !linkObj.href) {
            state.out += cap[0].charAt(0)
            state.src = cap[0].substring(1) + state.src
            return 1
        }
        env.inLink = true
        state.out += env.outputLink(cap, linkObj)
        env.inLink = false
        return 1
    }
    return false
}

function strong(state, env) {
    const cap = env.rules.strong.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += env.renderer.strong(env.output(cap[2] || cap[1]))
        return 1
    }
    return false
}

function em(state, env) {
    const cap = env.rules.em.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += env.renderer.em(env.output(cap[2] || cap[1]))
        return 1
    }
    return false
}

function code(state, env) {
    const cap = env.rules.code.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += this.renderer.codespan(zescape(cap[2], true))
        return 1
    }
    return false
}

function br(state, env) {
    const cap = env.rules.br.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += env.renderer.br()
        return 1
    }
    return false
}

function del(state, env) {
    const cap = env.rules.del.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += env.renderer.del(env.output(cap[1]))
        return 1
    }
    return false
}

function text(state, env) {
    const cap = env.rules.text.exec(state.src)
    if (cap) {
        state.src = state.src.substring(cap[0].length)
        state.out += env.renderer.text(zescape(env.smartypants(cap[0])))
        return 1
    }
    return false
}

const _rules = [
    ['newline', newline, 10],
    ['emoji', emoji, 20],
    ['html', html, 30],
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
