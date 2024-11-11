import { DateTimes } from "@woowacourse/mission-utils"

export default class Sale {
    promotions = []
    // [
    // { name: '탄산2+1', buy: '2', get: '1', start_date: '2024-01-01', end_date: '2024-12-31' },
    // { name: 'MD추천상품', buy: '1', get: '1', start_date: '2024-01-01', end_date: '2024-12-31' },
    // { name: '반짝할인', buy: '1', get: '1', start_date: '2024-11-01', end_date: '2024-11-30' }
    // ]

    constructor(PROMOTIONS) {
        this.promotions = PROMOTIONS
    }

    preceedPromotion(INPUT_OBJECT, product) {//{ name: '콜라', quantity: 10 }, { name: '콜라', price: '1000', quantity: '10', promotion: '탄산2+1' }
        const PROMOTION_QUANTITY_IS_SUFFICIENT = this.quantityCheck(INPUT_OBJECT, product)
        const BROUGHT_CHECK = this.broughtCheck(INPUT_OBJECT, product)
        const BROUGHT_LACK = BROUGHT_CHECK.isLack
        const GET_MORE = BROUGHT_CHECK.getMore
        const FREE_GIFT = this.calFreeGift(INPUT_OBJECT, product)
        const REMAIN_NUMBER = Number(this.findPromotion(product).buy) + Number(this.findPromotion(product).get)

        switch (PROMOTION_QUANTITY_IS_SUFFICIENT) {
            case 'sufficient':
                if (BROUGHT_LACK) {
                    return { message: `현재 ${INPUT_OBJECT.name}은(는) ${GET_MORE}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`, needMore: GET_MORE };
                }
                return [{ name: INPUT_OBJECT.name, sell: INPUT_OBJECT.quantity, promotion: product.promotion, freeGift: FREE_GIFT }]
            case 'lack':
                if (FREE_GIFT != 0) {//프로모션 적용 가능
                    return [
                        { name: INPUT_OBJECT.name, sell: FREE_GIFT * REMAIN_NUMBER, promotion: product.promotion, freeGift: FREE_GIFT },//프로모션 적용 재고 소모
                        { name: INPUT_OBJECT.name, sell: product.quantity - FREE_GIFT * REMAIN_NUMBER, promotion: product.promotion },//프로모션 미적용 재고 소모
                        { name: INPUT_OBJECT.name, sell: INPUT_OBJECT.quantity - product.quantity, promotion: 'null' }//일반 재고 소모
                    ]
                }
                if (FREE_GIFT == 0) {//프로모션 적용 불가
                    return [
                        { name: INPUT_OBJECT.name, sell: product.quantity, promotion: product.promotion },//미적용 재고 소모
                        { name: INPUT_OBJECT.name, sell: INPUT_OBJECT.quantity - product.quantity, promotion: 'null' }//일반 재고 소모
                    ]
                }
            case 'zero':
                return [{ name: INPUT_OBJECT.name, sell: INPUT_OBJECT.quantity, promotion: 'null' }]//일반 재고 소모
        }
    }

    calFreeGift(INPUT_OBJECT, product) {
        const BUY_AMOUNT = Number(this.findPromotion(product).buy) // 프로모션 조건의 구매 수량
        const FREE_AMOUNT = Number(this.findPromotion(product).get) // 프로모션 조건의 무료 제공 수량
        let inputQuantity = Number(INPUT_OBJECT.quantity)
        let freeGift = 0

        while (BUY_AMOUNT + FREE_AMOUNT <= inputQuantity) {
            inputQuantity -= (BUY_AMOUNT + FREE_AMOUNT)
            freeGift += 1
        }

        return freeGift
    }

    broughtCheck(INPUT_OBJECT, product) {
        const REMAIN_NUMBER = Number(this.findPromotion(product).buy) + Number(this.findPromotion(product).get)
        const PROMOTION_CONDITION = Number(this.findPromotion(product).buy)
        const INPUT_QUANTITY = Number(INPUT_OBJECT.quantity)

        if (INPUT_QUANTITY % REMAIN_NUMBER == PROMOTION_CONDITION) {//get에 맞게 가져온 경우
            return { isLack: true, getMore: this.findPromotion(product).buy }
        }
        if (INPUT_QUANTITY % REMAIN_NUMBER == 0) {//알맞게 가져온 경우
            return { isLack: false, getMore: undefined }
        }
        return { isLack: false, getMore: undefined }//promotion 해당안되는 경우
    }

    endPromotion(INPUT_OBJECT, product) {
        const PROMOTION_QUANTITY_IS_SUFFICIENT = this.quantityCheck(INPUT_OBJECT, product)
        switch (PROMOTION_QUANTITY_IS_SUFFICIENT) {
            case 'sufficient':
                return [{ name: INPUT_OBJECT.name, sell: INPUT_OBJECT.quantity, promotion: product.promotion }]//프로모션 재고 소모
            case 'lack':
                return [
                    { name: INPUT_OBJECT.name, sell: product.quantity, promotion: product.promotion },//프로모션 재고 소모
                    { name: INPUT_OBJECT.name, sell: INPUT_OBJECT.quantity - product.quantity, promotion: 'null' }//일반 재고 소모
                ]
            case 'zero':
                return [{ name: INPUT_OBJECT.name, sell: INPUT_OBJECT.quantity, promotion: 'null' }]//일반 재고 소모
        }
    }

    quantityCheck(INPUT_OBJECT, product) {
        const PROMOTION_QUANTITY = product.quantity
        const WANT_QUANTITY = INPUT_OBJECT.quantity

        if (PROMOTION_QUANTITY == 0) {//프로모션 재고 없음
            return 'zero'
        }
        if (WANT_QUANTITY > PROMOTION_QUANTITY) {//프로모션 재고 부족
            return 'lack'
        }
        if (WANT_QUANTITY <= PROMOTION_QUANTITY) {//프로모션 재고 충분
            return 'sufficient'
        }
    }


    isInProgress(product) {
        const PROMOTION_BY_PRODUCT = this.findPromotion(product)
        const START_TIME = new Date(PROMOTION_BY_PRODUCT.start_date).getTime()
        const NOW_TIME = new Date(DateTimes.now()).getTime()
        const END_TIME = new Date(PROMOTION_BY_PRODUCT.end_date).getTime()

        return START_TIME <= NOW_TIME && NOW_TIME <= END_TIME
    }

    findPromotion(product) {
        return this.promotions.find(promotion => promotion.name === product.promotion)
    }
}

