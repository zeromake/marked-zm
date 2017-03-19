
const Lexer = require('../../src/lexer')

describe('Test Lexer', () => {
    it('newline', () => {
        const lexer = new Lexer()
        const state = lexer.lex('\n\n')
        expect(state.tokens.length).toEqual(1)
        expect(state.tokens[0].type).toEqual('space')
    })
    it('toc', () => {
        const lexer = new Lexer()
        const state = lexer.lex('[TOC]')
        expect(state.tokens.length).toEqual(1)
        expect(state.tokens[0].type).toEqual('toc')
    })
    it('code', () => {
        const lexer = new Lexer()
        const state = lexer.lex('    function test(){\n        return true\n    }\n')
        expect(state.tokens.length).toEqual(1)
        expect(state.tokens[0].type).toEqual('code')
        expect(state.tokens[0].text).toEqual('function test(){\n    return true\n}')
    })
    it('fences', () => {
        const lexer = new Lexer()
        const state = lexer.lex('``` javascript\nfunction test(){\n    return true\n}\n```')
        expect(state.tokens.length).toEqual(1)
        expect(state.tokens[0].type).toEqual('code')
        expect(state.tokens[0].lang).toEqual('javascript')
        expect(state.tokens[0].text).toEqual('function test(){\n    return true\n}')
    })
    it('heading', () => {
        const lexer = new Lexer()
        const state = lexer.lex('# test \n## test2\n ### test3')
        expect(state.tokens.length).toEqual(3)
        expect(state.tocs.length).toEqual(3)
        expect(state.tokens[0].type).toEqual('heading')
        expect(state.tokens[0].text).toEqual('test')
        expect(state.tokens[0].depth).toEqual(1)
        expect(state.tokens[1].type).toEqual('heading')
        expect(state.tokens[1].text).toEqual('test2')
        expect(state.tokens[1].depth).toEqual(2)
        expect(state.tokens[2].type).toEqual('heading')
        expect(state.tokens[2].text).toEqual('test3')
        expect(state.tokens[2].depth).toEqual(3)
    })
    it('nptable', () => {
        const lexer = new Lexer()
        const tebleStr = 'Header 1 | Header 2 | Header 3 | Header 4\n--------: | :-------- | :---: | -- |\nCell 1   | Cell 2  | Cell 3  | Cell 4\nCell 5 | Cell 6 | Cell 7  | Cell 8'
        const state = lexer.lex(tebleStr)
        expect(state.tokens.length).toEqual(1)
        expect(state.tokens[0].type).toEqual('table')
        expect(state.tokens[0].header).toEqual(['Header 1', 'Header 2', 'Header 3', 'Header 4'])
        expect(state.tokens[0].align).toEqual(['right', 'left', 'center', null])
    })
    it('lheading', () => {
        const lexer = new Lexer()
        const state = lexer.lex('test\n====\n\ntest2\n---')
        expect(state.tokens.length).toEqual(2)
        expect(state.tocs.length).toEqual(2)
        expect(state.tokens[0].type).toEqual('heading')
        expect(state.tokens[0].text).toEqual('test')
        expect(state.tokens[0].depth).toEqual(1)
        expect(state.tokens[1].type).toEqual('heading')
        expect(state.tokens[1].text).toEqual('test2')
        expect(state.tokens[1].depth).toEqual(2)
    })
    it('hr', () => {
        const lexer = new Lexer()
        const state = lexer.lex('----\n***\n\n___')
        expect(state.tokens.length).toEqual(3)
        expect(state.tokens[0].type).toEqual('hr')
        expect(state.tokens[1].type).toEqual('hr')
        expect(state.tokens[2].type).toEqual('hr')
    })
    it('blockquote', () => {
        const lexer = new Lexer()
        const state = lexer.lex('> test\n\n> test')
        expect(state.tokens.length).toEqual(4)
        expect(state.tokens[0].type).toEqual('blockquote_start')
        expect(state.tokens[1].type).toEqual('paragraph')
        expect(state.tokens[2].type).toEqual('paragraph')
        expect(state.tokens[3].type).toEqual('blockquote_end')
    })
    it('list', () => {
        const lexer = new Lexer()
        const state = lexer.lex('1. dsfd\n\n2. sdfsd\n\n\n- test1\n- test2\n\n\n- [] tes\n t3')
        expect(state.tokens.length).toEqual(24)
        expect(state.tokens[0].type).toEqual('list_start')
        expect(state.tokens[1].type).toEqual('loose_item_start')
        expect(state.tokens[2].type).toEqual('text')
        expect(state.tokens[3].type).toEqual('list_item_end')
        expect(state.tokens[4].type).toEqual('loose_item_start')
        expect(state.tokens[5].type).toEqual('text')
        expect(state.tokens[6].type).toEqual('space')
        expect(state.tokens[7].type).toEqual('list_item_end')
        expect(state.tokens[8].type).toEqual('list_end')
        expect(state.tokens[9].type).toEqual('list_start')
        expect(state.tokens[10].type).toEqual('list_item_start')
        expect(state.tokens[11].type).toEqual('text')
        expect(state.tokens[12].type).toEqual('list_item_end')
        expect(state.tokens[13].type).toEqual('list_item_start')
        expect(state.tokens[14].type).toEqual('text')
        expect(state.tokens[15].type).toEqual('space')
        expect(state.tokens[16].type).toEqual('list_item_end')
        expect(state.tokens[17].type).toEqual('list_end')
        expect(state.tokens[18].type).toEqual('list_start')
        expect(state.tokens[19].type).toEqual('list_item_start')
        expect(state.tokens[19].checked).toEqual(false)
        expect(state.tokens[20].type).toEqual('text')
        expect(state.tokens[21].type).toEqual('text')
        expect(state.tokens[22].type).toEqual('list_item_end')
        expect(state.tokens[23].type).toEqual('list_end')
    })
    it('html', () => {
        const lexer = new Lexer()
        const state = lexer.lex('<div>test</div>\n\n<br>')
        expect(state.tokens.length).toEqual(2)
        expect(state.tokens[0].type).toEqual('html')
        expect(state.tokens[0].text).toEqual('<div>test</div>\n\n')
        expect(state.tokens[1].type).toEqual('paragraph')
        expect(state.tokens[1].text).toEqual('<br>')
    })
    it('def', () => {
        const lexer = new Lexer()
        const state = lexer.lex('[ce]: test')
        expect(state.links.ce.href).toEqual('test')
        expect(state.links.ce.title).toEqual(undefined)
    })
    it('table', () => {
        const lexer = new Lexer()
        const state = lexer.lex('| Heading 1 | Heading 2 | head 3 | head 4\n| :--------- | ---------: | :---: | ---\n| Cell 1    | Cell 2 | Cell 3 | cell 4\n| Cell 4    | Cell 5| Cell 6| cell7')
        expect(state.tokens.length).toEqual(1)
        expect(state.tokens[0].type).toEqual('table')
        expect(state.tokens[0].align).toEqual(['left', 'right', 'center', null])
        expect(state.tokens[0].header).toEqual(['Heading 1', 'Heading 2', 'head 3', 'head 4'])
    })
    it('error offset no change', () => {
        Lexer.block.push(['test', () => true, 1])
        const lexer = new Lexer()
        Lexer.block.pop()
        try {
            const state = lexer.lex('test')
        } catch(e) {
            expect(e.message).toEqual('offset no change: test;last offset: 0now offset: 0')
            expect(e.name).toEqual('Error')
        }
    })

    it('error rule err', () => {
        Lexer.block.push(['test', null, 1])
        const lexer = new Lexer()
        Lexer.block.pop()
        try {
            const state = lexer.lex('test')
        } catch(e) {
            expect(e.message).toEqual('rule is not array or index=1 not is function:test,,1')
            expect(e.name).toEqual('Error')
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
            expect(e.message).toEqual('Infinite loop on byte: 116')
            expect(e.name).toEqual('Error')
        }

    })
    it('static lex', () => {
        const state = Lexer.lex('\n\n')
        expect(state.tokens.length).toEqual(1)
        expect(state.tokens[0].type).toEqual('space')
    })
    it('smartLists', () => {
        const state = Lexer.lex('- test\n\n- test2', {smartLists: true})
    })
})
