const sortRules = function sortRulesFun(rules) {
    return rules.slice(0).sort((a, b) => {
        if (a && b && a.length > 2 && b.length > 2) {
            return a[2] - b[2]
        }
        return 0
    })
}
module.exports = sortRules
