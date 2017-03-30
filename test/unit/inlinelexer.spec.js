const InlineLexer = require('../../src/inlinelexer')

describe('Test InlineLexer', () => {
    const inlinelexer = new InlineLexer({})
    /* it('emoji', () => {
        expect(inlinelexer.output('test:up:fsdf'))
            .toEqual('test<img src="https://cdn.bootcss.com/emojify.js/1.0/images/basic/up.png" alt=":up:" title=":up:" class="emoji" align="absmiddle"/>fsdf')
    }) */
    it('html', () => {
        expect(inlinelexer.output('test<div>test</div>'))
            .toEqual('test<div>test</div>')
    })
})
