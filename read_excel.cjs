const xlsx = require('xlsx');
const wb = xlsx.readFile('Tiêu chuẩn đánh giá chất lượng trung tâm Du Học Hàn Quốc.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);
console.log(JSON.stringify(data, null, 2));
