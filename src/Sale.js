import { DateTimes } from "@woowacourse/mission-utils"

export default class Sale {
    promotions = []

    constructor(PROMOTIONS) {
        this.promotions = PROMOTIONS
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

