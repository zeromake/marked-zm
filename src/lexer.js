const defaults = require('./defaults')
const block = require('./block')
const blockFun = require('./rules_block')
const sortRules = require('./utils/sort-rules')
const merge = require('./utils/merge')

function Lexer(options) {
    this.block = sortRules(Lexer.block)
    this.options = options ? merge({}, defaults, options) : defaults
    this.rules = block.normal
    this.tokens = []
    this.tocs = []
    this.links = {}
    if (this.options.gfm) {
        if (this.options.tables) {
            this.rules = block.tables
        } else {
            this.rules = block.gfm
        }
    }
}
Lexer.rules = block
Lexer.block = blockFun.slice(0)
Lexer.lex = function staticLex(src, options) {
    const lexer = new Lexer(options)
    return lexer.lex(src)
}
Lexer.prototype.lex = function lex(src) {
    src = src
        .replace(/\r\n|\r/g, '\n')
        .replace(/\t/g, '    ')
        .replace(/\u00a0/g, ' ')
        .replace(/\u2424/g, '\n')

    return this.token(src, true)
}
Lexer.prototype.token = function token(src, top, bq, offsetStart) {
    src = src.replace(/^ +$/gm, '')
    const state = {
        src,
        top,
        bq,
        offset: offsetStart || 0
    }
    const blockLen = this.block.length
    while (state.src) {
        let flag = false
        let i
        let offset = state.offset
        for (i = 0; i < blockLen; i += 1) {
            const rule = this.block[i]
            if (rule && rule.length > 1 && typeof rule[1] === 'function') {
                if (rule[1].call(null, state, this)) {
                    if (offset < state.offset) {
                        offset = state.offset
                    } else {
                        throw new Error('offset no change: '
                            + rule[0]
                            + ';last offset: '
                            + offset + 'now offset: '
                            + state.offset)
                    }
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
    return { tokens: this.tokens, tocs: this.tocs, links: this.links }
}
module.exports = Lexer
