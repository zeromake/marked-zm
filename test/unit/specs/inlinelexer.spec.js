const InlineLexer = require('@/inlinelexer')

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
})
