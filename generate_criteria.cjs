const xlsx = require('xlsx');
const fs = require('fs');

const wb = xlsx.readFile('Tiêu chuẩn đánh giá chất lượng trung tâm Du Học Hàn Quốc.xlsx');
const sheet = wb.Sheets[wb.SheetNames[0]];
const data = xlsx.utils.sheet_to_json(sheet);

// Dữ liệu từ excel là dạng row theo số sao (5*, 4*, 3*, 2*, 1*). Cần pivot lại.
const columns = Object.keys(data[0]).filter(k => k !== 'Tiêu chí');

const criteriaIdMap = {
    "Tuổi đời công ty": "tuoi_doi",
    "Pháp lý": "phap_ly",
    "Minh bạch chi phí": "chi_phi",
    "Mối quan hệ các trường Hàn Quốc": "moi_quan_he",
    "Số lượng xuất cảnh": "so_luong_xuat_canh",
    "Năng lực xử lý hồ sơ": "nang_luc_xu_ly",
    "Kinh nhiệm xử lý hồ sơ": "kinh_nghiem",
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

const criteriaArray = columns.map((colStr) => {
    const id = criteriaIdMap[colStr] || colStr;
    const title = colStr.replace('Kinh nhiệm', 'Kinh nghiệm');
    
    const options = data.map(row => {
        const starStr = row['Tiêu chí'];
        let stars = 1;
        if(starStr.includes('5')) stars = 5;
        else if(starStr.includes('4')) stars = 4;
        else if(starStr.includes('3')) stars = 3;
        else if(starStr.includes('2')) stars = 2;
        
        return {
            stars,
            desc: row[colStr] ? row[colStr].toString().trim() : 'Không có thông tin'
        };
    }).sort((a,b) => a.stars - b.stars);

    return {
        id,
        title,
        question: questionsMap[id] || `Đánh giá về tiêu chí: ${title}?`,
        weight: 1.0,  // Default weight
        options
    };
});

const fileContent = `// Tự động tạo từ parse_excel.cjs
export const CRITERIA_FALLBACK = ${JSON.stringify(criteriaArray, null, 4)};
`;

fs.writeFileSync('data/criteria.js', fileContent);
console.log("Successfully wrote data/criteria.js");
