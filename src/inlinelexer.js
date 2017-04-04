const Renderer = require('./renderer')
const defaults = require('./defaults')
const zescape = require('./utils/zescape')
const sortRules = require('./utils/sort-rules')
const inline = require('./inline')
const rulesInline = require('./rules_inline')

/**
 *
 * Inline Lexer & Compiler
 * @constructs InlineLexer
 * @param {object} links    name: link的链接对象:必须
 * @param {object} options  配置对象: 可选
 * @param {object} renderer renderer对象实例: 可选
 */
function InlineLexer(links, options, renderer) {
    this.options = options || defaults
    this.links = links
    this.rules = inline.normal
    this.renderer = renderer || this.options.renderer || new Renderer()
    this.renderer.options = this.options
    this.rulesInline = sortRules(InlineLexer.rulesInline)
    if (!this.links) {
        throw new Error('Tokens array requires a `links` property.')
    }

    if (this.options.gfm) {
        if (this.options.breaks) {
            this.rules = inline.breaks
        } else {
            this.rules = inline.gfm
        }
    } else if (this.options.pedantic) {
        this.rules = inline.pedantic
    }
}

/**
 * Expose Inline Rules
 */
InlineLexer.rules = inline
/**
 * rulesInline
 * @type {Array}
 */
InlineLexer.rulesInline = rulesInline.slice(0)
/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function staticOutput(src, links, options) {
    const inlineObj = new InlineLexer(links, options)
    return inlineObj.output(src)
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function output(src) {
    const state = {
        src,
        out: ''
    }
    const rulesInlineLen = this.rulesInline.length
    while (state.src) {
        let flag = false
        let i
        for (i = 0; i < rulesInlineLen; i += 1) {
            const rule = this.rulesInline[i]
            if (rule && rule.length > 1 && typeof rule[1] === 'function') {
                const tok = rule[1].call(this, state, this)
                if (tok) {
                    flag = true
                    break
                }
            } else {
                throw new Error('rule is not array or index=1 not is function:' + rule)
            }
        }
        if (!flag && state.src) {
            throw new Error('Infinite loop on byte: ' + src.charCodeAt(0))
        }
    }

    return state.out
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function outputLink(cap, link) {
    const href = zescape(link.href)
    const title = link.title ? zescape(link.title) : null

    return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, zescape(cap[1]))
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function smartypants(text) {
    if (!this.options.smartypants) return text
    return text
        // em-dashes
        .replace(/---/g, '\u2014')
        // en-dashes
        .replace(/--/g, '\u2013')
        // opening singles
        .replace(/(^|[-\u2014/([{"\s])'/g, '$1\u2018')
        // closing singles & apostrophes
        .replace(/'/g, '\u2019')
        // opening doubles
        .replace(/(^|[-\u2014/([{\u2018\s])"/g, '$1\u201c')
        // closing doubles
        .replace(/"/g, '\u201d')
        // ellipses
        .replace(/\.{3}/g, '\u2026')
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function mangle(text) {
    if (!this.options.mangle) return text
    let out = ''
    const l = text.length
    let i = 0
    let ch

    for (; i < l; i += 1) {
        ch = text.charCodeAt(i);
        if (Math.random() > 0.5) {
            ch = 'x' + ch.toString(16)
        }
        out += '&#' + ch + ';'
    }

    return out
}


module.exports = InlineLexer
