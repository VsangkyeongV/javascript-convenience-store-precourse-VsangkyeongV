import Inventory from "../src/Inventory"
import { readFileAndParse } from "../src/readMD.js"

describe("Inventory테스트", () => {
    const PRODUCT_PATH = './public/products.md';
    const INVEN = new Inventory(readFileAndParse(PRODUCT_PATH))

    test("재고 초기세팅", () => {
        const EXPECT_DATA = [
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
        ]

        expect(INVEN.products).toEqual(EXPECT_DATA)
    })

    test("inputExchanger test", () => {
        const INPUT = '[콜라 - 10], [사이다-3]'
        const EXPECT_DATA = [
            { name: '콜라', quantity: 10 },
            { name: '사이다', quantity: 3 }
        ]
        expect(INVEN.inputExchanger(INPUT)).toEqual(EXPECT_DATA)

    })

    test("findProductIndexes test", () => {
        const INPUT = { name: '콜라', quantity: 10 }
        const EXPECT_DATA = [0, 1]
        expect(INVEN.findProductIndexes(INPUT)).toEqual(EXPECT_DATA)
    })

    test("isQuantitySufficient test", () => {
        const INPUT = { name: '콜라', quantity: 20 }
        const EXPECT_DATA = true
        expect(INVEN.isQuantitySufficient(INPUT)).toBe(EXPECT_DATA)
    })

    test("quantityTest test", () => {
        const INPUT = [
            { name: '콜라', quantity: 20 },
            { name: '사이다', quantity: 3 }
        ]
        const EXPECT_DATA = true
        expect(INVEN.quantityTest(INPUT)).toEqual(EXPECT_DATA)
    })

    test("isPromotionExist test", () => {
        const INPUT = { name: '물', quantity: 3 }
        const EXPECT_DATA = false
        expect(INVEN.isPromotionExist(INPUT)).toEqual(EXPECT_DATA)
    })

    // test("", () => {
    //     const INPUT = ''
    //     const EXPECT_DATA = ''
    //     expect(INVEN.quantityTest(INPUT)).toEqual(EXPECT_DATA)
    // })
})
