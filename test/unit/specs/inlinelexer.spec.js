const InlineLexer = require('../../../src/inlinelexer')

describe('Test InlineLexer', () => {
    const inlinelexer = new InlineLexer({})
    /* it('emoji', () => {
        expect(inlinelexer.output('test:up:fsdf'))
            .toEqual('test<img src="https://cdn.bootcss.com/emojify.js/1.0/images/basic/up.png" alt=":up:" title=":up:" class="emoji" align="absmiddle"/>fsdf')
    }) */
    it('html', () => {
        expect(inlinelexer.output('test<i class="sfdsf">test'))
            .to.equal('test<i class="sfdsf">test')
    })
    it('escape', () => {
        expect(inlinelexer.output('\\[test[]'))
            .to.equal('[test[]')
    })
    it('autolink', () => {
        expect(/^<a href="(&#\w+;)+">(&#\w+;)+<\/a>$/.test(inlinelexer.output('<fly-zero@hotmail.com>')))
            .to.true
        expect(/^<a href="(&#\w+;)+">(&#\w+;)+<\/a>$/.test(inlinelexer.output('<mailto:fly-zero@hotmail.com>')))
            .to.true
        expect(inlinelexer.output('<https://blog.zeromake.com>'))
            .to.equal('<a href="https://blog.zeromake.com">https://blog.zeromake.com</a>')
        const inlinelexer1 = new InlineLexer({}, {
            mangle: false
        })
        expect(inlinelexer1.output('<mailto:fly-zero@hotmail.com>'))
            .to.equal('<a href="mailto:fly-zero@hotmail.com">fly-zero@hotmail.com</a>')
    })
    it('url', () => {
        expect(inlinelexer.output('https://blog.zeromake.com'))
            .to.equal('<a href="https://blog.zeromake.com">https://blog.zeromake.com</a>')
    })
    it('tag', () => {
        const newinlinelexer = new InlineLexer({}, {
            sanitize: true,
            sanitizer: function (src) {
                return 'sanitizer' + src
            }
        })
        expect(inlinelexer.output('<!--test-->'))
            .to.equal('<!--test-->')
        expect(inlinelexer.output('<a href="#test">test</a>'))
            .to.equal('<a href="#test">test</a>')
        expect(newinlinelexer.output('<a href="#test">test</a>'))
            .to.equal('sanitizer<a href="#test">testsanitizer</a>')
    })
    it('link', () => {
        expect(inlinelexer.output('[test](https://blog.zeromake.com)'))
            .to.equal('<a href="https://blog.zeromake.com">test</a>')
        expect(inlinelexer.output('[test](https://blog.zeromake.com "title test")'))
            .to.equal('<a href="https://blog.zeromake.com" title="title test">test</a>')
        expect(inlinelexer.output('![alt text](https://github.com/icon48.png "title text")'))
            .to.equal('<img src="https://github.com/icon48.png" alt="alt text" title="title text">')
    })
    it('refnolink', () => {
        const newinlinelexer = new InlineLexer({
            blog: {href: 'https://blog.zeromake.com'}
        })
        expect(newinlinelexer.output('[test][blog]'))
            .to.equal('<a href="https://blog.zeromake.com">test</a>')
    })
    it('strong', () => {
        expect(inlinelexer.output('__test__'))
            .to.equal('<strong>test</strong>')
    })
    it('em', () => {
        expect(inlinelexer.output('*test*'))
            .to.equal('<em>test</em>')
    })
    it('code', () => {
        expect(inlinelexer.output('`javascript`'))
            .to.equal('<code>javascript</code>')
    })
    it('br', () => {
        expect(inlinelexer.output('   \ntest'))
            .to.equal('<br>test')
    })
    it('del', () => {
        expect(inlinelexer.output('~~test~~'))
            .to.equal('<del>test</del>')
    })
    it('not links', () => {
        try {
            const inlinelexer1 = new InlineLexer()
        } catch(e) {
            expect(e.message).to.equal('Tokens array requires a `links` property.')
            expect(e.name).to.equal('Error')
        }
    })
    it('option breaks', () => {
        const inlinelexer1 = new InlineLexer({}, {
            gfm: true,
            breaks: true
        })
    })
    it('option pedantic', () => {
        const inlinelexer1 = new InlineLexer({}, {
            gfm: false,
            pedantic: true
        })
    })
    it('static output', () => {
        expect(InlineLexer.output('~~test~~', {}))
            .to.equal('<del>test</del>')
    })
    it('error rule', () => {
        InlineLexer.rulesInline.push(['test', null, 1])
        const inlinelexer1 = new InlineLexer({})
        InlineLexer.rulesInline.pop()
        try {
            inlinelexer1.output('~~test~~', {})
        } catch (e) {
            expect(e.message).to.equal('rule is not array or index=1 not is function:test,,1')
            expect(e.name).to.equal('Error')
        }

    })
    it('error rule not sub src', () => {
        const old = InlineLexer.rulesInline
        InlineLexer.rulesInline = [['test', function() {
            return false
        }, 1]]
        const inlinelexer1 = new InlineLexer({})
        InlineLexer.rulesInline = old
        try {
            inlinelexer1.output('~~test~~', {})
        } catch (e) {
            expect(e.message).to.equal('Infinite loop on byte: 126')
            expect(e.name).to.equal('Error')
        }

    })
    it('text', () => {
        const inlinelexer1 = new InlineLexer({}, {
            smartypants: true
        })
        expect(inlinelexer1.output('test'))
            .to.equal('test')
    })
})
