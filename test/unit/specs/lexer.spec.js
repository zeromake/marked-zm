
const Lexer = require('../../../src/lexer')

describe('Test Lexer', () => {
    it('newline', () => {
        const lexer = new Lexer()
        const state = lexer.lex('\n\n')
        expect(state.tokens).to.have.lengthOf(1)
        expect(state.tokens[0].type).to.equal('space')
    })
    it('toc', () => {
        const lexer = new Lexer()
        const state = lexer.lex('[TOC]')
        expect(state.tokens).to.have.lengthOf(1)
        expect(state.tokens[0].type).to.equal('toc')
    })
    it('code', () => {
        const lexer = new Lexer()
        const state = lexer.lex('    function test(){\n        return true\n    }\n')
        expect(state.tokens).to.have.lengthOf(1)
        expect(state.tokens[0].type).to.equal('code')
        expect(state.tokens[0].text).to.equal('function test(){\n    return true\n}')
    })
    it('fences', () => {
        const lexer = new Lexer()
        const state = lexer.lex('``` javascript\nfunction test(){\n    return true\n}\n```')
        expect(state.tokens).to.have.lengthOf(1)
        expect(state.tokens[0].type).to.equal('code')
        expect(state.tokens[0].lang).to.equal('javascript')
        expect(state.tokens[0].text).to.equal('function test(){\n    return true\n}')
    })
    it('heading', () => {
        const lexer = new Lexer()
        const state = lexer.lex('# test \n## test2\n ### test3')
        expect(state.tokens).to.have.lengthOf(3)
        expect(state.tocs).to.have.lengthOf(3)
        expect(state.tokens[0].type).to.equal('heading')
        expect(state.tokens[0].text).to.equal('test')
        expect(state.tokens[0].depth).to.equal(1)
        expect(state.tokens[1].type).to.equal('heading')
        expect(state.tokens[1].text).to.equal('test2')
        expect(state.tokens[1].depth).to.equal(2)
        expect(state.tokens[2].type).to.equal('heading')
        expect(state.tokens[2].text).to.equal('test3')
        expect(state.tokens[2].depth).to.equal(3)
    })
    it('nptable', () => {
        const lexer = new Lexer()
        const tebleStr = 'Header 1 | Header 2 | Header 3 | Header 4\n--------: | :-------- | :---: | -- |\nCell 1   | Cell 2  | Cell 3  | Cell 4\nCell 5 | Cell 6 | Cell 7  | Cell 8'
        const state = lexer.lex(tebleStr)
        expect(state.tokens).to.have.lengthOf(1)
        expect(state.tokens[0].type).to.equal('table')
        expect(state.tokens[0].header).to.have.lengthOf(4)
        expect(state.tokens[0].header[0]).to.equal('Header 1')
        expect(state.tokens[0].header[1]).to.equal('Header 2')
        expect(state.tokens[0].header[2]).to.equal('Header 3')
        expect(state.tokens[0].header[3]).to.equal('Header 4')
        expect(state.tokens[0].align).to.have.lengthOf(4)
        expect(state.tokens[0].align[0]).to.equal('right')
        expect(state.tokens[0].align[1]).to.equal('left')
        expect(state.tokens[0].align[2]).to.equal('center')
        expect(state.tokens[0].align[3]).to.equal(null)
    })
    it('lheading', () => {
        const lexer = new Lexer()
        const state = lexer.lex('test\n====\n\ntest2\n---')
        expect(state.tokens).to.have.lengthOf(2)
        expect(state.tocs).to.have.lengthOf(2)
        expect(state.tokens[0].type).to.equal('heading')
        expect(state.tokens[0].text).to.equal('test')
        expect(state.tokens[0].depth).to.equal(1)
        expect(state.tokens[1].type).to.equal('heading')
        expect(state.tokens[1].text).to.equal('test2')
        expect(state.tokens[1].depth).to.equal(2)
    })
    it('hr', () => {
        const lexer = new Lexer()
        const state = lexer.lex('----\n***\n\n___')
        expect(state.tokens).to.have.lengthOf(3)
        expect(state.tokens[0].type).to.equal('hr')
        expect(state.tokens[1].type).to.equal('hr')
        expect(state.tokens[2].type).to.equal('hr')
    })
    it('blockquote', () => {
        const lexer = new Lexer()
        const state = lexer.lex('> test\n\n> test')
        expect(state.tokens).to.have.lengthOf(4)
        expect(state.tokens[0].type).to.equal('blockquote_start')
        expect(state.tokens[1].type).to.equal('paragraph')
        expect(state.tokens[2].type).to.equal('paragraph')
        expect(state.tokens[3].type).to.equal('blockquote_end')
    })
    it('list', () => {
        const lexer = new Lexer()
        const state = lexer.lex('1. dsfd\n\n2. sdfsd\n\n\n- test1\n- test2\n\n\n- [] tes\n t3')
        expect(state.tokens).to.have.lengthOf(24)
        expect(state.tokens[0].type).to.equal('list_start')
        expect(state.tokens[1].type).to.equal('loose_item_start')
        expect(state.tokens[2].type).to.equal('text')
        expect(state.tokens[3].type).to.equal('list_item_end')
        expect(state.tokens[4].type).to.equal('loose_item_start')
        expect(state.tokens[5].type).to.equal('text')
        expect(state.tokens[6].type).to.equal('space')
        expect(state.tokens[7].type).to.equal('list_item_end')
        expect(state.tokens[8].type).to.equal('list_end')
        expect(state.tokens[9].type).to.equal('list_start')
        expect(state.tokens[10].type).to.equal('list_item_start')
        expect(state.tokens[11].type).to.equal('text')
        expect(state.tokens[12].type).to.equal('list_item_end')
        expect(state.tokens[13].type).to.equal('list_item_start')
        expect(state.tokens[14].type).to.equal('text')
        expect(state.tokens[15].type).to.equal('space')
        expect(state.tokens[16].type).to.equal('list_item_end')
        expect(state.tokens[17].type).to.equal('list_end')
        expect(state.tokens[18].type).to.equal('list_start')
        expect(state.tokens[19].type).to.equal('list_item_start')
        expect(state.tokens[19].checked).to.null
        expect(state.tokens[20].type).to.equal('text')
        expect(state.tokens[21].type).to.equal('text')
        expect(state.tokens[22].type).to.equal('list_item_end')
        expect(state.tokens[23].type).to.equal('list_end')
    })
    it('html', () => {
        const lexer = new Lexer()
        const state = lexer.lex('<div>test</div>\n\n<br>')
        expect(state.tokens).to.have.lengthOf(2)
        expect(state.tokens[0].type).to.equal('html')
        expect(state.tokens[0].text).to.equal('<div>test</div>\n\n')
        expect(state.tokens[1].type).to.equal('paragraph')
        expect(state.tokens[1].text).to.equal('<br>')
    })
    it('def', () => {
        const lexer = new Lexer()
        const state = lexer.lex('[ce]: test')
        expect(state.links.ce.href).to.equal('test')
        expect(state.links.ce.title).to.undefined
    })
    it('table', () => {
        const lexer = new Lexer()
        const state = lexer.lex('| Heading 1 | Heading 2 | head 3 | head 4\n| :--------- | ---------: | :---: | ---\n| Cell 1    | Cell 2 | Cell 3 | cell 4\n| Cell 4    | Cell 5| Cell 6| cell7')
        expect(state.tokens).to.have.lengthOf(1)
        expect(state.tokens[0].type).to.equal('table')
        expect(state.tokens[0].align).to.have.lengthOf(4)
        expect(state.tokens[0].align[0]).to.equal('left')
        expect(state.tokens[0].align[1]).to.equal('right')
        expect(state.tokens[0].align[2]).to.equal('center')
        expect(state.tokens[0].align[3]).to.null
        expect(state.tokens[0].header).to.have.lengthOf(4)
        expect(state.tokens[0].header[0]).to.equal('Heading 1')
        expect(state.tokens[0].header[1]).to.equal('Heading 2')
        expect(state.tokens[0].header[2]).to.equal('head 3')
        expect(state.tokens[0].header[3]).to.equal('head 4')
    })
    it('error offset no change', () => {
        Lexer.block.push(['test', () => true, 1])
        const lexer = new Lexer()
        Lexer.block.pop()
        try {
            const state = lexer.lex('test')
        } catch(e) {
            expect(e.message).to.equal('offset no change: test;last offset: 0now offset: 0')
            expect(e.name).to.equal('Error')
        }
    })

    it('error rule err', () => {
        Lexer.block.push(['test', null, 1])
        const lexer = new Lexer()
        Lexer.block.pop()
        try {
            const state = lexer.lex('test')
        } catch(e) {
            expect(e.message).to.equal('rule is not array or index=1 not is function:test,,1')
            expect(e.name).to.equal('Error')
        }

    })
    it('error Infinite loop', () => {
        const block = Lexer.block
        Lexer.block = [['test1', () => {}, 1]]
        const lexer = new Lexer()
        Lexer.block = block
        try {
            const state = lexer.lex('test')
        } catch(e) {
            expect(e.message).to.equal('Infinite loop on byte: 116')
            expect(e.name).to.equal('Error')
        }

    })
    it('static lex', () => {
        const state = Lexer.lex('\n\n')
        expect(state.tokens).to.have.lengthOf(1)
        expect(state.tokens[0].type).to.equal('space')
    })
    it('smartLists', () => {
        const state = Lexer.lex('- test\n\n- test2', {smartLists: true})
    })
    it('lexer not tables', () => {
        const state = Lexer.lex('test', {tables: false})
        expect(state.tokens).to.have.lengthOf(1)
        expect(state.tokens[0].type).to.equal('paragraph')
    })
})
