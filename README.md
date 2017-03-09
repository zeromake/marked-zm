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
    var reg = / *\$(.*)\$ *\n*$/
    var type = 'katex'
    return {
        type: type,
        renderer: function(text, renderer) {
            return 'katex: ' + text
        },
        regexp: function(src){
            var cap = reg.exec(src)
            console.log(cap)
            if (cap){
                return {
                    sublen: cap[0].length,
                    token:{
                        type: type,
                        text: cap[1]
                    }
                }
            }
            return null
        }
    }
})
marked("$test$")
```

