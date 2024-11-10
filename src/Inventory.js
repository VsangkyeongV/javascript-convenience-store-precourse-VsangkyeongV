import { findAllIndexes } from "./Functions.js"
import Sale from "./Sale.js"
import { readFileAndParse } from "./readMD.js"

export default class Inventory {
    products = []

    constructor(PRODUCTS) {
        this.products = PRODUCTS
        // this.buy()
    }

    buy(inputString) {
        const INPUT_OBJECTS = this.inputExchanger(inputString)
        const QUANTITY_SUFFICIENT = this.quantityTest(INPUT_OBJECTS)//하나라도 false면 false

        if (!QUANTITY_SUFFICIENT) {//재고부족
            throw new Error()
        }

        promotion(INPUT_OBJECTS)

    }

    product(PRODUCT_INDEX) {
        return this.products[PRODUCT_INDEX]
    }

    promotion(INPUT_OBJECTS) {//[ { name: '콜라', quantity: 10 }, { name: '사이다', quantity: 3 } ]
        INPUT_OBJECTS.forEach(INPUT_OBJECT => {
            const PROMOTION_EXIST = this.isPromotionExist(INPUT_OBJECT)
            const PRODUCT_INDEX = this.products.findIndex(product => product.name === INPUT_OBJECT.name)
            this.promotionCheck(INPUT_OBJECT, PROMOTION_EXIST, PRODUCT_INDEX)
        })
    }

    promotionCheck(INPUT_OBJECT, PROMOTION_EXIST, PRODUCT_INDEX) {//boolean, number
        const PROMOTION_PATH = './public/promotions.md'
        const SALE = new Sale(readFileAndParse(PROMOTION_PATH))
        const IN_PROGRESS = SALE.isInProgress(this.product(PRODUCT_INDEX))

        //한개씩 체크
        if (PROMOTION_EXIST) {//프로모션 진행중
            if (IN_PROGRESS) {

            } else if (!IN_PROGRESS) {//프로모션 기간 끝남

            }
        } else if (!PROMOTION_EXIST) {//프로모션 해당 없음

        }
        //return {index, buyNumber}
    }

    isPromotionExist(INPUT_OBJECT) {// object 하나 테스트
        const MATCH_STRING = 'null'
        let result
        const product = this.products.find(OBJECT => OBJECT.name === INPUT_OBJECT.name)

        result = product && product.promotion !== MATCH_STRING //맞으면 true
        return result
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
inven.isPromotionExist({ name: '물', quantity: 3 })
const INPUT_OBJECTS = inven.inputExchanger('[콜라 - 10], [사이다-3]')
inven.promotion(INPUT_OBJECTS)
