global.chai = require("chai")
global.should = require("chai").should()
global.expect = require("chai").expect
global.AssertionError = require("chai").AssertionError
const sinonChai = require("sinon-chai")

chai.use(sinonChai)
