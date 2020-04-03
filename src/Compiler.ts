import MVVM from "./MVVM"

export default class Compiler {
    public el: Element

    public vm: MVVM

    private fragment: DocumentFragment

    private compileUtil: Object = {
        text (node: Element, expr: string, vm: MVVM) {
            let value: any
            if (expr.indexOf('{{') !== -1 && expr.indexOf('}}') !== -1) {
                value = expr.replace(/\{\{\s*(.+?)\s*\}\}/g, (...args): string => {
                    return this.getVal(args[1], vm)
                })
            } else {
                value = this.getVal(expr, vm)
            }
            this.updater.textUpdater(node, value)
        },

        html (node: Element, expr: string, vm: MVVM) {
            const value: any = this.getVal(expr, vm)
            this.updater.htmlUpdater(node, value)
        },

        model (node: Element, expr: string, vm: MVVM) {
            const value: any = this.getVal(expr, vm)
            this.updater.modelUpdater(node, value)
        },

        on (node: Element, expr: string, vm: MVVM, eventName: string) {
            const fn = vm.$options.method && vm.$options.method[expr]
            node.addEventListener(eventName, fn.bind(vm), false)
        },

        getVal (expr: string, vm: MVVM): any {
            return expr.split('.').reduce((previousValue, currentValue) => {
                return previousValue[currentValue]
            }, vm.$data)
        },

        updater: {
            textUpdater (node: Element, value: any) {
                node.textContent = value
            },
            htmlUpdater (node: Element, value: any) {
                node.innerHTML = value
            },
            modelUpdater (node: Element, value: any) {
                node.textContent = value
            }
        }
    }
    constructor (el: any, vm: MVVM) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el)
        this.vm = vm
        this.fragment = this.node2Fragment(this.el)
        this.compile(this.fragment)
        this.el.appendChild(this.fragment)
    }

    isElementNode (node: Element): boolean {
        return node.nodeType === 1
    }

    node2Fragment (el: Element): DocumentFragment {
        const f = document.createDocumentFragment()
        let firstChild: Node
        while (firstChild = el.firstChild) {
            f.appendChild(firstChild)
        }
        return f
    }

    compile (f: DocumentFragment) {
        const childNodes: Array<Node> = Array.prototype.slice.call(f.childNodes)
        childNodes.forEach((node: any) => {
            if (this.isElementNode(node)) {
                this.compileElement(node)
            } else {
                this.compileText(node)
            }
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }

    compileElement (element: Element) {
        const attributes = Array.prototype.slice.call(element.attributes)
        attributes.forEach((attr: Attr) => {
            const { name, value } = attr
            if (name.startsWith('v-')) {
                const directive: string = name.substring(2)
                const [ dirName, eventName ] = directive.split(':')
                this.compileUtil[dirName](element, value, this.vm, eventName)
                element.removeAttribute('v-' + directive)
            } else if (name.startsWith('@')) {
                const eventName = name.slice(1)
                this.compileUtil['on'](element, value, this.vm, eventName)
            }
        })
    }

    compileText (textNode: Text) {
        const content: string = textNode.textContent
        if (/\{\{\s*(.+?)\s*\}\}/.test(content)) {
            this.compileUtil['text'](textNode, content, this.vm)
        }
    }
}