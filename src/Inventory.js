import { findAllIndexes } from "./Functions.js"
import Sale from "./Sale.js"
import { handleNonPromotionProcess, handlePromotionProcess, MemberShipProcess } from "./View/inputView.js"
import { readFileAndParse } from "./readMD.js"


export default class Inventory {
    products = []


    constructor(PRODUCTS) {
        this.products = PRODUCTS
        // this.buy()
    }

    get STOCK() {
        return this.products
    }

    buy(INPUT_OBJECTS) {
        const QUANTITY_SUFFICIENT = this.quantityTest(INPUT_OBJECTS)//하나라도 false면 false

        if (!QUANTITY_SUFFICIENT) {//재고부족
            throw new Error()
        }

        const BUY_ARRAY = promotion(INPUT_OBJECTS)
        const BILL = this.buyProcess(BUY_ARRAY)

        BILL = this.MemberShip(BILL)
        return [BILL, BUY_ARRAY]
    }

    MemberShip(BILL) {
        const IS_MEMBERSHIP = this.isMemberShip()
        const DISCOUNT_AMOUNT = 30 / 100
        if (IS_MEMBERSHIP) {
            BILL.memberShipDiscount = BILL.nonDiscountAmount * DISCOUNT_AMOUNT
        }
        return BILL
    }


    isMemberShip() {
        const RESPONSE = MemberShipProcess()
        if (RESPONSE == 'Y' || RESPONSE == 'y') {
            return true
        }
        if (RESPONSE == 'N') {
            return false
        }
    }

    buyProcess(...BUY_ARRAY) {
        let totalPurchase = 0
        let discountAmount = 0
        let nonDiscountAmount = 0

        BUY_ARRAY.forEach(buyObject => {
            const SOLD_PRODUCT_INDEX = this.products.findIndex(object => object.name == buyObject.name && object.promotion == buyObject.promotion)//인덱스찾기
            Number(this.products[SOLD_PRODUCT_INDEX].quantity) -= buyObject.sell //팔기
            totalPurchase += Number(this.products[SOLD_PRODUCT_INDEX].price) * buyObject.sell//물품당 구매총액
            discountAmount -= Number(this.products[SOLD_PRODUCT_INDEX].price) * buyObject.freeGift// 할인 금액      
            if (buyObject.promotion == 'null' || buyObject.nonPromotion) {//할인 아닐때
                nonDiscountAmount += Number(this.products[SOLD_PRODUCT_INDEX].price) * buyObject.sell//프로모션 제외 금액
            }
        })
        return { totalPurchase, discountAmount, nonDiscountAmount }
    }


    product(PRODUCT_INDEX) {
        return this.products[PRODUCT_INDEX]
    }

    promotion(INPUT_OBJECTS) {//[ { name: '콜라', quantity: 10 }, { name: '사이다', quantity: 3 } ]
        let buyArr = []
        INPUT_OBJECTS.forEach(INPUT_OBJECT => {
            const PROMOTION_EXIST = this.isPromotionExist(INPUT_OBJECT)
            const PRODUCT_INDEX = this.products.findIndex(product => product.name === INPUT_OBJECT.name)
            let result;

            // `needMore` 속성이 발견되면 수량을 업데이트하고 다시 promotionCheck를 호출합니다.
            do {
                result = this.promotionCheck(INPUT_OBJECT, PROMOTION_EXIST, PRODUCT_INDEX)
                this.promotionResponseCheck(INPUT_OBJECT, result, buyArr)
            } while (result.needMore) // `needMore`가 없을 때까지 반복

        })
        return buyArr.flat()
    }

    promotionResponseCheck(INPUT_OBJECT, result, buyArr) {
        const NONPROMOTION_OBJECT = result.find(object => object.nonPromotion);
        if (NONPROMOTION_OBJECT) {
            const IS_RE_PURCHASE = handleNonPromotionProcess(NONPROMOTION_OBJECT.name, NONPROMOTION_OBJECT.nonPromotion)
            if (IS_RE_PURCHASE) {//Y
                buyArr.push(result)
            } else {
                const nonPROMOTION_OBJECT_INDEX = result.findIndex(object => object.nonPromotion)
                result.splice(nonPROMOTION_OBJECT_INDEX, nonPROMOTION_OBJECT_INDEX + 1)
                buyArr.push(result)
            }
        } else if (result.needMore) {
            const IS_RE_PURCHASE = handlePromotionProcess(result.name, result.needMore)
            if (IS_RE_PURCHASE) { //Y
                INPUT_OBJECT.quantity += Number(result.needMore)
            } else {//N
                result.needMore = undefined// 기존 원하는 구매대로 진행
            }
        } else if (!result.needMore) {
            buyArr.push(result)
        }
    }

    promotionCheck(INPUT_OBJECT, PROMOTION_EXIST, PRODUCT_INDEX) {//{ name: '콜라', quantity: 10 }, boolean, number
        const PROMOTION_PATH = './public/promotions.md'
        const SALE = new Sale(readFileAndParse(PROMOTION_PATH))
        const IN_PROGRESS = SALE.isInProgress(this.product(PRODUCT_INDEX))

        //한개씩 체크
        if (PROMOTION_EXIST) {//프로모션 해당 있음
            if (IN_PROGRESS) {//프로모션 진행중

                return SALE.preceedPromotion(INPUT_OBJECT, this.product(PRODUCT_INDEX))//프로모션 체크


            } else if (!IN_PROGRESS) {//프로모션 기간 끝남
                return SALE.endPromotion(INPUT_OBJECT, this.product(PRODUCT_INDEX))
            }
        } else if (!PROMOTION_EXIST) {//프로모션 해당 없음
            return { name: INPUT_OBJECT.name, sell: INPUT_OBJECT.quantity, promotion: 'null' }//일반재고 소모
        }
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
const INPUT_OBJECTS = inven.inputExchanger('[콜라 - 10], [사이다-3], [오렌지주스-1]')
inven.promotion(INPUT_OBJECTS)
