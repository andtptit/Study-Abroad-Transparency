// Tự động tạo từ parse_excel.cjs
export const CRITERIA_FALLBACK = [
    {
        "id": "tuoi_doi",
        "title": "Tuổi đời công ty",
        "question": "Trung tâm này đã hoạt động được bao lâu?",
        "weight": 1,
        "options": [
            {
                "stars": 1,
                "desc": "1 năm trở xuống"
            },
            {
                "stars": 2,
                "desc": "2-3 năm"
            },
            {
                "stars": 3,
                "desc": "3-5 năm"
            },
            {
                "stars": 4,
                "desc": "5-8 năm"
            },
            {
                "stars": 5,
                "desc": "Trên 8 năm"
            }
        ]
    },
    {
        "id": "phap_ly",
        "title": "Pháp lý",
        "question": "Hồ sơ pháp lý, giấy phép hoạt động của họ như thế nào?",
        "weight": 1,
        "options": [
            {
                "stars": 1,
                "desc": "- Giấy phép: Không có / hết hạn / bị đình chỉ\r\n- Hợp đồng: Không có hoặc không có giá trị pháp lý\r\n- Hóa đơn: Không có\r\n- Thuế: Không thực hiện nghĩa vụ thuế"
            },
            {
                "stars": 2,
                "desc": "- Giấy phép: Không đầy đủ hoặc sai ngành nghề\r\n- Hợp đồng: Không rõ ràng hoặc không phù hợp\r\n- Hóa đơn: Không xuất hóa đơn\r\n- Thuế: Không kê khai hoặc không nộp thuế"
            },
            {
                "stars": 3,
                "desc": "- Giấy phép: Có nhưng chưa đầy đủ (thiếu đào tạo hoặc tương đương)\r\n- Hợp đồng: Hợp đồng cơ bản\r\n- Hóa đơn: Không xuất thường xuyên hoặc chỉ khi yêu cầu\r\n- Thuế: Kê khai chưa nhất quán hoặc không đầy đủ"
            },
            {
                "stars": 4,
                "desc": "- Giấy phép: Đầy đủ\r\n- Hợp đồng: Hợp đồng đầy đủ (giấy hoặc điện tử)\r\n- Hóa đơn: Xuất hóa đơn VAT đầy đủ hoặc theo yêu cầu\r\n- Thuế: Có kê khai và nộp thuế, tương đối đầy đủ"
            },
            {
                "stars": 5,
                "desc": "- Giấy phép: Đầy đủ (Kinh doanh + Tư vấn du học + Đào tạo ngoại ngữ)\r\n- Hợp đồng: Hợp đồng điện tử hoặc chuẩn hóa đầy đủ\r\n- Hóa đơn: Xuất hóa đơn điện tử cho 100% giao dịch\r\n- Thuế: Kê khai và nộp thuế VAT đầy đủ"
            }
        ]
    },
    {
        "id": "chi_phi",
        "title": "Minh bạch chi phí",
        "question": "Cách họ báo giá và xử lý các khoản phí liên quan?",
        "weight": 1,
        "options": [
            {
                "stars": 1,
                "desc": "- Minh bạch: Không có bảng giá\r\n- Chi tiết: Không có bất kỳ tài liệu tài chính\r\n- Rủi ro: Chi phí không kiểm soát, chênh lệch lớn, rủi ro rất cao"
            },
            {
                "stars": 2,
                "desc": "- Minh bạch: Chỉ công khai một phần hoặc báo giá không nhất quán\r\n- Chi tiết: Không có bảng chi tiết rõ ràng\r\n- Rủi ro: Phát sinh nhiều chi phí sau, tổng chi phí tăng mạnh"
            },
            {
                "stars": 3,
                "desc": "- Minh bạch: Công khai chi phí chính\r\n- Chi tiết: Một phần chi phí chỉ ước tính hoặc ghi tổng\r\n- Rủi ro: Có thể phát sinh nhỏ hoặc khó kiểm tra"
            },
            {
                "stars": 4,
                "desc": "- Minh bạch: Báo giá rõ ràng\r\n- Chi tiết: Tách từng hạng mục hoặc theo từng giai đoạn\r\n- Rủi ro: Không có chi phí ẩn, có thể chưa bao gồm dự phòng"
            },
            {
                "stars": 5,
                "desc": "- Minh bạch: Lột tả 100% tổng chi phí\r\n- Chi tiết: Bao gồm toàn bộ chi phí (dịch vụ, học phí, hồ sơ, cá nhân...)\r\n- Rủi ro: Cam kết bằng văn bản không phát sinh"
            }
        ]
    },
    {
        "id": "moi_quan_he",
        "title": "Mối quan hệ các trường Hàn Quốc",
        "question": "Họ có mối quan hệ trực tiếp với bao nhiêu trường Đại học?",
        "weight": 1,
        "options": [
            {
                "stars": 1,
                "desc": "Ký MOU với 5-10 trường Hàn Quốc"
            },
            {
                "stars": 2,
                "desc": "Ký MOU với 10-25 trường Hàn Quốc"
            },
            {
                "stars": 3,
                "desc": "Không có thông tin"
            },
            {
                "stars": 4,
                "desc": "Ký MOU với 25-30 trường Hàn Quốc"
            },
            {
                "stars": 5,
                "desc": "Ký MOU với trên 30 trường Hàn Quốc"
            }
        ]
    },
    {
        "id": "so_luong_xuat_canh",
        "title": "Số lượng xuất cảnh",
        "question": "Quy mô số lượng học sinh xuất cảnh hàng năm?",
        "weight": 1,
        "options": [
            {
                "stars": 1,
                "desc": "Trên 500 Học sinh xuất cảnh"
            },
            {
                "stars": 2,
                "desc": "Trên 1000 Học sinh xuất cảnh"
            },
            {
                "stars": 3,
                "desc": "Trên 1500 Học sinh xuất cảnh"
            },
            {
                "stars": 4,
                "desc": "Trên 2000 Học sinh xuất cảnh"
            },
            {
                "stars": 5,
                "desc": "Trên 3000 Học sinh xuất cảnh"
            }
        ]
    },
    {
        "id": "nang_luc_xu_ly",
        "title": "Năng lực xử lý hồ sơ",
        "question": "Đội ngũ chuyên viên xử lý hồ sơ có năng lực thế nào?",
        "weight": 1,
        "options": [
            {
                "stars": 1,
                "desc": "5 người (100% có Topik 5-6, am hiểu sâu luật xuất nhập cảnh Hàn)."
            },
            {
                "stars": 2,
                "desc": "Không có thông tin"
            },
            {
                "stars": 3,
                "desc": "Trên 10 người (100% có Topik 5-6, am hiểu sâu luật xuất nhập cảnh Hàn)."
            },
            {
                "stars": 4,
                "desc": "Trên 15 người (100% có Topik 5-6, am hiểu sâu luật xuất nhập cảnh Hàn)."
            },
            {
                "stars": 5,
                "desc": "Trên 20 người (100% có Topik 5-6, am hiểu sâu luật xuất nhập cảnh Hàn)."
            }
        ]
    },
    {
        "id": "kinh_nghiem",
        "title": "Kinh nghiệm xử lý hồ sơ",
        "question": "Kinh nghiệm thực tế khi xử lý các bộ hồ sơ khó?",
        "weight": 1,
        "options": [
            {
                "stars": 1,
                "desc": "Tệ"
            },
            {
                "stars": 2,
                "desc": "Bình thường"
            },
            {
                "stars": 3,
                "desc": "Trung bình"
            },
            {
                "stars": 4,
                "desc": "Tốt"
            },
            {
                "stars": 5,
                "desc": "Rất tốt"
            }
        ]
    },
    {
        "id": "hoc_bong",
        "title": "Học bổng",
        "question": "Họ có khả năng xin học bổng chuyên sâu hay không?",
        "weight": 1,
        "options": [
            {
                "stars": 1,
                "desc": "Tệ"
            },
            {
                "stars": 2,
                "desc": "Bình thường"
            },
            {
                "stars": 3,
                "desc": "Trung bình"
            },
            {
                "stars": 4,
                "desc": "Tốt"
            },
            {
                "stars": 5,
                "desc": "Rất tốt"
            }
        ]
    },
    {
        "id": "bo_may",
        "title": "Bộ máy lãnh đạo",
        "question": "Bộ máy lãnh đạo và quản trị trung tâm quy mô ra sao?",
        "weight": 1,
        "options": [
            {
                "stars": 1,
                "desc": "Tệ"
            },
            {
                "stars": 2,
                "desc": "Bình thường"
            },
            {
                "stars": 3,
                "desc": "Trung bình"
            },
            {
                "stars": 4,
                "desc": "Tốt"
            },
            {
                "stars": 5,
                "desc": "Rất tốt"
            }
        ]
    },
    {
        "id": "giao_vien",
        "title": "Đội ngũ giáo viên",
        "question": "Chất lượng đội ngũ giáo viên dạy tiếng Hàn?",
        "weight": 1,
        "options": [
            {
                "stars": 1,
                "desc": "Nhân sự: Thuê ngoài, thiếu đội ngũ cơ hữu; \r\nKiểm tra: Cảm tính, thiếu chuẩn đầu ra; \r\nĐặc điểm: Ưu tiên lợi nhuận, bỏ bê chất lượng."
            },
            {
                "stars": 2,
                "desc": "Có giáo viên nhưng thiếu ổn định, chất lượng không đồng đều."
            },
            {
                "stars": 3,
                "desc": "Đủ giáo viên để vận hành cơ bản nhưng chưa có chuẩn hóa rõ."
            },
            {
                "stars": 4,
                "desc": "Đội ngũ tương đối đầy đủ, chuyên môn đáp ứng nhu cầu giảng dạy thông thường."
            },
            {
                "stars": 5,
                "desc": "Đội ngũ ổn định, chuyên môn tốt, có quản lý và đánh giá chất lượng định kỳ."
            }
        ]
    },
    {
        "id": "dao_tao",
        "title": "Đào tạo tiếng Hàn",
        "question": "Chất lượng, lộ trình và kết quả đào tạo tiếng Hàn trước bay?",
        "weight": 1,
        "options": [
            {
                "stars": 1,
                "desc": "Lịch khai giảng: Lùi lịch trên 2 lần do không đủ học sinh.\r\n\r\nTOPIK: Không cam kết, chỉ học theo diện visa Top 3.\r\n\r\nGiáo trình: Sử dụng sách lậu, tài liệu không bản quyền.\r\n\r\nKiểm tra: Không kiểm tra hoặc tổ chức kiểm tra theo cảm hứng.\r\n\r\nGiám sát: Không giám sát, không báo cáo kết quả cho phụ huynh.\r\n\r\nPhương pháp: Chỉ dạy hình thức trực tuyến (Online)."
            },
            {
                "stars": 2,
                "desc": "Lịch khai giảng: Lùi lịch tối đa 1 lần để đảm bảo sĩ số.\r\n\r\nTOPIK: Cam kết đạt trình độ sơ cấp căn bản.\r\n\r\nGiáo trình: Sử dụng giáo trình chính hãng, có bản quyền.\r\n\r\nKiểm tra: Tổ chức kiểm tra định kỳ theo lộ trình bài bản.\r\n\r\nGiám sát: Quản lý qua Excel, không đồng bộ, dễ thất lạc dữ liệu.\r\n\r\nPhương pháp: Đào tạo trực tiếp (Offline) tại cơ sở."
            },
            {
                "stars": 3,
                "desc": "Lịch khai giảng: Khai giảng đúng hạn cam kết, bất kể số lượng học viên.\r\n\r\nTOPIK: Đào tạo trung cấp, thi đạt chứng chỉ TOPIK II.\r\n\r\nGiáo trình: Giáo trình chính hãng kết hợp tài liệu bổ trợ riêng.\r\n\r\nKiểm tra: Có ngân hàng đề thi đa dạng và chuẩn hóa.\r\n\r\nGiám sát: Quản lý học viên chuyên nghiệp qua phần mềm hệ thống.\r\n\r\nPhương pháp: Kết hợp linh hoạt giữa hình thức Online và Offline."
            },
            {
                "stars": 4,
                "desc": "Lịch khai giảng: Mở lớp định kỳ hàng tháng, tuyệt đối không dời lịch.\r\n\r\nTOPIK: Thành tích có trên 1.000 học viên đạt chứng chỉ TOPIK.\r\n\r\nGiáo trình: Có giáo trình riêng nhưng chưa chuyên biệt từng kỹ năng.\r\n\r\nKiểm tra: Không đỗ các bài kiểm tra vẫn được phép lên lớp.\r\n\r\nGiám sát: Quản lý qua hệ thống, có cố vấn đánh giá, nhắc nhở.\r\n\r\nPhương pháp: Có hệ thống E-learning chuyên nghiệp phục vụ học tập."
            },
            {
                "stars": 5,
                "desc": "Lịch khai giảng: Mở nhiều lớp cùng trình độ đồng thời để lựa chọn.\r\n\r\nTOPIK: Thành tích vượt trội với trên 10.000 học viên đỗ TOPIK.\r\n\r\nGiáo trình: Giáo trình riêng biệt, chuyên sâu từng kỹ năng Nghe-Nói-Đọc-Viết.\r\n\r\nKiểm tra: Không vượt qua bài kiểm tra bắt buộc phải ở lại lớp.\r\n\r\nGiám sát: Gửi báo cáo kết quả chi tiết cho phụ huynh hàng tuần.\r\n\r\nPhương pháp: Ứng dụng AI chấm bài tự động và tương tác thông minh."
            }
        ]
    },
    {
        "id": "ho_tro",
        "title": "Hỗ trợ tại Hàn Quốc sau bay",
        "question": "Họ cam kết hỗ trợ gì khi bạn sang đến Hàn Quốc?",
        "weight": 1,
        "options": [
            {
                "stars": 1,
                "desc": "Tệ"
            },
            {
                "stars": 2,
                "desc": "Bình thường"
            },
            {
                "stars": 3,
                "desc": "Trung bình"
            },
            {
                "stars": 4,
                "desc": "Tốt"
            },
            {
                "stars": 5,
                "desc": "Rất tốt"
            }
        ]
    },
    {
        "id": "tam_nhin",
        "title": "Tầm nhìn sự nghiệp lâu dài",
        "question": "Họ có định hướng tầm nhìn nghề nghiệp gì cho du học sinh?",
        "weight": 1,
        "options": [
            {
                "stars": 1,
                "desc": "Tệ"
            },
            {
                "stars": 2,
                "desc": "Bình thường"
            },
            {
                "stars": 3,
                "desc": "Trung bình"
            },
            {
                "stars": 4,
                "desc": "Tốt"
            },
            {
                "stars": 5,
                "desc": "Rất tốt"
            }
        ]
    },
    {
        "id": "csvc",
        "title": "Cơ sở vật chất",
        "question": "Cơ sở vật chất giảng dạy và ký túc xá thế nào?",
        "weight": 1,
        "options": [
            {
                "stars": 1,
                "desc": "Lớp học và KTX riêng biệt, cách nhau > 500m. Hoặc\r\nThuê lớp học dùng chung, không có hệ thống ký túc xá."
            },
            {
                "stars": 2,
                "desc": "Tòa nhà chính chủ gồm Lớp học + KTX (Chưa có tiện nghi phục vụ)"
            },
            {
                "stars": 3,
                "desc": "Tòa nhà chính chủ gồm Lớp học + KTX + Full nội thất (Điều hòa, máy giặt, tủ lạnh, lò vi sóng)."
            },
            {
                "stars": 4,
                "desc": "Có sân chơi + Mảng xanh (cây xanh, khuôn viên thư giãn).\r\nCó bếp nấu ăn riêng cho học sinh."
            },
            {
                "stars": 5,
                "desc": "Có tất cả các tiện ích dưới + Thư viện riêng.\r\n+Sân bóng/Khu vận động.\r\nCách công viên + Trung tâm thương mại < 1km."
            }
        ]
    },
    {
        "id": "he_thong_bao_cao",
        "title": "Hệ thống báo cáo định kỳ cho phụ huynh",
        "question": "Phụ huynh có được nhận báo cáo định kỳ không và chi tiết thế nào?",
        "weight": 1,
        "options": [
            {
                "stars": 1,
                "desc": "Không có hệ thống báo\r\n cáo\r\nKhông có báo cáo hoặc \r\nchỉ trao đổi rời rạc\r\nNhận xét chung chung\r\n kiểu “học tốt”, “học không tốt”\r\nCảm tính, thiếu dữ liệu, phụ huynh\r\nkhông nắm được năng lực thật"
            },
            {
                "stars": 2,
                "desc": "Báo cáo cơ bản (điểm số và chuyên cần)\r\nPhiếu điểm giấy hoặc file PDF hàng tháng.\r\nĐiểm chuyên cần, điểm thi giữa kỳ/cuối kỳ\r\nCó số liệu nhưng chưa phân tích sâu, chỉ phản ánh kết quả"
            },
            {
                "stars": 3,
                "desc": "Báo cáo định lượng và minh bạch năng lực\r\nBảng điểm + biểu đồ so sánh với trung bình lớp.\r\nĐánh giá rõ 4 kỹ năng (Nghe – Nói – Đọc – Viết). Thông qua phiếu điểm"
            },
            {
                "stars": 4,
                "desc": "Báo cáo phân tích và theo dõi quá trình học\r\nLMS + báo cáo lỗi sai + theo dõi học tập.\r\n-Phân tích lỗi ngữ pháp/phát âm\r\n-Theo dõi thời gian tự học, mức độ chủ động\r\n-Cập nhật bài tập real-time\r\n-Đi sâu vào quá trình học và thái độ, giúp hiểu “tại sao học sinh chưa tốt” “tại sao điểm số của con mình lại tốt hoặc chưa tốt”"
            },
            {
                "stars": 5,
                "desc": "Báo cáo cá nhân hóa và dự đoán kết quả Heatmap năng lực + phân tích thi thử trên máy.\r\nLộ trình cá nhân hóa (ví dụ: cần tăng 20% kỹ năng nghe, đọc, viết)\r\nPhân tích tốc độ làm bài, kỹ năng thi\r\nDự đoán và tổ chức thi thử TOPIK"
            }
        ]
    }
];
