const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)

const srcContext = require.context('../../src', true, /\.js$/)
srcContext.keys().forEach(srcContext)
