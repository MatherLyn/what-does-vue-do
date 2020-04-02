import MVVM from './MVVM'

const vm = new MVVM({
    el: '#app',
    data: {
        person: {
            name: 'Lyn',
            age: 20,
            fav: 'girls'
        },
        msg: 'Learning MVVM framework.'
    }
})