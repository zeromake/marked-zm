const defaults = require('./defaults')
const block = require('./block')
const blockFun = require('./rules_block')
const { merge, sortRules } = require('./utils')

function Lexer(options) {
    this.block = sortRules(blockFun)
    this.options = options || defaults
    this.rules = block.normal
    if (this.options.gfm) {
        if (this.options.tables) {
            this.rules = block.tables
        } else {
            this.rules = block.gfm
        }
    }
    this.state = {
        tokens: [],
        tocs: [],
        rules: this.rules,
        links: {},
        token: (src, top, bq, offset) => {
            const oldstate = {
                src: this.state.src,
                top: this.state.top,
                bq: this.state.bq,
                offset: this.state.offset
            }
            const state = this.token(src, top, bq, offset)
            merge(this.state, oldstate)
            return state
        }
    }
}
Lexer.rules = block
Lexer.block = blockFun
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
    this.state.top = top
    this.state.src = src
    this.state.bq = bq
    this.state.offset = offsetStart || 0
    // console.log('src:', src);
    while (this.state.src) {
        let flag = false
        let i
        let offset = this.state.offset
        for (i = 0; i < this.block.length; i++) {
            const rule = this.block[i]
            if (rule && rule.length > 1 && typeof rule[1] === 'function') {
                if (rule[1].call(this, this.state)) {
                    if (offset < this.state.offset) {
                        offset = this.state.offset
                    } else {
                        throw new Error('offset no change: '
                            + rule[0]
                            + ';last offset: '
                            + offset + 'now offset: '
                            + this.state.offset)
                    }
                    flag = true
                    break
                }
            } else {
                throw new Error('rule is not array or index=1 not is function:', rule)
            }
        }
        if (flag) {
            continue
        }
        if (this.state.src) {
            throw new Error('Infinite loop on byte: ' + src.charCodeAt(0))
        }
    }
    return this.state
}
module.exports = Lexer
