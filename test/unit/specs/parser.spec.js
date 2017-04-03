const Parser = require('../../../src/parser')
const Renderer = require('../../../src/renderer')
const defaults = require('../../../src/defaults')
const InlineLexer = require('../../../src/inlinelexer')

describe('Test Parser', () => {
    const defParser = new Parser(defaults)
    const renderer = new Renderer(defaults)
    const inlinelexer = new InlineLexer(defaults)

    it('space', () => {
        expect(parserTokens({type: 'space'})).to.equal('')
    })
    it('hr', () => {
        expect(parserTokens({type: 'hr'})).to.equal(renderer.hr())
    })
    it('code', () => {
        const codeToken = {
            type: 'code',
            lang: 'js',
            text: 'function test () {\n    return true;\n}'
        }
        expect(parserTokens(codeToken)).to.equal(renderer.code(codeToken.text, 'js'))
    })
    it('table', () => {
        const tableToken = {
            type: 'table',
            header: ['head1'],
            align: [null],
            cells: [
                ['test1']
            ]
        }
        const headtext = renderer.tablerow(
            renderer.tablecell(
                inlinelexer.output(tableToken.header[0]),
                {
                    header: true,
                    align: tableToken.align[0]
                }
            )
        )
        const bodytext = renderer.tablerow(
            renderer.tablecell(
                inlinelexer.output(tableToken.cells[0][0]),
                {
                    header: false,
                    align: tableToken.align[0]
                }
            )
        )
        expect(parserTokens(tableToken)).to.equal(renderer.table(headtext, bodytext))
    })
    it('blockquote', () => {
        const blockquoteTokens = [
            {
                type: 'blockquote_start'
            },
            {
                type: 'hr'
            },
            {
                type: 'blockquote_end'
            }
        ]
        const body = renderer.hr()
        expect(parserTokens(blockquoteTokens)).to.equal(renderer.blockquote(body))
    })
    it('ol list', () => {
        const olListTokens = [
            {
                type: 'list_start'
            },
            {
                type: 'list_item_start'
            },
            {
                type: 'text',
                text: 'test'
            },
            {
                type: 'text',
                text: 'test1'
            },
            {
                type: 'text',
                text: 'test2'
            },
            {
                type: 'hr'
            },
            {
                type: 'list_item_end'
            },
            {
                type: 'list_end'
            }
        ]
        const body = renderer.listitem(inlinelexer.output('test\ntest1test2') + renderer.hr())
        expect(parserTokens(olListTokens)).to.equal(renderer.list(body))
    })
    it('ul list', () => {
        const ulListTokens = [
            {
                type: 'list_start',
                ordered: true
            },
            {
                type: 'loose_item_start'
            },
            {
                type: 'text',
                text: 'test'
            },
            {
                type: 'text',
                text: 'test1'
            },
            {
                type: 'list_item_end'
            },
            {
                type: 'list_end'
            }
        ]

        const body = renderer.listitem('<p>test</p>\n<p>test1</p>\n')
        expect(parserTokens(ulListTokens)).to.equal(renderer.list(body, true))
    })
    it('html', () => {
        expect(parserTokens({
            type: 'html',
            text: '<div>test</div>',
        })).to.equal(renderer.html('<div>test</div>'))
        expect(parserTokens({
            type: 'html',
            text: '<div>test</div>',
            pre: true,
        })).to.equal(renderer.html('<div>test</div>'))
    })
    it('paragraph', () => {
        expect(parserTokens({
            type: 'paragraph',
            text: 'testdsds'
        })).to.equal(renderer.paragraph(inlinelexer.output('testdsds')))
    })
    it('toc', () => {
        const tocTree = [
            '<ul>',
            renderer.tocItem('h1', 1, 'h1'),
            '<ul>',
            renderer.tocItem(null, 2),
            '<ul>',
            renderer.tocItem('h3', 3, 'h3'),
            '</li>',
            renderer.tocItem('h3-1', 3, 'h3-1'),
            '</li></ul>',
            renderer.tocItem('h2', 2, 'h2'),
            '</li></ul>',
            '</li></ul>'
        ]
        const tocStr = renderer.toc(tocTree)
        expect(parserTokens(
            [{
                type: 'toc'
            },
            {
                type: 'toc'
            }],
            null,
            [
                { text: 'h1', depth: 1 },
                { text: 'h3', depth: 3 },
                { text: 'h3-1', depth: 3 },
                { text: 'h2', depth: 2 }
            ]
        )).to.equal(tocStr + tocStr)
        expect(parserTokens({ type: 'toc' }, null, [])).to.equal('')
    })
    it('other parser', () => {
        expect(parserTokens({ type: 'test', text: 'test' })).to.equal('test')
        renderer.test = () => {
            return 'test'
        }
        expect(parserTokens({ type: 'test', text: 'test' }, null, [], {
            renderer
        })).to.equal('test')

    })
    function parserTokens(tokens, links, tocs, option) {
        if (typeof tokens === 'object' && tokens.length === undefined) {
            tokens = [tokens]
        }
        if (option){
            const parser = new Parser(option)
            return parser.parse({
                tokens,
                links: links || {},
                tocs: tocs
            })
        }
        return defParser.parse({
            tokens,
            links: links || {},
            tocs: tocs
        })
    }
})
