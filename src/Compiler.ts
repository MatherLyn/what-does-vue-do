import MVVM from "./MVVM"

export default class Compiler {
    public el: Element
    private fragment: DocumentFragment
    constructor (el: any, vm: MVVM) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el)
        this.fragment = this.node2Fragment(this.el)
    }

    isElementNode (node: Element) {
        return node.nodeType === 1
    }

    node2Fragment (el: Element): DocumentFragment {
        const f = document.createDocumentFragment()
        let firstChild: Node
        while (firstChild = el.firstChild) {
            f.appendChild(firstChild)
        }
        console.log(f)
        return f
    }
}