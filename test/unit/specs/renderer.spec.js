const Renderer = require('../../../src/renderer')
const zescape = require('../../../src/utils/zescape')

describe('Test Renderer', () => {
    const renderer = new Renderer({langPrefix: 'lang-'})
    it('code', () => {
        const testCode = 'function test(){\n    return true\n}'
        expect(renderer.code(testCode))
            .to.equal('<pre><code>'+testCode+'\n</code></pre>')
        expect(renderer.code(testCode, 'js'))
            .to.equal('<pre class="code lang-js"><code class="lang-js">'+testCode+'\n</code></pre>\n')

    })
    it('highlight code', () => {
        const testCode = 'function test(){\n    return true\n}'
        const renderer1 = new Renderer({langPrefix: 'lang-', highlight: function(code, lang) {
                expect(code).to.equal(testCode)
                expect(lang).to.equal('js')
                return 'test'
            }
        })
        expect(renderer1.code(testCode, 'js'))
        .to.equal('<pre class="code lang-js"><code class="lang-js">test\n</code></pre>\n')
    })
    it('highlight code return object', () => {
        const testCode = 'function test(){\n    return true\n}'
        const renderer1 = new Renderer({langPrefix: 'lang-', highlight: function(code, lang) {
                expect(code).to.equal(testCode)
                expect(lang).to.equal('js')
                return {
                    language: 'test',
                    value: 'test'
                }
            }
        })
        expect(renderer1.code(testCode, 'js'))
        .to.equal('<pre class="code lang-test"><code class="lang-test">test\n</code></pre>\n')
    })
    it('highlight code not lang', () => {
        const testCode = 'function test(){\n    return true\n}'
        const renderer1 = new Renderer({langPrefix: 'lang-', highlight: function(code) {
                expect(code).to.equal(testCode)
                return 'test'
            }
        })
        expect(renderer1.code(testCode))
            .to.equal('<pre><code>test\n</code></pre>')
    })
    it('blockquote', () => {
        expect(renderer.blockquote('test'))
            .to.equal('<blockquote>\ntest</blockquote>\n')
    })
    it('html', () => {
        const str = 'test'
        expect(renderer.html(str)).to.equal(str)
    })
    it('heading', () => {
        expect(renderer.heading('test', 1))
            .to.equal('<h1><a class="anchor" name="test" href="#test"><svg aria-hidden="true" class="octicon octicon-link" height="16"'
    + ' version="1.1" viewBox="0 0 16 16" width="16">'
    + '<path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55'
    + ' 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45'
    + ' 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 '
    + '9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5'
    + ' 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9'
    + ' 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>test</h1>')
    })
    it('hr', () => {
        const renderer1 = new Renderer({xhtml: true})
        expect(renderer.hr()).to.equal('<hr>\n')
        expect(renderer1.hr()).to.equal('<hr/>\n')
    })
    it('list', () => {
        const testStr = '<li>test1</li>\n<li>test2</li>'
        expect(renderer.list(testStr))
            .to.equal('<ul class="contains-list">\n' + testStr + '</ul>\n')
        expect(renderer.list(testStr, true))
            .to.equal('<ol class="contains-list">\n' + testStr + '</ol>\n')
        expect(renderer.list(testStr, true, true))
            .to.equal('<ol class="contains-task-list">\n' + testStr + '</ol>\n')
    })
    it('listitem', () => {
        expect(renderer.listitem('test'))
            .to.equal('<li class="list-item">test</li>\n')
        expect(renderer.listitem('test', true))
            .to.equal('<li class="task-list-item"><input class="task-list-item-checkbox" checked="checked" type="checkbox" disabled="disabled">\ntest</li>\n')
        expect(renderer.listitem('test', false))
            .to.equal('<li class="task-list-item"><input class="task-list-item-checkbox" type="checkbox" disabled="disabled">\ntest</li>\n')
    })
    it('paragraph', () => {
        expect(renderer.paragraph('test'))
            .to.equal('<p>test</p>\n')
    })
    it('table', () => {
        expect(renderer.table('header', 'body'))
            .to.equal('<table>\n<thead>\nheader</thead>\n<tbody>\nbody</tbody>\n</table>\n')
    })
    it('tablerow', () => {
        expect(renderer.tablerow('test'))
            .to.equal('<tr>\ntest</tr>\n')
    })
    it('tablecell', () => {
        expect(renderer.tablecell('test', {}))
            .to.equal('<td>test</td>\n')
        expect(renderer.tablecell('test', {header: 1, align: 'left'}))
            .to.equal('<th style="text-align:left">test</th>\n')
    })
    it('strong', () => {
        expect(renderer.strong('test'))
            .to.equal('<strong>test</strong>')
    })
    it('em', () => {
        expect(renderer.em('test'))
            .to.equal('<em>test</em>')
    })
    it('codespan', () => {
        expect(renderer.codespan('linux'))
            .to.equal('<code>linux</code>')
    })
    it('br', () => {
        const renderer1 = new Renderer({xhtml: 1})
        expect(renderer.br())
            .to.equal('<br>')
        expect(renderer1.br())
            .to.equal('<br/>')
    })
    it('del', () => {
        expect(renderer.del('test'))
            .to.equal('<del>test</del>')
    })
    it('link', () => {
        const renderer1 = new Renderer({sanitize: 1})
        expect(renderer.link('/', null, 'test'))
            .to.equal('<a href="/">test</a>')
        expect(renderer.link('/', 'title', 'test'))
            .to.equal('<a href="/" title="title">test</a>')
        expect(renderer1.link('data:', null, 'test'))
            .to.equal('')
        expect(renderer1.link('http://www.test.com?test=%dsf%', null, 'test'))
            .to.equal('')
    })
    it('image', () => {
        const renderer1 = new Renderer({xhtml: 1})
        expect(renderer.image('/test.png', null, 'test'))
            .to.equal('<img src="/test.png" alt="test">')

        expect(renderer1.image('/test.png', 'title', 'test'))
            .to.equal('<img src="/test.png" alt="test" title="title"/>')

    })
    it('toc', () => {
        expect(renderer.toc(['<ul>', '<li>test', '</li>', '</ul>']))
            .to.equal('<div class="toc"><ul class="toc-tree">\n<li>test\n</li>\n</ul></div>')
    })
    it('toc_item', () => {
        expect(renderer.tocItem(null, 1))
            .to.equal('<li class="toc-item toc-level-1">')
        expect(renderer.tocItem('test', 1, 'test'))
            .to.equal('<li class="toc-item toc-level-1"><a class="toc-link" href="#test"><span class="toc-number"></span><span class="toc-text">test</span></a>')
        const renderer1 = new Renderer({
            sanitize: true
        })
        expect(renderer1.tocItem('test', 1, 'test'))
            .to.equal('<li class="toc-item toc-level-1"><a class="toc-link" href="#test"><span class="toc-number"></span><span class="toc-text">test</span></a>')
    })
    /*it('emoji', () => {
        expect(renderer.emoji('up'))
            .toEqual('<img src="https://cdn.bootcss.com/emojify.js/1.0/images/basic/up.png" alt=":up:" title=":up:" class="emoji" align="absmiddle"/>')
    })*/
})
