import Sale from "../src/Sale.js";
import { readFileAndParse } from "../src/readMD.js";

describe("할인관리", () => {
    test("할인 초기세팅", () => {
        const PROMOTION_PATH = './public/promotions.md';
        const SALE = new Sale(readFileAndParse(PROMOTION_PATH))
        const EXPECT_DATA = [
            { name: '탄산2+1', buy: '2', get: '1', start_date: '2024-01-01', end_date: '2024-12-31' },
            { name: 'MD추천상품', buy: '1', get: '1', start_date: '2024-01-01', end_date: '2024-12-31' },
            { name: '반짝할인', buy: '1', get: '1', start_date: '2024-11-01', end_date: '2024-11-30' }
        ]
        console.log("결과: ", SALE.promotions)
        expect(SALE.promotions).toEqual(EXPECT_DATA)
    })
})