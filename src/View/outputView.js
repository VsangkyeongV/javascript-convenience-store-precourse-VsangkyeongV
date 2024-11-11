import { Console } from "@woowacourse/mission-utils"

export const comeView = (products) => {
    const HI_MESSAGE = '안녕하세요. W편의점입니다.\n' + '현재 보유하고 있는 상품입니다.\n'
    Console.print(HI_MESSAGE)

    products.forEach(product => {
        const PRINT_STRING = `- ${product.name} ${product.price}원 ${product.quantity}개 ${product.promotion === 'null' ? '' : product.promotion}`
        Console.print(PRINT_STRING)
    })
    Console.print('\n')
}