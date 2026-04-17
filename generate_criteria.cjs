const xlsx = require('xlsx');
const fs = require('fs');

const wb = xlsx.readFile('Tiêu chuẩn đánh giá chất lượng trung tâm Du Học Hàn Quốc.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

// Tìm dòng trọng số
const weightRow = data.find(r => r['Tiêu chí'] && (r['Tiêu chí'].includes('Trọng số') || r['Tiêu chí'].includes('Weight')));

// Lấy danh sách các cột tiêu chí (bỏ cột 'Tiêu chí' và 'Trọng số (%)' nếu nó là cột rác)
const columns = Object.keys(data[0]).filter(k => k !== 'Tiêu chí' && k !== 'Trọng số (%)');

const criteriaIdMap = {
    "Tuổi đời công ty": "tuoi_doi",
    "Pháp lý": "phap_ly",
    "Minh bạch chi phí": "chi_phi",
    "Mối quan hệ các trường Hàn Quốc": "moi_quan_he",
    "Số lượng xuất cảnh": "so_luong_xuat_canh",
    "Năng lực xử lý hồ sơ": "nang_luc_xu_ly",
    "Kinh nghiệm xử lý hồ sơ": "kinh_nghiem",
    "Học bổng": "hoc_bong",
    "Bộ máy lãnh đạo": "bo_may",
    "Đội ngũ giáo viên": "giao_vien",
    "Đào tạo tiếng Hàn": "dao_tao",
    "Hỗ trợ tại Hàn Quốc sau bay": "ho_tro",
    "Tầm nhìn sự nghiệp lâu dài": "tam_nhin",
    "Cơ sở vật chất": "csvc",
    "Hệ thống báo cáo định kỳ cho phụ huynh": "he_thong_bao_cao"
};

const questionsMap = {
    "tuoi_doi": "Trung tâm này đã hoạt động được bao lâu?",
    "phap_ly": "Hồ sơ pháp lý, giấy phép hoạt động của họ như thế nào?",
    "chi_phi": "Cách họ báo giá và xử lý các khoản phí liên quan?",
    "moi_quan_he": "Họ có mối quan hệ trực tiếp với bao nhiêu trường Đại học?",
    "so_luong_xuat_canh": "Quy mô số lượng học sinh xuất cảnh hàng năm?",
    "nang_luc_xu_ly": "Đội ngũ chuyên viên xử lý hồ sơ có năng lực thế nào?",
    "kinh_nghiem": "Kinh nghiệm thực tế khi xử lý các bộ hồ sơ khó?",
    "hoc_bong": "Họ có khả năng xin học bổng chuyên sâu hay không?",
    "bo_may": "Bộ máy lãnh đạo và quản trị trung tâm quy mô ra sao?",
    "giao_vien": "Chất lượng đội ngũ giáo viên dạy tiếng Hàn?",
    "dao_tao": "Chất lượng, lộ trình và kết quả đào tạo tiếng Hàn trước bay?",
    "ho_tro": "Họ cam kết hỗ trợ gì khi bạn sang đến Hàn Quốc?",
    "tam_nhin": "Họ có định hướng tầm nhìn nghề nghiệp gì cho du học sinh?",
    "csvc": "Cơ sở vật chất giảng dạy và ký túc xá thế nào?",
    "he_thong_bao_cao": "Phụ huynh có được nhận báo cáo định kỳ không và chi tiết thế nào?"
};

const criteriaArray = columns.map((colStr, index) => {
    const id = criteriaIdMap[colStr] || colStr.toLowerCase().replace(/\s+/g, '_');
    const title = colStr.replace('Kinh nhiệm', 'Kinh nghiệm');

    // Lấy trọng số từ dòng Trọng số, nếu không có thì mặc định 1.0
    let weight = 1.0;
    if (weightRow && weightRow[colStr]) {
        // Có thể là dạng % (0.1) hoặc số nguyên (10)
        let val = weightRow[colStr];
        if (typeof val === 'string' && val.includes('%')) {
            weight = parseFloat(val) / 100;
        } else {
            weight = parseFloat(val) || 1.0;
        }
    }

    const options = data.filter(row => {
        const starStr = String(row['Tiêu chí'] || '');
        // Chỉ lấy các dòng 1*, 2*, 3*, 4*, 5* và không lấy dòng có desc rác
        return (starStr.includes('1') || starStr.includes('2') || starStr.includes('3') || starStr.includes('4') || starStr.includes('5'))
            && row[colStr]
            && row[colStr].toString().trim() !== "1"
            && row[colStr].toString().trim() !== "2"
            && row[colStr].toString().trim() !== "3"
            && row[colStr].toString().trim() !== "4"
            && row[colStr].toString().trim() !== "5";
    }).map(row => {
        const starStr = String(row['Tiêu chí']);
        let stars = 1;
        if (starStr.includes('5')) stars = 5;
        else if (starStr.includes('4')) stars = 4;
        else if (starStr.includes('3')) stars = 3;
        else if (starStr.includes('2')) stars = 2;

        return {
            stars,
            desc: row[colStr] ? row[colStr].toString().trim() : 'Không có thông tin'
        };
    }).sort((a, b) => a.stars - b.stars);

    // Đảm bảo đủ 5 options, nếu thiếu thì fill 'Không có thông tin'
    const finalOptions = [1, 2, 3, 4, 5].map(s => {
        const existing = options.find(o => o.stars === s);
        return existing || { stars: s, desc: 'Không có thông tin' };
    });

    return {
        id,
        title,
        question: questionsMap[id] || `Đánh giá về tiêu chí: ${title}?`,
        weight: weight,
        order: index + 1,
        options: finalOptions
    };
});

const fileContent = `// Tự động tạo từ generate_criteria.cjs
export const CRITERIA_FALLBACK = ${JSON.stringify(criteriaArray, null, 4)};
`;

fs.writeFileSync('data/criteria.js', fileContent);
console.log("Successfully updated data/criteria.js with weights from Excel");
