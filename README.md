[![Travis Build Status](https://travis-ci.org/zeromake/marked-zm.svg?branch=master)](https://travis-ci.org/zeromake/marked-zm)
[![Coverage Status](https://coveralls.io/repos/github/zeromake/marked-zm/badge.svg?branch=master)](https://coveralls.io/github/zeromake/marked-zm?branch=master)

# marked-zm

## Install

$npm i github:zeromake/marked-zm -S

## Simple

``` javascript
const marked = require('marked-zm')
marked("#ff"/*, {opt}*/)
```

## Simple Extended
``` javascript
marked.use(function(marked) {
    var blockReg = /^ *\${2}(.*?)\${2} *(\n+|$)/
    var inlineReg = /^\$(.*?)\$/
    var type = 'katex'
    return {
        type,
        block(state, env) {
            const cap = blockReg.exec(state.src)
            if (cap) {
                var offsetLen = cap[0].length
                var offsetStart = state.offset
                var offsetEnd = offsetStart + offsetLen
                state.src = state.src.substring(offsetLen)
                env.tokens.push({
                    type,
                    text: cap[1],
                    start: offsetStart,
                    end: offsetEnd
                })
                state.offset = offsetEnd
                return true
            }
        },
        parser(env) {
            return env.renderer.paragraph(env.renderer[type](env.token.text))
        },
        inline(state, env) {
            const cap = inlineReg.exec(state.src)
            if (cap) {
                var offsetLen = cap[0].length
                state.src = state.src.substring(offsetLen)
                state.out += env.renderer[type](cap[1])
                return true
            }
        },
        renderer(text, renderer) {
            return 'katex: ' + text
        }
    }
})
marked("$test$")
```

## marked.use detailed
1. use接受一个方法，传入参数就是marked
2. 返回一个对象的话另外处理下面说对象的哪些属性用法

### type
必须设置，没有设置直接不做处理。

### block
块级文本解析调用，配合`blocklv`来调整优先级。
接受两个参数`state, env`

state:

> - state.src 将要被解析的文本, 记得处理的文本要被切走。
> - state.offset 当前文本解析到什么位置。一定要修改
> - state.top 是否为顶栈调用
> - state.bq 不清楚什么用

env:
> - env.options 配置
> - env.rules 预置正则
> - env.tokens 解析后把token，push到这来通过type会找Parser
> - env.tocs 目录
> - env.links 命名链接
> - env.token(src, top, bq, offset) 递归解析新的文本的方法

