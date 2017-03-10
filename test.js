const marked = require('./src/marked')

const t =`

[TOC]

# 测试

## 1

## 2

## 3

### 4

测试服 :smile:

`

const text = marked(t)
console.log(text)
