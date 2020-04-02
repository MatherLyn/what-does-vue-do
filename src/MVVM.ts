import Compiler from './Compiler'

export default class MVVM {
    public $el: El
    public $data: Object
    public $options: Options
    constructor (options: Options) {
        this.$el = options.el
        this.$data = options.data
        this.$options = options
        if (this.$el && (typeof this.$el === 'string' || typeof this.$el === 'object')) {
            new Compiler(this.$el, this)
        }
    }
}