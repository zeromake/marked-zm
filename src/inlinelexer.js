const Renderer = require('./renderer')
const defaults = require('./defaults')
const { escape, sortRules } = require('./utils')
const inline = require('./inline')
const rulesInline = require('./rules_inline')

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
    this.options = options || defaults
    this.links = links
    this.rules = inline.normal
    this.renderer = this.options.renderer || new Renderer()
    this.renderer.options = this.options
    this.rulesInline = sortRules(rulesInline)
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
    this.state = {
        links,
        rules: this.rules,
        output: (src) => {
            const oldState = {
                src: this.state.src,
                out: this.state.out
            }
            const out = this.output(src)
            this.state.src = oldState.src
            this.state.out = oldState.out
            return out
        }
    }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline
InlineLexer.rulesInline = rulesInline
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
    this.state.src = src
    this.state.out = ''
    while (this.state.src) {
        let flag = false
        let i
        for (i = 0; i < this.rulesInline.length; i++) {
            const rule = this.rulesInline[i]
            if (rule && rule.length > 1 && typeof rule[1] === 'function') {
                const tok = rule[1].call(this, this.state)
                if (tok && tok !== -1) {
                    flag = true
                    break
                }
            } else {
                throw new Error('rule is not array or index=1 not is function:', rule)
            }
        }
        if (!flag && this.state.src) {
            throw new Error('Infinite loop on byte: ' + src.charCodeAt(0))
        }
    }

    return this.state.out
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function outputLink(cap, link) {
    const href = escape(link.href)
    const title = link.title ? escape(link.title) : null

    return cap[0].charAt(0) !== '!' ? this.renderer.link(href, title, this.output(cap[1])) : this.renderer.image(href, title, escape(cap[1]))
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

    for (; i < l; i++) {
        ch = text.charCodeAt(i);
        if (Math.random() > 0.5) {
            ch = 'x' + ch.toString(16)
        }
        out += '&#' + ch + ';'
    }

    return out
}


module.exports = InlineLexer
