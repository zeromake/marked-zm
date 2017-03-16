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
    var reg = /\$(.*)\$/
    var type = 'katex'
    return {
        type,
        renderer(text, renderer) {
            return 'katex: ' + text
        },
        inline(state){
            var cap = reg.exec(state.src)
            if (cap){
                state.src = state.src.substring(cap[0].length)
                state.out += this.renderer.katex(cap[1])
                return true
            }
        }
    }
})
marked("$test$")
```

