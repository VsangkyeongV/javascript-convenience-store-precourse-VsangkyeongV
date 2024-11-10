import { findAllIndexes } from "./Functions"


export default class Inventory {
    products = []

    constructor(PRODUCTS) {
        this.products = PRODUCTS
        // this.buy()
    }

    buy(inputString) {
        const INPUT_OBJECT = this.inputExchanger(inputString)
        const QUANTITY_SUFFICIENT = this.isQuantitySufficient(INPUT_OBJECT)
        if (!QUANTITY_SUFFICIENT) {//재고부족
            throw new Error()
        }

    }

    isQuantitySufficient(INPUT_OBJECT) {
        const PRODUCTS_INDEX_ARR = this.findProductIndexes(INPUT_OBJECT)
        let productsQuntity = 0

        PRODUCTS_INDEX_ARR.forEach(i => {
            productsQuntity += this.products[i].quantity
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