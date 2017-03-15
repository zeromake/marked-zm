const newline = require('./newline')
const toc = require('./toc')
const code = require('./code')
const fences = require('./fences')
const heading = require('./heading')
const nptable = require('./nptable')
const lheading = require('./lheading')
const hr = require('./hr')
const blockquote = require('./blockquote')
const list = require('./list')
const html = require('./html')
const def = require('./def')
const table = require('./table')
const paragraph = require('./paragraph')
const text = require('./text')

const _rules = [
    ['newline', newline, 10],
    ['toc', toc, 20],
    ['code', code, 30],
    ['fences', fences, 40],
    ['heading', heading, 50],
    ['nptable', nptable, 60],
    ['lheading', lheading, 70],
    ['hr', hr, 80],
    ['blockquote', blockquote, 90],
    ['list', list, 100],
    ['html', html, 110],
    ['def', def, 120],
    ['table', table, 130],
    ['paragraph', paragraph, 140],
    ['text', text, 150]
]

module.exports = _rules
