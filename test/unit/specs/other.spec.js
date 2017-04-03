const sortRules = require('../../../src/utils/sort-rules')

describe('Other test', () => {
    it('sort-rules', () => {
        const rules = [1, 3]
        const sort = sortRules(rules)
        expect(sort[0]).to.equal(1)
        expect(sort[1]).to.equal(3)
    })
})
