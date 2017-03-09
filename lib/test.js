const marked = require('./marked')

const t =`

[TOC]

# 测试

## 1

## 2

## 3

### 4

`

const text = marked(t)
console.log(text)
