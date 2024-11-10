import { findAllIndexes } from "./Functions.js"


export default class Inventory {
    products = []

    constructor(PRODUCTS) {
        this.products = PRODUCTS
        // this.buy()
    }

    buy(inputString) {
        const INPUT_OBJECTS = this.inputExchanger(inputString)
        const QUANTITY_SUFFICIENT = this.quantityTest(INPUT_OBJECTS)

        if (!QUANTITY_SUFFICIENT) {//재고부족
            throw new Error()
        }
        // if ()

    }

    quantityTest(INPUT_OBJECTS) {
        let result = true
        INPUT_OBJECTS.forEach(INPUT_OBJECT => {
            if (!this.isQuantitySufficient(INPUT_OBJECT)) {
                result = false
            }
        })
        return result
    }

    isQuantitySufficient(INPUT_OBJECT) {
        const PRODUCTS_INDEX_ARR = this.findProductIndexes(INPUT_OBJECT)
        let productsQuntity = 0

        PRODUCTS_INDEX_ARR.forEach(i => {
            productsQuntity += Number(this.products[i].quantity)
        })

        return productsQuntity >= INPUT_OBJECT.quantity
    }

    findProductIndexes(buyObject) {// { name: '콜라', quantity: 10 }
        return findAllIndexes(this.products, product => product.name === buyObject.name)
    }

    inputExchanger(buyString) {//'[콜라 - 10], [사이다-3]'
        const MATCH = /[\[\]]/g
        const SEPARATOR = '-'
        return buyString
            .split("],") // 아이템 단위로 나누기
            .map(item => {
                const [namePart, quantityPart] = item.replace(MATCH, "").split(SEPARATOR)
                return {
                    name: namePart.trim(),
                    quantity: Number(quantityPart.trim())
                }
            })
    }

}

//debug code
const inven = new Inventory([
    { name: '콜라', price: '1000', quantity: '10', promotion: '탄산2+1' },
    { name: '콜라', price: '1000', quantity: '10', promotion: 'null' },
    { name: '사이다', price: '1000', quantity: '8', promotion: '탄산2+1' },
    { name: '사이다', price: '1000', quantity: '7', promotion: 'null' },
    { name: '오렌지주스', price: '1800', quantity: '9', promotion: 'MD추천상품' },
    { name: '탄산수', price: '1200', quantity: '5', promotion: '탄산2+1' },
    { name: '물', price: '500', quantity: '10', promotion: 'null' },
    { name: '비타민워터', price: '1500', quantity: '6', promotion: 'null' },
    { name: '감자칩', price: '1500', quantity: '5', promotion: '반짝할인' },
    { name: '감자칩', price: '1500', quantity: '5', promotion: 'null' },
    { name: '초코바', price: '1200', quantity: '5', promotion: 'MD추천상품' },
    { name: '초코바', price: '1200', quantity: '5', promotion: 'null' },
    { name: '에너지바', price: '2000', quantity: '5', promotion: 'null' },
    { name: '정식도시락', price: '6400', quantity: '8', promotion: 'null' },
    { name: '컵라면', price: '1700', quantity: '1', promotion: 'MD추천상품' },
    { name: '컵라면', price: '1700', quantity: '10', promotion: 'null' }
])

inven.isQuantitySufficient({ name: '콜라', quantity: 21 })
