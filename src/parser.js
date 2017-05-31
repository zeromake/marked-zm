const Renderer = require('./renderer')
const InlineLexer = require('./inlinelexer')
const defaults = require('./defaults')
const tokenParser = require('./token-parser')

function Parser(options) {
    this.tokens = []
    this.token = null
    this.options = options || defaults
    this.options.renderer = this.options.renderer || new Renderer()
    this.renderer = this.options.renderer
    this.renderer.options = this.options
    this.tokenParser = Parser.tokenParser
}

/**
 * Static Parse Method
 */
Parser.tokenParser = tokenParser
Parser.parse = function staticParse(param, options, renderer) {
    const parser = new Parser(options, renderer)
    return parser.parse(param)
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function parse(state) {
    const src = state.tokens
    this.tocs = state.tocs
    this.inline = new InlineLexer(state.links, this.options, this.renderer)
    this.index = 0
    this.tokenLen = src.length
    this.tokens = src // .reverse()
    let parseOut = ''
    this.tocRender = null
    while (this.next()) {
        parseOut += this.tok()
    }
    return parseOut
}

/**
 * Next Token
 */

Parser.prototype.next = function parNext() {
    if (this.index > this.tokenLen - 1) {
        return false
    }
    this.token = this.tokens[this.index] // .pop()
    this.index += 1
    return this.token
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function peek() {
    return this.index < this.tokenLen ? this.tokens[this.index] : 0
    // return this.tokens[this.tokens.length - 1] || 0
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function parseText() {
    let textBody = this.token.text
    while (this.peek().type === 'text') {
        textBody += '\n' + this.next().text
    }

    return this.inline.output(textBody)
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function parTok() {
    const tokenFun = this.tokenParser[this.token.type]
    if (typeof tokenFun === 'function') {
        return tokenFun.call(null, this)
    }
    const renderer = this.renderer[this.token.type]
    if (typeof renderer === 'function') {
        return renderer.call(this.renderer, this.token, this)
    }
    return this.token.text
}

module.exports = Parser
