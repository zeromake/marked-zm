const { replace, merge, noop } = require('./utils')

const inline = {
    escape: /^\\([\\`*{}[\]()#+\-.!_>])/,
    autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
    url: noop,
    tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
    link: /^!?\[(inside)\]\(href\)/,
    reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
    nolink: /^!?\[((?:\[[^\]]*\]|[^[\]])*)\]/,
    strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
    em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
    code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
    br: /^ {2,}\n(?!\s*$)/,
    del: noop,
    text: /^[\s\S]+?(?=[\\<![_*`]|\n|$)/,
    icon: /^ *<(i)[\s\S]+?<\/\1> */
}

inline._inside = /(?:\[[^\]]*\]|[^[\]]|\](?=[^[]*\]))*/
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/

inline.link = replace(inline.link)
    ('inside', inline._inside)
    ('href', inline._href)
    ()

inline.reflink = replace(inline.reflink)
    ('inside', inline._inside)
    ()

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline)

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
    strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
})

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
    escape: replace(inline.escape)('])', '~|])')(),
    url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
    del: /^~~(?=\S)([\s\S]*?\S)~~/,
    text: replace(inline.text)(']|', '~]|:[a-zA-Z0-9_\\-+]+:|https?://|')(),
    emoji: /^:([a-zA-Z0-9_\-+]+):/
})

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
    br: replace(inline.br)('{2,}', '*')(),
    text: replace(inline.gfm.text)('{2,}', '*')(),
})

/* handle = {
    emoji: function emojiHandle(cap) {

    },
    escape: function escapeHandle() {

    },
    autolink: function autolinkHandle() {

    },
    url: function urlHandle() {

    },
    tag: function tagHandle() {

    },
    link: function linkHandle() {

    },
    reflink: function reflinkHandle() {

    },
    nolink: function nolinkHandle() {

    },
    strong: function strongHandle() {

    },
    em: function emHandle() {

    },
    code: function codeHandle() {

    },
    br: function brHandle() {

    },
    del: function delHandle() {

    },
    text: function textHandle() {

    }
} */

module.exports = inline
