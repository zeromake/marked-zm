const InlineLexer = require('../../src/inlinelexer')

describe('Test InlineLexer', () => {
    const inlinelexer = new InlineLexer({})
    /* it('emoji', () => {
        expect(inlinelexer.output('test:up:fsdf'))
            .toEqual('test<img src="https://cdn.bootcss.com/emojify.js/1.0/images/basic/up.png" alt=":up:" title=":up:" class="emoji" align="absmiddle"/>fsdf')
    }) */
    it('html', () => {
        expect(inlinelexer.output('test<i class="sfdsf">test'))
            .toEqual('test<i class="sfdsf">test')
    })
    it('escape', () => {
        expect(inlinelexer.output('\\[test[]'))
            .toEqual('[test[]')
    })
    it('autolink', () => {
        expect(/^<a href="(&#\w+;)+">(&#\w+;)+<\/a>$/.test(inlinelexer.output('<fly-zero@hotmail.com>')))
            .toEqual(true)
        expect(/^<a href="(&#\w+;)+">(&#\w+;)+<\/a>$/.test(inlinelexer.output('<mailto:fly-zero@hotmail.com>')))
            .toEqual(true)
        expect(inlinelexer.output('<https://blog.zeromake.com>'))
            .toEqual('<a href="https://blog.zeromake.com">https://blog.zeromake.com</a>')
    })
    it('url', () => {
        expect(inlinelexer.output('https://blog.zeromake.com'))
            .toEqual('<a href="https://blog.zeromake.com">https://blog.zeromake.com</a>')
    })
    it('tag', () => {
        const newinlinelexer = new InlineLexer({}, {
            sanitize: true,
            sanitizer: function (src) {
                return 'sanitizer' + src
            }
        })
        expect(inlinelexer.output('<!--test-->'))
            .toEqual('<!--test-->')
        expect(inlinelexer.output('<a href="#test">test</a>'))
            .toEqual('<a href="#test">test</a>')
        expect(newinlinelexer.output('<a href="#test">test</a>'))
            .toEqual('sanitizer<a href="#test">testsanitizer</a>')
    })
    it('link', () => {
        expect(inlinelexer.output('[test](https://blog.zeromake.com)'))
            .toEqual('<a href="https://blog.zeromake.com">test</a>')
    })
    it('refnolink', () => {
        const newinlinelexer = new InlineLexer({
            blog: {href: 'https://blog.zeromake.com'}
        })
        expect(newinlinelexer.output('[test][blog]'))
            .toEqual('<a href="https://blog.zeromake.com">test</a>')
    })
    it('strong', () => {
        expect(inlinelexer.output('__test__'))
            .toEqual('<strong>test</strong>')
    })
    it('em', () => {
        expect(inlinelexer.output('*test*'))
            .toEqual('<em>test</em>')
    })
    it('code', () => {
        expect(inlinelexer.output('`javascript`'))
            .toEqual('<code>javascript</code>')
    })
    it('br', () => {
        expect(inlinelexer.output('   \ntest'))
            .toEqual('<br>test')
    })
    it('del', () => {
        expect(inlinelexer.output('~~test~~'))
            .toEqual('<del>test</del>')
    })
})
