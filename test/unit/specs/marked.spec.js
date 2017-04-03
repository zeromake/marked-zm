const marked = require('../../../src/marked')

describe('Test marked', () => {
    it('head', () => {
        expect(marked('# test'))
            .to.equal('<h1><a class="anchor" name="test" href="#test"><svg aria-hidden="true" class="octicon octicon-link" height="16" version="1.1" viewBox="0 0 16 16" width="16"><path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>test</h1>')
    })
    it('marked use', () => {
        marked.use(function(marked) {
            var blockReg = /^ *\${2}(.*?)\${2} *(\n+|$)/
            var inlineReg = /^\$(.*?)\$/
            var type = 'katex'
            return {
                type,
                block(state, env) {
                    const cap = blockReg.exec(state.src)
                    if (cap) {
                        var offsetLen = cap[0].length
                        var offsetStart = state.offset
                        var offsetEnd = offsetStart + offsetLen
                        state.src = state.src.substring(offsetLen)
                        env.tokens.push({
                            type,
                            text: cap[1],
                            start: offsetStart,
                            end: offsetEnd
                        })
                        state.offset = offsetEnd
                        return true
                    }
                },
                parser(env) {
                    return env.renderer.paragraph(env.renderer[type](env.token.text))
                },
                inline(state, env) {
                    const cap = inlineReg.exec(state.src)
                    if (cap) {
                        var offsetLen = cap[0].length
                        state.src = state.src.substring(offsetLen)
                        state.out += env.renderer[type](cap[1])
                        return true
                    }
                },
                renderer(text, renderer) {
                    return 'katex: ' + text
                }
            }
        })
        expect(marked('$test$')).to.equal('<p>katex: test</p>\n')
        expect(marked('afdsfds$test$sdfds')).to.equal('<p>afdsfdskatex: testsdfds</p>\n')
    })
    it('callback', () => {
        expect(marked('$test$', function(e, out) {
            expect(e).to.null
            expect(out).to.equal('<p>katex: test</p>\n')
        })).to.undefined
        //
    })
    it('Lexer error', () => {
        const old = marked.Lexer.block
        marked.Lexer.block = [['test1', () => {}, 1]]
        marked('test', function(e) {
            expect(e.message).to.equal('Infinite loop on byte: 116')
            expect(e.name).to.equal('Error')
            marked.Lexer.block = old
        })
    })
    it('highlight', () => {
        marked('test\n``` js\nfunction test() {\n    return true\n}```',
            {
                highlight: function(code, lang, callback) {
                    callback(null, 'test:' + code)
                }
            },
            function(e, out) {
                expect(e).to.null
                expect(out).to.equal(
                    '<p>test</p>\n<pre class="code lang-js">'
                    +'<code class="lang-js">test:function '
                    +'test() {\n    return true\n}\n</code></pre>\n'
                )
            }
        )
    })
    it('highlight error', () => {
        marked('test\n``` js\nfunction test() {\n    return true\n}```\ntest',
            {
                highlight: function(code, lang, callback) {
                    callback('error', 'test:' + code)
                }
            },
            function(e, out) {
                expect(e).to.equal('error')
                expect(out).to.undefined
            }
        )
    })
    it('highlight parser error', () => {
        const old = marked.Parser.tokenParser.hr
        marked.Parser.tokenParser.hr = function() {
            throw new Error('test')
        }
        marked('test\n``` js\nfunction test() {\n    return true\n}```\n---',
            {
                highlight: function(code, lang, callback) {
                    callback(null, null)
                }
            },
            function(e, out) {

                marked.Parser.tokenParser.hr = old
                expect(e.message).to.equal('test')
                expect(out).to.undefined
            }
        )
    })
    it('highlight code last', () => {
        marked('test\n``` js\nfunction test() {\n    return true\n}```',
            {
                highlight: function(code, lang, callback) {
                    callback(null, null)
                }
            },
            function(e, out) {
                expect(e).to.null
                expect(out).to.equal(
                    '<p>test</p>\n<pre class="code lang-js">'
                    +'<code class="lang-js">function '
                    +'test() {\n    return true\n}\n</code></pre>\n'
                )
            }
        )
    })
    it('highlight tokens len == 0', () => {
        marked('',
            {
                highlight: function(code, lang, callback) {
                    callback(null, null)
                }
            },
            function(e, out) {
                expect(e).to.null
                expect(out).to.equal('')
            }
        )
    })
    it('option', () => {
        expect(marked('', {})).to.equal('')
    })
    it('marked error', () => {
        const old = marked.Lexer.block
        marked.Lexer.block = [['test1', null, 1]]
        expect(marked('ds', { silent: true })).to.equal(
            '<p>An error occured:</p><pre>rule is not array or index=1 not is function:test1,,1\n'
            +'Please report this to https://github.com/zeromake/marked-zm</pre>'
        )

        try {
            marked('ds')
        } catch(e) {
            expect(e.message).to.equal(
                'rule is not array or index=1 not is function:test1,,1\n'
                +'Please report this to https://github.com/zeromake/marked-zm'
            )
        }
        marked.Lexer.block = old
    })
    it('marked setOption', () => {
        marked.setOptions({})
        expect(marked('test')).to.equal('<p>test</p>\n')
    })
})
