import { Console } from "@woowacourse/mission-utils";

export const handlePromotionProcess = async (name, needMore) => {
    let message = `현재 ${name}은(는) ${needMore}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`
    let userResponse = await Console.readLineAsync(message) // Y/N을 입력받는 코드 (환경에 따라 다른 방법으로 대체 가능)
    if (userResponse === 'Y' || userResponse === 'y') {
        return true
    } else {
        return false
    }
}

export const handleNonPromotionProcess = async (name, quantity) => {
    let message = `현재 ${name} ${quantity}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)`
    let userResponse = await Console.readLineAsync(message)
    if (userResponse === 'Y' || userResponse === 'y') {
        return true
    } else {
        return false
    }
}

export const MemberShipProcess = async () => {
    const MEMBERSHIP_PROMPT = '멤버십 할인을 받으시겠습니까? (Y/N)'
    const userResponse = await Console.readLineAsync(MEMBERSHIP_PROMPT)
    if (userResponse === 'Y' || userResponse === 'y') {
        return true
    } else {
        return false
    }
}


export const orderView = async () => {
    const ORDER_STRING = '구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])\n'
    let valid = false
    let INPUT_OBJECTS
    let userResponse

    const isValid = (text) => {
        if (!text) {
            valid = false
            //
        } else {
            valid = true
        }
    }

    const inputExchanger = (buyString) => {//'[콜라 - 10], [사이다-3]'
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

    do {
        userResponse = await Console.readLineAsync(ORDER_STRING)
        isValid(userResponse)
        if (valid) {
            INPUT_OBJECTS = inputExchanger(userResponse) // 유효하면 변환
        }
    } while (!valid)

    return INPUT_OBJECTS

}

export const billView = async () => {
    const userResponse = await Console.print()
}