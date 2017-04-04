const merge = require('./utils/merge')
const zescape = require('./utils/zescape')
const Lexer = require('./lexer')
const Parser = require('./parser')
const Renderer = require('./renderer')
const InlineLexer = require('./inlinelexer')
const defaults = require('./defaults')
/**
 * marked 的入口
 * @param  {string} src 要被解析的原字符串: 必须
 * @param  {object|markedCallback} opt 配置对象或回调函数: 可选
 * @param  {markedCallback} callback 回调函数: 可选
 * @return {string} 返回字符串，但是如果设置来回调则会通过回调输出
 */
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
        let state
        let i = 0
        try {
            state = Lexer.lex(src, opt)
            tokens = state.tokens
        } catch (e) {
            return callback(e)
        }
        pending = tokens.length
        const done = (err) => {
            if (err) {
                opt.highlight = highlight
                return callback(err)
            }
            let out
            try {
                out = Parser.parse(state, opt)
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

        const highlightHandle = function highlightHandleFun(token) {
            return (err, code) => {
                if (err) return done(err)
                if (code == null || token.text === code) {
                    return (pending -= 1) || done()
                }
                token.text = code
                token.escaped = true
                pending -= 1
                if (!pending)done()

                return undefined
            }
        }
        for (; i < tokens.length; i += 1) {
            const token = tokens[i]
            if (token.type !== 'code') {
                pending -= 1
                if (!pending)done()
            } else {
                highlight(token.text, token.lang, highlightHandle(token))
            }
        }
        return null
    }
    try {
        if (opt) opt = merge({}, marked.defaults, opt)
        return Parser.parse(Lexer.lex(src, opt), opt)
    } catch (e) {
        e.message += '\nPlease report this to https://github.com/zeromake/marked-zm';
        if ((opt || marked.defaults).silent) {
            return '<p>An error occured:</p><pre>'
            + zescape(e.message + '', true)
            + '</pre>';
        }
        throw e;
    }
}

/**
 * marked回调
 * @callback markedCallback
 * @param {Error} e 错误对象为null则没有错误
 * @param {string} out 解析后的html字符串，发生错误为undefined
 */

marked.setOptions = (opt) => {
    merge(marked.defaults, opt)
    return marked
}
marked.use = function use(plugin) {
    const pluginConfig = plugin.call(this, this)
    const { type, block, inline, blocklv, inlinelv, parser, renderer } = pluginConfig
    if (type) {
        if (typeof block === 'function') {
            this.Lexer.block.push([type, block, blocklv || 11])
        }
        if (typeof inline === 'function') {
            this.InlineLexer.rulesInline.push([type, inline, inlinelv || 11])
        }
        if (typeof parser === 'function') {
            this.Parser.tokenParser[type] = parser
        }
        if (typeof renderer === 'function') {
            this.Renderer.prototype[type] = renderer
        }
    }
}
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
