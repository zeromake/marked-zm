import { merge, escape } from './utils'
import Lexer from './lexer'
import Parser from './parser'
import Renderer from './renderer'
import InlineLexer from './inlinelexer'
import defaults from './defaults'

function marked(src, opt, callback) {
    if (callback || typeof opt === 'function') {
        if (!callback) {
            callback = opt
            opt = null
        }
        opt = merge({}, marked.defaults, opt || {})
        const highlight = opt.highlight
        let tokens
        let pending
        let i = 0
        try {
            tokens = Lexer.lex(src, opt)
        } catch (e) {
            return callback(e)
        }
        pending = tokens.length
        const done = function done(err) {
            if (err) {
                opt.highlight = highlight
                return callback(err)
            }
            let out
            try {
                out = Parser.parse(tokens, opt)
            } catch (e) {
                err = e
            }
            opt.highlight = highlight
            return err ? callback(err) : callback(null, out)
        }
        if (!highlight || highlight.length < 3) {
            return done()
        }
        delete opt.highlight
        if (!pending) return done()
        for (; i < tokens.length; i++) {
            const token = tokens[i]
            if (token.type !== 'code') {
                if (!--pending)done()
                continue
            }
            highlight(token.text, token.lang, (err, code) => {
                if (err) return done(err)
                if (code == null || token.text === code) {
                    return --pending || done()
                }
                token.text = code
                token.escaped = true
                if (!--pending)done()
            })
        }
        return null
    }
    try {
        if (opt) opt = merge({}, marked.defaults, opt)
        return Parser.parse(Lexer.lex(src, opt), opt)
    } catch (e) {
        e.message += '\nPlease report this to https://github.com/chjj/marked.';
        if ((opt || marked.defaults).silent) {
            return '<p>An error occured:</p><pre>'
            + escape(e.message + '', true)
            + '</pre>';
        }
        throw e;
    }
}
marked.setOptions = (opt) => {
    merge(marked.defaults, opt)
    return marked
}
marked.setExtended = function setExtended(opt) {
    const extType = opt.type
    const renderer = opt.renderer
    const regexp = opt.regexp
    if (extType && renderer) {
        this.Renderer.prototype[extType] = renderer
    }
    if (regexp) {
        this.defaults.extended = marked.defaults.extended || []
        this.defaults.extended.push(regexp)
    }
}
marked.use = function use(plugin) {
    const args = [this].concat(Array.prototype.slice.call(arguments, 1))
    const opt = plugin.apply(plugin, args)
    this.setExtended(opt)
    return this
};
marked.options = marked.setOptions

marked.defaults = defaults
marked.Parser = Parser
marked.parser = Parser.parse

marked.Renderer = Renderer

marked.Lexer = Lexer
marked.lexer = Lexer.lex

marked.InlineLexer = InlineLexer
marked.inlineLexer = InlineLexer.output

marked.parse = marked

module.exports = marked
