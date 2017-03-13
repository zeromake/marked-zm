(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["marked"] = factory();
	else
		root["marked"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Renderer = __webpack_require__(1);

var defaults = {
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    sanitizer: null,
    mangle: true,
    smartLists: false,
    silent: false,
    highlight: null,
    langPrefix: 'lang-',
    smartypants: false,
    headerPrefix: '',
    renderer: new Renderer(),
    xhtml: false
};
module.exports = defaults;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _utils = __webpack_require__(2);

function Renderer(options) {
    this.options = options || {};
}

Renderer.prototype.code = function renCode(code, lang, escaped) {
    if (this.options.highlight) {
        var codeOut = this.options.highlight(code, lang);
        if (codeOut != null && codeOut !== code) {
            escaped = true;
            code = codeOut;
        }
    }

    if (!lang) {
        return '<pre><code>' + (escaped ? code : (0, _utils.escape)(code, true)) + '\n</code></pre>';
    }
    return '<pre><code class="' + this.options.langPrefix + (0, _utils.escape)(lang, true) + '">' + (escaped ? code : (0, _utils.escape)(code, true)) + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function blockquote(quote) {
    return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function renHtml(html) {
    return html;
};

Renderer.prototype.heading = function heading(text, level) {
    var escapedText = text.toLowerCase();
    return '<h' + level + '><a class="anchor" name="' + escapedText + '" href="#' + escapedText + '"><svg aria-hidden="true" class="octicon octicon-link" height="16"' + ' version="1.1" viewBox="0 0 16 16" width="16">' + '<path fill-rule="evenodd" d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55' + ' 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45' + ' 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 ' + '9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5' + ' 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9' + ' 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"></path></svg></a>' + text + '</h' + level + '>';
};

Renderer.prototype.hr = function hr() {
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function list(body, ordered, checked) {
    var listType = ordered ? 'ol' : 'ul';
    var listClass = checked ? 'contains-task-list' : 'contains-list';
    return '<' + listType + ' class="' + listClass + '">\n' + body + '</' + listType + '>\n';
};

Renderer.prototype.listitem = function listitem(text, checked) {
    var isCheckedItem = typeof checked === 'boolean';
    var itemclass = isCheckedItem ? 'task-list-item' : 'list-item';
    var checkeddom = isCheckedItem ? '<input class="task-list-item-checkbox"' + (checked ? ' checked="checked"' : '') + ' type="checkbox" disabled="disabled">\n' : '';
    return '<li class="' + itemclass + '">' + checkeddom + text + '</li>\n';
};

Renderer.prototype.paragraph = function paragraph(text) {
    return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function table(header, body) {
    return '<table>\n' + '<thead>\n' + header + '</thead>\n' + '<tbody>\n' + body + '</tbody>\n' + '</table>\n';
};

Renderer.prototype.tablerow = function tablerow(content) {
    return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function tablecell(content, flags) {
    var tableType = flags.header ? 'th' : 'td';
    var tableTag = flags.align ? '<' + tableType + ' style="text-align:' + flags.align + '">' : '<' + tableType + '>';
    return tableTag + content + '</' + tableType + '>\n';
};

// span level renderer
Renderer.prototype.strong = function strong(text) {
    return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function em(text) {
    return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function codespan(text) {
    return '<code>' + text + '</code>';
};

Renderer.prototype.br = function br() {
    return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function del(text) {
    return '<del>' + text + '</del>';
};

Renderer.prototype.link = function link(href, title, text) {
    if (this.options.sanitize) {
        var prot = void 0;
        try {
            prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, '').toLowerCase();
        } catch (e) {
            return '';
        }
        if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
            return '';
        }
    }
    var out = '<a href="' + href + '"';
    if (title) {
        out += ' title="' + title + '"';
    }
    out += '>' + text + '</a>';
    return out;
};

Renderer.prototype.image = function image(href, title, text) {
    var out = '<img src="' + href + '" alt="' + text + '"';
    if (title) {
        out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? '/>' : '>';
    return out;
};

Renderer.prototype.text = function renText(text) {
    return text;
};
Renderer.prototype.blank = function renText(text) {
    return text;
};
Renderer.prototype.toc = function renToc(items) {
    var html = '<div class="toc"><ul class="toc-tree">' + items + '</ul></div>';
    return html;
};
Renderer.prototype.tocItem = function tocItem(id, level, text) {
    return '<li class="toc-item toc-level-' + level + '"><a class="toc-link" href="#' + id + '"><span class="toc-number"></span><span class="toc-text">' + text + '</span></a></li>';
};
Renderer.prototype.emoji = function emoji(emojiName) {
    var title = ':' + (0, _utils.escape)(emojiName) + ':';
    return '<img src="https://cdn.bootcss.com/emojify.js/1.0/images/basic/' + encodeURIComponent(emojiName) + '.png" alt="' + title + '" title="' + title + '" class="emoji" align="absmiddle"/>';
};
module.exports = Renderer;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var merge = function merge(obj) {
    var target = void 0;
    var key = void 0;
    var i = 1;
    var len = arguments.length;
    for (; i < len; i++) {
        target = arguments[i];
        for (key in target) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
                obj[key] = target[key];
            }
        }
    }
    return obj;
};
var escape = function escape(html, encode) {
    html = html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    return html;
};

var replace = function replace(regex, opt) {
    regex = regex.source;
    opt = opt || '';
    return function self(name, val) {
        if (!name) return new RegExp(regex, opt);
        val = val.source || val;
        val = val.replace(/(^|[^[])\^/g, '$1');
        regex = regex.replace(name, val);
        return self;
    };
};
var noop = function noop() {};
noop.exec = noop;

module.exports = {
    merge: merge,
    escape: escape,
    replace: replace,
    noop: noop
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Renderer = __webpack_require__(1);
var defaults = __webpack_require__(0);

var _require = __webpack_require__(2),
    escape = _require.escape;

var inline = __webpack_require__(7);

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
    this.options = options || defaults;
    this.links = links;
    this.rules = inline.normal;
    this.renderer = this.options.renderer || new Renderer();
    this.renderer.options = this.options;

    if (!this.links) {
        throw new Error('Tokens array requires a `links` property.');
    }

    if (this.options.gfm) {
        if (this.options.breaks) {
            this.rules = inline.breaks;
        } else {
            this.rules = inline.gfm;
        }
    } else if (this.options.pedantic) {
        this.rules = inline.pedantic;
    }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function staticOutput(src, links, options) {
    var inlineObj = new InlineLexer(links, options);
    return inlineObj.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function output(src) {
    var out = '';
    var link = void 0;
    var text = void 0;
    var href = void 0;
    var cap = void 0;

    while (src) {
        // newline
        if (cap = /^\n+/.exec(src)) {
            src = src.substring(cap[0].length);
            out += '<br/>';
        }
        // emoji
        if (cap = this.rules.emoji.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.emoji(cap[1]);
        }
        // escape
        if (cap = this.rules.escape.exec(src)) {
            src = src.substring(cap[0].length);
            out += cap[1];
            continue;
        }

        // autolink
        if (cap = this.rules.autolink.exec(src)) {
            src = src.substring(cap[0].length);
            if (cap[2] === '@') {
                text = cap[1].charAt(6) === ':' ? this.mangle(cap[1].substring(7)) : this.mangle(cap[1]);
                href = this.mangle('mailto:') + text;
            } else {
                text = escape(cap[1]);
                href = text;
            }
            out += this.renderer.link(href, null, text);
            continue;
        }

        // url (gfm)
        if (!this.inLink && (cap = this.rules.url.exec(src))) {
            src = src.substring(cap[0].length);
            text = escape(cap[1]);
            href = text;
            out += this.renderer.link(href, null, text);
            continue;
        }

        // tag
        if (cap = this.rules.tag.exec(src)) {
            if (!this.inLink && /^<a /i.test(cap[0])) {
                this.inLink = true;
            } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
                this.inLink = false;
            }
            src = src.substring(cap[0].length);
            var addOut = this.options.sanitize && this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]);

            addOut = this.options.sanitize ? addOut : cap[0];
            out += addOut;
            continue;
        }

        // link
        if (cap = this.rules.link.exec(src)) {
            src = src.substring(cap[0].length);
            this.inLink = true;
            out += this.outputLink(cap, {
                href: cap[2],
                title: cap[3]
            });
            this.inLink = false;
            continue;
        }

        // reflink, nolink
        if ((cap = this.rules.reflink.exec(src)) || (cap = this.rules.nolink.exec(src))) {
            src = src.substring(cap[0].length);
            link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
            link = this.links[link.toLowerCase()];
            if (!link || !link.href) {
                out += cap[0].charAt(0);
                src = cap[0].substring(1) + src;
                continue;
            }
            this.inLink = true;
            out += this.outputLink(cap, link);
            this.inLink = false;
            continue;
        }

        // strong
        if (cap = this.rules.strong.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.strong(this.output(cap[2] || cap[1]));
            continue;
        }

        // em
        if (cap = this.rules.em.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.em(this.output(cap[2] || cap[1]));
            continue;
        }

        // code
        if (cap = this.rules.code.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.codespan(escape(cap[2], true));
            continue;
        }

        // br
        if (cap = this.rules.br.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.br();
            continue;
        }

        // del (gfm)
        if (cap = this.rules.del.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.del(this.output(cap[1]));
            continue;
        }
        // text
        if (cap = this.rules.text.exec(src)) {
            src = src.substring(cap[0].length);
            out += this.renderer.text(escape(this.smartypants(cap[0])));
            continue;
        }

        if (src) {
            throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
        }
    }

    return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function outputLink(cap, link) {
    var href = escape(link.href);
    var title = link.title ? escape(link.title) : null;

    return cap[0].charAt(0) !== '!' ? this.renderer.link(href, title, this.output(cap[1])) : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function smartypants(text) {
    if (!this.options.smartypants) return text;
    return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/([{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/([{\u2018\s])"/g, '$1\u201C')
    // closing doubles
    .replace(/"/g, '\u201D')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function mangle(text) {
    if (!this.options.mangle) return text;
    var out = '';
    var l = text.length;
    var i = 0;
    var ch = void 0;

    for (; i < l; i++) {
        ch = text.charCodeAt(i);
        if (Math.random() > 0.5) {
            ch = 'x' + ch.toString(16);
        }
        out += '&#' + ch + ';';
    }

    return out;
};

module.exports = InlineLexer;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(0);
var block = __webpack_require__(6);

function Lexer(options) {
    this.tokens = [];
    this.tokens.links = {};
    this.tocs = [];
    this.options = options || defaults;
    this.rules = block.normal;
    if (this.options.gfm) {
        if (this.options.tables) {
            this.rules = block.tables;
        } else {
            this.rules = block.gfm;
        }
    }
}
Lexer.rules = block;

Lexer.lex = function staticLex(src, options) {
    var lexer = new Lexer(options);
    return lexer.lex(src);
};
Lexer.prototype.lex = function lex(src) {
    src = src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ').replace(/\u00a0/g, ' ').replace(/\u2424/g, '\n');

    return this.token(src, true);
};
Lexer.prototype.token = function token(src, top, bq) {
    src = src.replace(/^ +$/gm, '');
    var next = void 0;
    var loose = void 0;
    var cap = void 0;
    var bull = void 0;
    var b = void 0;
    var item = void 0;
    var space = void 0;
    var i = void 0;
    var l = void 0;
    while (src) {
        // newline
        if (cap = this.rules.newline.exec(src)) {
            src = src.substring(cap[0].length);
            if (cap[0].length > 1) {
                this.tokens.push({
                    type: 'space'
                });
            }
        }

        /* if (cap = this.rules.checked.exec(src)) {
            src = src.substring(cap[0].length)
            this.tokens.push({
                type: 'checked',
                text: cap[2],
                isCheck: cap[1] === 'x'
            })
            continue
        } */
        // toc
        if (cap = this.rules.toc.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
                type: 'toc'
            });
            continue;
        }

        // code
        if (cap = this.rules.code.exec(src)) {
            src = src.substring(cap[0].length);
            cap = cap[0].replace(/^ {4}/gm, '');
            this.tokens.push({
                type: 'code',
                text: !this.options.pedantic ? cap.replace(/\n+$/, '') : cap
            });
            continue;
        }

        // fences (gfm)
        if (cap = this.rules.fences.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
                type: 'code',
                lang: cap[2],
                text: cap[3] || ''
            });
            continue;
        }

        // heading
        if (cap = this.rules.heading.exec(src)) {
            src = src.substring(cap[0].length);
            var headToken = {
                type: 'heading',
                depth: cap[1].length,
                text: cap[2]
            };
            this.tocs.push(headToken);
            this.tokens.push(headToken);
            continue;
        }

        // table no leading pipe (gfm)
        if (top && (cap = this.rules.nptable.exec(src))) {
            src = src.substring(cap[0].length);

            item = {
                type: 'table',
                header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                cells: cap[3].replace(/\n$/, '').split('\n')
            };

            for (i = 0; i < item.align.length; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                    item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                    item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                    item.align[i] = 'left';
                } else {
                    item.align[i] = null;
                }
            }

            for (i = 0; i < item.cells.length; i++) {
                item.cells[i] = item.cells[i].split(/ *\| */);
            }

            this.tokens.push(item);

            continue;
        }

        // lheading
        if (cap = this.rules.lheading.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
                type: 'heading',
                depth: cap[2] === '=' ? 1 : 2,
                text: cap[1]
            });
            continue;
        }

        // hr
        if (cap = this.rules.hr.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
                type: 'hr'
            });
            continue;
        }

        // blockquote
        if (cap = this.rules.blockquote.exec(src)) {
            src = src.substring(cap[0].length);

            this.tokens.push({
                type: 'blockquote_start'
            });

            cap = cap[0].replace(/^ *> ?/gm, '');

            // Pass `top` to keep the current
            // "toplevel" state. This is exactly
            // how markdown.pl works.
            this.token(cap, top, true);

            this.tokens.push({
                type: 'blockquote_end'
            });

            continue;
        }
        // list
        if (cap = this.rules.list.exec(src)) {
            var isChecked = this.rules.checkedlist.test(src);
            src = src.substring(cap[0].length);
            var checked = void 0;
            bull = cap[2];
            this.tokens.push({
                type: 'list_start',
                ordered: bull.length > 1,
                checked: isChecked
            });

            // Get each top-level item.
            cap = cap[0].match(isChecked ? this.rules.checkeditem : this.rules.item);

            next = false;
            l = cap.length;
            i = 0;

            for (; i < l; i++) {
                item = cap[i];

                // Remove the list item's bullet
                // so it is seen as the next token.
                space = item.length;
                item = item.replace(/^ *([*+-]|\d+\.) +/, '');
                if (isChecked) {
                    checked = /^\[x\]/.test(item);
                    item = item.replace(/^\[(x| *)\]/, '');
                } else {
                    checked = null;
                }

                // Outdent whatever the
                // list item contains. Hacky.
                if (~item.indexOf('\n ')) {
                    space -= item.length;
                    item = !this.options.pedantic ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '') : item.replace(/^ {1,4}/gm, '');
                }

                // Determine whether the next list item belongs here.
                // Backpedal if it does not belong in this list.
                if (this.options.smartLists && i !== l - 1) {
                    b = block.bullet.exec(cap[i + 1])[0];
                    if (bull !== b && !(bull.length > 1 && b.length > 1)) {
                        src = cap.slice(i + 1).join('\n') + src;
                        i = l - 1;
                    }
                }

                // Determine whether item is loose or not.
                // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
                // for discount behavior.
                loose = next || /\n\n(?!\s*$)/.test(item);
                if (i !== l - 1) {
                    next = item.charAt(item.length - 1) === '\n';
                    if (!loose) loose = next;
                }

                this.tokens.push({
                    type: loose ? 'loose_item_start' : 'list_item_start',
                    checked: checked
                });

                // Recurse.
                this.token(item, false, bq);

                this.tokens.push({
                    type: 'list_item_end'
                });
            }

            this.tokens.push({
                type: 'list_end'
            });

            continue;
        }

        // html
        if (cap = this.rules.html.exec(src)) {
            src = src.substring(cap[0].length);
            this.tokens.push({
                type: this.options.sanitize ? 'paragraph' : 'html',
                pre: !this.options.sanitizer && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
                text: cap[0]
            });
            continue;
        }

        // def
        if (!bq && top && (cap = this.rules.def.exec(src))) {
            src = src.substring(cap[0].length);
            this.tokens.links[cap[1].toLowerCase()] = {
                href: cap[2],
                title: cap[3]
            };
            continue;
        }

        // table (gfm)
        if (top && (cap = this.rules.table.exec(src))) {
            src = src.substring(cap[0].length);

            item = {
                type: 'table',
                header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
            };

            for (i = 0; i < item.align.length; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                    item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                    item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                    item.align[i] = 'left';
                } else {
                    item.align[i] = null;
                }
            }

            for (i = 0; i < item.cells.length; i++) {
                item.cells[i] = item.cells[i].replace(/^ *\| *| *\| *$/g, '').split(/ *\| */);
            }

            this.tokens.push(item);

            continue;
        }
        // extended other
        if (this.options.extended && this.options.extended.length > 0) {
            var extendedLen = this.options.extended.length;
            var isToken = false;
            for (var h = 0; h < extendedLen; h++) {
                var extended = this.options.extended[h];
                if (typeof extended === 'function') {
                    var tokenAndLen = extended.bind(this)(src);
                    if (tokenAndLen) {
                        this.tokens.push(tokenAndLen.token);
                        src = src.substring(tokenAndLen.sublen);
                        isToken = true;
                        break;
                    }
                }
            }
            if (isToken) continue;
        }
        // top-level paragraph
        if (top && (cap = this.rules.paragraph.exec(src))) {
            src = src.substring(cap[0].length);
            this.tokens.push({
                type: 'paragraph',
                text: cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1]
            });
            continue;
        }

        // text
        if (cap = this.rules.text.exec(src)) {
            // Top-level should never reach here.
            src = src.substring(cap[0].length);
            this.tokens.push({
                type: 'text',
                text: cap[0]
            });
            continue;
        }

        if (src) {
            throw new Error('Infinite loop on byte: ' + src.charCodeAt(0));
        }
    }
    return { tokens: this.tokens, tocs: this.tocs };
};
module.exports = Lexer;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Renderer = __webpack_require__(1);
var InlineLexer = __webpack_require__(3);
var defaults = __webpack_require__(0);

function Parser(options) {
    this.tokens = [];
    this.token = null;
    this.options = options || defaults;
    this.options.renderer = this.options.renderer || new Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function staticParse(param, options, renderer) {
    var parser = new Parser(options, renderer);
    return parser.parse(param);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function parse(param) {
    var _this = this;

    var src = param.tokens;
    var tocs = param.tocs;
    this.inline = new InlineLexer(src.links, this.options, this.renderer);
    var tocItems = [];
    tocs.forEach(function (token) {
        var id = token.text.toLowerCase();
        tocItems.push(_this.renderer.tocItem(id, token.depth, token.text));
    });
    this.tocHTML = this.renderer.toc(tocItems.join('\n'));
    this.tokens = src.reverse();
    var parseOut = '';
    while (this.next()) {
        parseOut += this.tok();
    }
    return parseOut;
};

/**
 * Next Token
 */

Parser.prototype.next = function parNext() {
    this.token = this.tokens.pop();
    return this.token;
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function peek() {
    return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function parseText() {
    var textBody = this.token.text;

    while (this.peek().type === 'text') {
        textBody += '\n' + this.next().text;
    }

    return this.inline.output(textBody);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function parTok() {
    switch (this.token.type) {
        case 'space':
            {
                return '';
            }
        case 'hr':
            {
                return this.renderer.hr();
            }
        case 'heading':
            {
                return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, this.token.text);
            }
        case 'code':
            {
                return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
            }
        case 'table':
            {
                var header = '';
                var body = '';
                var i = void 0;
                var row = void 0;
                var cell = void 0;
                // let flags
                var j = void 0;

                // header
                cell = '';
                for (i = 0; i < this.token.header.length; i++) {
                    /* flags = {
                        header: true,
                        align: this.token.align[i]
                    }; */
                    cell += this.renderer.tablecell(this.inline.output(this.token.header[i]), {
                        header: true,
                        align: this.token.align[i]
                    });
                }
                header += this.renderer.tablerow(cell);

                for (i = 0; i < this.token.cells.length; i++) {
                    row = this.token.cells[i];

                    cell = '';
                    for (j = 0; j < row.length; j++) {
                        cell += this.renderer.tablecell(this.inline.output(row[j]), {
                            header: false,
                            align: this.token.align[j]
                        });
                    }

                    body += this.renderer.tablerow(cell);
                }
                return this.renderer.table(header, body);
            }
        case 'blockquote_start':
            {
                var _body = '';

                while (this.next().type !== 'blockquote_end') {
                    _body += this.tok();
                }

                return this.renderer.blockquote(_body);
            }
        case 'list_start':
            {
                var _body2 = '';
                var ordered = this.token.ordered;
                var isChecked = this.token.checked;
                while (this.next().type !== 'list_end') {
                    _body2 += this.tok();
                }

                return this.renderer.list(_body2, ordered, isChecked);
            }
        case 'list_item_start':
            {
                var _body3 = '';
                var _isChecked = this.token.checked;
                while (this.next().type !== 'list_item_end') {
                    _body3 += this.token.type === 'text' ? this.parseText() : this.tok();
                }

                return this.renderer.listitem(_body3, _isChecked);
            }
        case 'loose_item_start':
            {
                var _body4 = '';
                var _isChecked2 = this.token.checked;
                while (this.next().type !== 'list_item_end') {
                    _body4 += this.tok();
                }

                return this.renderer.listitem(_body4, _isChecked2);
            }
        case 'html':
            {
                var html = !this.token.pre && !this.options.pedantic ? this.inline.output(this.token.text) : this.token.text;
                return this.renderer.html(html);
            }
        case 'paragraph':
            {
                return this.renderer.paragraph(this.inline.output(this.token.text));
            }
        case 'text':
            {
                return this.renderer.paragraph(this.parseText());
            }
        case 'toc':
            {
                return this.tocHTML;
            }
        case 'checked':
            {
                var checkedDom = '<div class="checked-item"><input ' + (this.token.isCheck ? 'checked="checked"' : '') + ' type="checkbox">';
                return checkedDom + this.inline.output(this.token.text) + '</div>';
            }
        default:
            {
                var renderer = this.renderer[this.token.type];
                if (typeof renderer === 'function') {
                    return renderer.call(this, this.token.text, this.renderer);
                }
            }
    }
};

module.exports = Parser;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(2),
    replace = _require.replace,
    noop = _require.noop,
    merge = _require.merge;

var block = {
    newline: /^\n+/,
    code: /^( {4}[^\n]+\n*)+/,
    fences: noop,
    hr: /^( *[-*_]){3,} *(?:\n+|$)/,
    heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
    nptable: noop,
    lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
    blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
    list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n+|\s*$)/,
    html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
    table: noop,
    paragraph: /^((?:[^\n]+(\n?)(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
    text: /^[^\n]+/,
    toc: /\s*\[TOC\]/,
    checkedlist: /^( *)(bull) \[( *|x)\] [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n|\s*$)/
};
block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')(/bull/g, block.bullet)();
block.list = replace(block.list)(/bull/g, block.bullet)('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')('def', '\\n+(?=' + block.def.source + ')')();

block.checkeditem = /^( *)(bull) \[( *|x)\] [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.checkeditem = replace(block.checkeditem, 'gm')(/bull/g, block.bullet)();
block.checkedlist = replace(block.checkedlist)(/bull/g, block.bullet)('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')('def', '\\n+(?=' + block.def.source + ')')();

block.blockquote = replace(block.blockquote)('def', block.def)();

block._tag = '(?!(?:' + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code' + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo' + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)('comment', /<!--[\s\S]*?-->/)('closed', /<(tag)[\s\S]+?<\/\1>/)('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, block._tag)();

block.paragraph = replace(block.paragraph)('hr', block.hr)('heading', block.heading)('lheading', block.lheading)('blockquote', block.blockquote)('tag', '<' + block._tag)('def', block.def)();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
    fences: /^ *(`{3,}|~{3,})[ .]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
    paragraph: /^/,
    heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = replace(block.paragraph)('(?!', '(?!' + block.gfm.fences.source.replace('\\1', '\\2') + '|' + block.list.source.replace('\\1', '\\3') + '|')();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
    nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
    table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

module.exports = block;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(2),
    replace = _require.replace,
    merge = _require.merge,
    noop = _require.noop;

var inline = {
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
    text: /^[\s\S]+?(?=[\\<![_*`]|\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^[\]]|\](?=[^[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)('inside', inline._inside)('href', inline._href)();

inline.reflink = replace(inline.reflink)('inside', inline._inside)();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
    strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
    em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
    escape: replace(inline.escape)('])', '~|])')(),
    url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
    del: /^~~(?=\S)([\s\S]*?\S)~~/,
    text: replace(inline.text)(']|', '~]|:[a-zA-Z0-9_\\-+]+:|https?://|')(),
    emoji: /^:([a-zA-Z0-9_\-+]+):/
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
    br: replace(inline.br)('{2,}', '*')(),
    text: replace(inline.gfm.text)('{2,}', '*')()
});

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

module.exports = inline;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = __webpack_require__(2),
    merge = _require.merge,
    escape = _require.escape;

var Lexer = __webpack_require__(4);
var Parser = __webpack_require__(5);
var Renderer = __webpack_require__(1);
var InlineLexer = __webpack_require__(3);
var defaults = __webpack_require__(0);

function marked(src, opt, callback) {
    if (callback || typeof opt === 'function') {
        var _ret = function () {
            if (!callback) {
                callback = opt;
                opt = null;
            }
            opt = merge({}, marked.defaults, opt || {});
            var highlight = opt.highlight;
            var tokens = void 0;
            var pending = void 0;
            var i = 0;
            try {
                tokens = Lexer.lex(src, opt);
            } catch (e) {
                return {
                    v: callback(e)
                };
            }
            pending = tokens.length;
            var done = function done(err) {
                if (err) {
                    opt.highlight = highlight;
                    return callback(err);
                }
                var out = void 0;
                try {
                    out = Parser.parse(tokens, opt);
                } catch (e) {
                    err = e;
                }
                opt.highlight = highlight;
                return err ? callback(err) : callback(null, out);
            };
            if (!highlight || highlight.length < 3) {
                return {
                    v: done()
                };
            }
            delete opt.highlight;
            if (!pending) return {
                    v: done()
                };

            var _loop = function _loop() {
                var token = tokens[i];
                if (token.type !== 'code') {
                    if (! --pending) done();
                    return 'continue';
                }
                highlight(token.text, token.lang, function (err, code) {
                    if (err) return done(err);
                    if (code == null || token.text === code) {
                        return --pending || done();
                    }
                    token.text = code;
                    token.escaped = true;
                    if (! --pending) done();
                });
            };

            for (; i < tokens.length; i++) {
                var _ret2 = _loop();

                if (_ret2 === 'continue') continue;
            }
            return {
                v: null
            };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
    try {
        if (opt) opt = merge({}, marked.defaults, opt);
        return Parser.parse(Lexer.lex(src, opt), opt);
    } catch (e) {
        e.message += '\nPlease report this to https://github.com/chjj/marked.';
        if ((opt || marked.defaults).silent) {
            return '<p>An error occured:</p><pre>' + escape(e.message + '', true) + '</pre>';
        }
        throw e;
    }
}
marked.setOptions = function (opt) {
    merge(marked.defaults, opt);
    return marked;
};
marked.setExtended = function setExtended(opt) {
    var extType = opt.type;
    var renderer = opt.renderer;
    var regexp = opt.regexp;
    if (extType && renderer) {
        this.Renderer.prototype[extType] = renderer;
    }
    if (regexp) {
        this.defaults.extended = marked.defaults.extended || [];
        this.defaults.extended.push(regexp);
    }
};
marked.use = function use(plugin) {
    var args = [this].concat(Array.prototype.slice.call(arguments, 1));
    var opt = plugin.apply(plugin, args);
    this.setExtended(opt);
    return this;
};
marked.options = marked.setOptions;

marked.defaults = defaults;
marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

module.exports = marked;

/***/ })
/******/ ]);
});
//# sourceMappingURL=marked.js.map