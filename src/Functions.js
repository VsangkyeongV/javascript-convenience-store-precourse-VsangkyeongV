export const findAllIndexes = (array, condition) => {
    return array
        .map((element, index) => (condition(element) ? index : -1)) // 조건에 맞는 인덱스 반환
        .filter(index => index !== -1) // 유효하지 않은 인덱스(-1)는 제외
};