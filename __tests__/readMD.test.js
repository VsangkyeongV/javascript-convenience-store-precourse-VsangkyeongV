import { readFileAndParse } from "../src/readMD"

describe("읽기 함수 테스트", () => {
    test("products로 테스트", () => {

        const PRODUCT_PATH = './public/products.md';
        const READ_FILE = readFileAndParse(PRODUCT_PATH)
        const EXPECT_DATA = { name: '콜라', price: '1000', quantity: '10', promotion: '탄산2+1' }

        expect(READ_FILE[0]).toEqual(EXPECT_DATA)
    })
    test("promotions로 테스트", () => {
        const PROMOTION_PATH = './public/promotions.md';
        const READ_FILE = readFileAndParse(PROMOTION_PATH)
        const EXPECT_DATA = [
            { name: '탄산2+1', buy: '2', get: '1', start_date: '2024-01-01', end_date: '2024-12-31' },
            { name: 'MD추천상품', buy: '1', get: '1', start_date: '2024-01-01', end_date: '2024-12-31' },
            { name: '반짝할인', buy: '1', get: '1', start_date: '2024-11-01', end_date: '2024-11-30' }
        ]
        expect(READ_FILE).toEqual(EXPECT_DATA)
    })
})