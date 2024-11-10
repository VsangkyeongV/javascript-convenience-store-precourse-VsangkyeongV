const fs = require('fs');

// CSV 문자열을 파싱하는 함수
const parseCSV = (data) => {
    const lines = data.trim().split('\n'); // 파일 내용을 줄 단위로 나눔
    const headers = lines[0].split(',');   // 첫 번째 줄을 헤더로 사용
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');   // 각 줄을 쉼표로 나눔
        const item = {};

        headers.forEach((header, index) => {
            item[header.trim()] = values[index] ? values[index].trim() : null;
        });

        result.push(item);
    }

    return result;
}

// 파일을 읽고 파싱하여 배열로 변환
export const readFileAndParse = (path) => {
    const data = fs.readFileSync(path, 'utf8');
    return parseCSV(data);
}