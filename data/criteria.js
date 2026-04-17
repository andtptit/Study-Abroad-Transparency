// Tự động tạo từ generate_criteria.cjs
export const CRITERIA_FALLBACK = [
    {
        "id": "tuoi_doi",
        "title": "Tuổi đời công ty",
        "question": "Trung tâm này đã hoạt động được bao lâu?",
        "weight": 1,
        "order": 1,
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
        "order": 2,
        "options": [
            {
                "stars": 1,
                "desc": "Giấy phép: Không có, hết hạn hoặc đang bị đình chỉ.\r\nHợp đồng: Không có hợp đồng hoặc hợp đồng không có giá trị lý.\r\nHóa đơn: Hoàn toàn không xuất hóa đơn cho khách.\r\nThuế: Không thực hiện việc kê khai hoặc nộp thuế kinh doanh."
            },
            {
                "stars": 2,
                "desc": "Giấy phép: Giấy phép không đầy đủ hoặc hoạt động sai ngành nghề.\r\nHợp đồng: Nội dung hợp đồng không rõ ràng hoặc sơ sài\r\nHóa đơn: Hoàn toàn không xuất hóa đơn cho khách.\r\nThuế: Không thực hiện việc kê khai hoặc nộp thuế kinh doanh."
            },
            {
                "stars": 3,
                "desc": "Giấy phép: Có giấy phép nhưng thiếu giấy phép đào tạo ngoại ngữ hoặc tư vấn du học\r\nHợp đồng: Chỉ sử dụng các mẫu hợp đồng dân sự cơ bản nhất.\r\nHóa đơn: Chỉ xuất VAT khi học viên yêu cầu.\r\nThuế: Việc kê khai thuế chưa nhất quán hoặc vẫn còn thiếu sót."
            },
            {
                "stars": 4,
                "desc": "Giấy phép: Đầy đủ giấy phép Kinh doanh, Tư vấn du học và Đào tạo ngoại ngữ.\r\nHợp đồng: Có hợp đồng đầy đủ bằng giấy, điều khoản rõ ràng\r\nHóa đơn: Lúc xuất hoá đơn lúc không xuất\r\nThuế: Thực hiện kê khai và nộp thuế tương đối đầy đủ."
            },
            {
                "stars": 5,
                "desc": "Giấy phép: Đầy đủ giấy phép Kinh doanh, Tư vấn du học và Đào tạo ngoại ngữ.\r\nHợp đồng: Sử dụng hợp đồng điện tử để minh bạch với nhà nước\r\nHóa đơn: Xuất hóa đơn điện tử cho 100% giao dịch của học viên.\r\nThuế: Kê khai và thực hiện nộp thuế VAT đầy đủ, đúng hạn."
            }
        ]
    },
    {
        "id": "chi_phi",
        "title": "Minh bạch chi phí",
        "question": "Cách họ báo giá và xử lý các khoản phí liên quan?",
        "weight": 1,
        "order": 3,
        "options": [
            {
                "stars": 1,
                "desc": "Chi phí chính: Hoàn toàn không có bảng giá công khai minh bạch bằng văn bản, báo giá cảm tính tuỳ trường hợp.\r\nChi phí phụ: Không cung cấp bất kỳ chứng từ hay tài liệu tài chính.\r\nCam kết: Không cam kết. Chi phí không kiểm soát, rủi ro tài chính cực kỳ cao."
            },
            {
                "stars": 2,
                "desc": "Chi phí chính: Báo giá một phần, thông tin tư vấn thường xuyên thay đổi.\r\nChi phí phụ: Không có bảng kê, các khoản thu chi mập mờ, hoặc không nhắc tới\r\nCam kết: Không căm kết khiến cho phát sinh nhiều phí muộn, tổng chi phí thực tế tăng mạnh."
            },
            {
                "stars": 3,
                "desc": "Chi phí chính: Cách tính phí không có công thức\r\nChi phí phụ: Chỉ ghi mức ước tính hoặc tính gộp chung.\r\nCam kết: Cam kết bằng lời nói, có khả năng thay đổi nhỏ, khó kiểm soát chính xác."
            },
            {
                "stars": 4,
                "desc": "Chi phí chính: Chỉ công khai các hạng mục chi phí lớn cho học viên, vẫn còn 1 số chi phí không chia sẻ hết.\r\nChi phí phụ: Tách bạch các hạng mục phí chi tiết theo từng giai đoạn.\r\nCam kết: Cam kết bằng tin nhắn tuyệt đối không phát sinh bất kỳ khoản nào khác."
            },
            {
                "stars": 5,
                "desc": "Chi phí chính: Công khai 100% tổng tiền trọn gói ngay từ đầu.\r\nChi phí phụ: Báo luôn từ đầu 100% các chi phí đóng bên ngoài bao gồm dịch vụ, hồ sơ, học phí và phí sinh hoạt cá nhân.\r\nCam kết: Bằng văn bản tuyệt đối không phát sinh bất kỳ khoản nào khác."
            }
        ]
    },
    {
        "id": "moi_quan_he",
        "title": "Mối quan hệ các trường Hàn Quốc",
        "question": "Họ có mối quan hệ trực tiếp với bao nhiêu trường Đại học?",
        "weight": 1,
        "order": 4,
        "options": [
            {
                "stars": 1,
                "desc": "Số lượng trường: Không có bất kỳ trường liên kết trực tiếp nào.\r\nChương trình: Không có chương trình du học chính thống được ủy quyền.\r\nĐặc biệt: Hoàn toàn không có chương trình đặc biệt hay độc quyền."
            },
            {
                "stars": 2,
                "desc": "Số lượng trường: Chỉ có từ 3 đến 5 trường liên kết cơ bản.\r\nChương trình: Số lượng hạn chế, chỉ từ 5 đến 10 chương trình.\r\nĐặc biệt: Hoàn toàn không có chương trình liên kết đặc biệt nào."
            },
            {
                "stars": 3,
                "desc": "Số lượng trường: Thiết lập quan hệ chính thức từ 10 đến 20 trường.\r\nChương trình: Cung cấp dưới 25 chương trình du học các loại.\r\nĐặc biệt: Có từ 1 đến 2 chương trình liên kết bước đầu."
            },
            {
                "stars": 4,
                "desc": "Số lượng trường: Mạng lưới liên kết ổn định từ 20 đến 30 trường.\r\nChương trình: Cung cấp từ 40 đến 50 chương trình học đa dạng.\r\nĐặc biệt: Có từ 2 đến 3 chương trình liên kết đặc thù riêng."
            },
            {
                "stars": 5,
                "desc": "Số lượng trường: Liên kết trực tiếp với trên 30 trường đại học Hàn Quốc.\r\nChương trình: Cung cấp đa dạng trên 50 chương trình du học khác nhau.\r\nĐặc biệt: Sở hữu trên 3 chương trình liên kết độc quyền, đặc biệt."
            }
        ]
    },
    {
        "id": "so_luong_xuat_canh",
        "title": "Số lượng xuất cảnh",
        "question": "Quy mô số lượng học sinh xuất cảnh hàng năm?",
        "weight": 1,
        "order": 5,
        "options": [
            {
                "stars": 1,
                "desc": "Dưới 500 học viên xuất cảnh"
            },
            {
                "stars": 2,
                "desc": "500-1000 học viên xuất cảnh"
            },
            {
                "stars": 3,
                "desc": "1000-2000 học viên xuất cảnh"
            },
            {
                "stars": 4,
                "desc": "2000-3000 học viên xuất cảnh"
            },
            {
                "stars": 5,
                "desc": "Trên 3000 học viên xuất cảnh"
            }
        ]
    },
    {
        "id": "nang_luc_xu_ly",
        "title": "Năng lực xử lý hồ sơ",
        "question": "Đội ngũ chuyên viên xử lý hồ sơ có năng lực thế nào?",
        "weight": 1,
        "order": 6,
        "options": [
            {
                "stars": 1,
                "desc": "Học lực: GPA trên 7.0, số buổi nghỉ dưới 5 buổi.\r\nNăm trống: Tốt nghiệp THPT, trống 1-2 năm, hồ sơ đẹp.\r\nHệ đào tạo: Chỉ nhận học sinh tốt nghiệp THPT chính quy.\r\nNhân thân: Lý lịch sạch, không có yếu tố rủi ro gia đình.\r\nKỹ thuật: Không có khả năng giải trình các lỗi hồ sơ phức tạp."
            },
            {
                "stars": 2,
                "desc": "Học lực: GPA mức 7.0, số buổi nghỉ từ 10-15 buổi.\r\nNăm trống: Trống 2-3 năm, tốt nghiệp THPT chính quy.\r\nHệ đào tạo: Nhận hồ sơ có đầy đủ giấy tờ chứng minh quá trình.\r\nNhân thân: Gia đình có đầy đủ thông tin liên lạc và cư trú.\r\nKỹ thuật: Giải trình được năm trống nếu có đủ HĐLĐ, bảng lương."
            },
            {
                "stars": 3,
                "desc": "Học lực: GPA từ 6.5 - 6.9, số buổi nghỉ trên 15 buổi.\r\nNăm trống: Trống 2-3 năm, tốt nghiệp THPT.\r\nHệ đào tạo: Nhận hồ sơ không có giấy tờ giải trình năm trống.\r\nNhân thân: Xử lý được các ca có lịch sử nhân thân bình thường.\r\nKỹ thuật: Biết cách xây dựng phương án xử lý lỗi hồ sơ nhẹ.\r\nVisa: Khẳng định năng lực xử lý được hồ sơ trung bình yếu."
            },
            {
                "stars": 4,
                "desc": "Học lực: GPA dưới 6.5, số buổi nghỉ trên 15 buổi.\r\nNăm trống: Trống từ 3-5 năm, không có giấy tờ giải trình.\r\nHệ đào tạo: Chấp nhận và xử lý tốt bằng Giáo dục thường xuyên (GDTX).\r\nNhân thân: Xử lý được các lỗi nhẹ về thông tin người thân.\r\nKỹ thuật: Kỹ thuật giải trình sắc bén cho hồ sơ yếu, thiếu hụt.\r\nVisa: Cam kết tỷ lệ đỗ cao cho cả nhóm học sinh yếu."
            },
            {
                "stars": 5,
                "desc": "Học lực: GPA dưới 6.5, số buổi nghỉ trên 30 buổi.\r\nNăm trống: Trống trên 5 năm, không có giấy tờ minh chứng.\r\nHệ đào tạo: Xử lý chuyên sâu bằng GDTX và các ca đặc biệt.\r\nNhân thân: Xử lý được ca bố/mẹ từng BHP hoặc mất liên lạc.\r\nKỹ thuật: Đỉnh cao giải trình, khôi phục hồ sơ kém thành hồ sơ đạt.\r\nVisa: Khẳng định uy tín tuyệt đối, bao đậu những ca khó nhất."
            }
        ]
    },
    {
        "id": "hoc_bong",
        "title": "Học bổng",
        "question": "Họ có khả năng xin học bổng chuyên sâu hay không?",
        "weight": 1,
        "order": 7,
        "options": [
            {
                "stars": 1,
                "desc": "Không có bất kỳ chính sách học bổng nào."
            },
            {
                "stars": 2,
                "desc": "Học bổng nhỏ từ 30 50 triệu đồng trở xuống"
            },
            {
                "stars": 3,
                "desc": "Miễn 100% Invoice 1 kỳ, trị giá từ 60-80 triệu đồng."
            },
            {
                "stars": 4,
                "desc": "Học bổng giá trị cao, thường trên 100 triệu đồng."
            },
            {
                "stars": 5,
                "desc": "Học bổng toàn phần 100%, trị giá tương đương 250 triệu đồng."
            }
        ]
    },
    {
        "id": "bo_may",
        "title": "Bộ máy lãnh đạo",
        "question": "Bộ máy lãnh đạo và quản trị trung tâm quy mô ra sao?",
        "weight": 1,
        "order": 8,
        "options": [
            {
                "stars": 1,
                "desc": "Học vấn & Trình độ: Không có bằng cấp \r\nCông việc & Chức vụ: Chưa từng đảm nhiệm vị trí quản lý trong ngành giáo dục.\r\nKinh nghiệm giáo dục Hàn Quốc: Dưới 2 năm"
            },
            {
                "stars": 2,
                "desc": "Học vấn & Trình độ: Cử nhân tại Việt Nam\r\nCông việc & Chức vụ: Từng làm quản lý nhóm hoặc phòng ban chuyên môn tại các đơn vị giáo dục.\r\nKinh nghiệm giáo dục Hàn Quốc: Từ 3-5 năm"
            },
            {
                "stars": 3,
                "desc": "Học vấn & Trình độ: Cử nhân tại Hàn Quốc\r\nCông việc & Chức vụ: Cán bộ tại các trường đại học, cao đẳng, thpt\r\nKinh nghiệm giáo dục Hàn Quốc: Trên 5-7 năm"
            },
            {
                "stars": 4,
                "desc": "Học vấn & Trình độ: Thạc sĩ\r\nCông việc & Chức vụ: Từng giữ vị trí Trưởng bộ môn hoặc quản lý các trường đại học, cao đẳng, thpt\r\nKinh nghiệm giáo dục Hàn Quốc: Trên 8-10 năm"
            },
            {
                "stars": 5,
                "desc": "Học vấn & Trình độ: Tiến sĩ\r\nCông việc & Chức vụ: Cán bộ cấp cao của các trường đại học cao đẳng thpt\r\nKinh nghiệm & Đối ngoại: Trên 10 năm cố vấn cấp cao, kết nối các tổ chức chính phủ."
            }
        ]
    },
    {
        "id": "giao_vien",
        "title": "Đội ngũ giáo viên",
        "question": "Chất lượng đội ngũ giáo viên dạy tiếng Hàn?",
        "weight": 1,
        "order": 9,
        "options": [
            {
                "stars": 1,
                "desc": "Nhân sự: Phải đi thuê giáo viên bên ngoài, không có đội ngũ cơ hữu.\r\nSư phạm: TOPIK 3 hoặc không có, chủ yếu người lao động về nước.\r\nKiểm tra: Không kiểm tra hoặc tổ chức kiểm tra theo cảm hứng.\r\nSố lượng: Rất ít, không ổn định, thay đổi nhân sự thường xuyên.\r\nChuyên môn: Trình độ không đồng đều, thiếu năng lực giảng dạy thực tế.\r\nĐặc điểm: Hoạt động tự phát, rủi ro về chất lượng giáo viên rất cao."
            },
            {
                "stars": 2,
                "desc": "Nhân sự: Đã có đội ngũ giáo viên cơ hữu tại trung tâm.\r\nSư phạm: 100% giáo viên đạt trình độ TOPIK 4 trở lên.\r\nKiểm tra: Tổ chức kiểm tra năng lực giáo viên định kỳ theo lộ trình.\r\nSố lượng: Đủ vận hành lớp học nhưng tính ổn định chưa cao.\r\nChuyên môn: Có chuyên môn phù hợp nhưng mặt bằng chung chưa đồng đều.\r\nĐặc điểm: Bắt đầu hình thành quy trình tuyển dụng và đánh giá cơ bản."
            },
            {
                "stars": 3,
                "desc": "Nhân sự: Có thêm trợ giảng hoặc cố vấn học tập hỗ trợ lớp.\r\nSư phạm: TOPIK 5-6, một số giáo viên có chứng chỉ sư phạm.\r\nKiểm tra: Có ngân hàng đề kiểm tra năng lực giáo viên chuẩn hóa.\r\nSố lượng: Đội ngũ đầy đủ, đáp ứng tốt mọi cấp độ đào tạo.\r\nChuyên môn: Giáo viên giàu kinh nghiệm, nắm vững lộ trình học - thi.\r\nĐặc điểm: Có sự phối hợp nhịp nhàng giữa giáo viên và học vụ."
            },
            {
                "stars": 4,
                "desc": "Nhân sự: Có giáo viên người Hàn Quốc tham gia giảng dạy trực tiếp.\r\nSư phạm: 100% đội ngũ giáo viên sở hữu chứng chỉ sư phạm chính quy.\r\nKiểm tra: Quy trình dự giờ và đánh giá nội bộ nghiêm ngặt hàng tháng.\r\nSố lượng: Cơ cấu hợp lý, ổn định theo từng mục tiêu đào tạo riêng.\r\nChuyên môn: Có khả năng luyện thi TOPIK và tư vấn du học chuyên sâu.\r\nĐặc điểm: Chất lượng giảng dạy đồng đều, học viên phản hồi rất hài lòng."
            },
            {
                "stars": 5,
                "desc": "Nhân sự: Có nhân viên R&D chuyên nghiên cứu, phát triển sản phẩm đào tạo.\r\nSư phạm: Có chuyên gia phát minh ra các kỹ năng sư phạm mới.\r\nKiểm tra: Thuê chuyên gia về đào tạo và kiểm tra định kỳ 3 tháng/lần.\r\nSố lượng: Đội ngũ tinh nhuệ, là lợi thế cạnh tranh cốt lõi của đơn vị.\r\nChuyên môn: Am hiểu sâu sắc hệ thống dữ liệu học viên để tối ưu dạy.\r\nĐặc điểm: Dẫn dắt thị trường bằng phương pháp dạy sáng tạo và hiệu quả."
            }
        ]
    },
    {
        "id": "dao_tao",
        "title": "Đào tạo tiếng Hàn",
        "question": "Chất lượng, lộ trình và kết quả đào tạo tiếng Hàn trước bay?",
        "weight": 1,
        "order": 10,
        "options": [
            {
                "stars": 1,
                "desc": "Lịch khai giảng: Không có lịch khai giảng cố định\r\nTOPIK: Không cam kết, không nhắc tới\r\nGiáo trình: Sử dụng sách lậu, tài liệu không bản quyền.\r\nKiểm tra: Không kiểm tra hoặc tổ chức kiểm tra theo cảm hứng.\r\nGiám sát: Không báo cáo kết quả cho phụ huynh hoặc trên 1 tháng mới báo cáo.\r\nPhương pháp: Gửi học sinh đi trung tâm học, hoặc chỉ dạy online."
            },
            {
                "stars": 2,
                "desc": "Lịch khai giảng: Lùi lịch khai giảng trên 2 lần\r\nTOPIK: Cam kết đạt trình độ sơ cấp căn bản.\r\nGiáo trình: Sử dụng giáo trình chính hãng, có bản quyền.\r\nKiểm tra: Trên 1 tháng mới kiểm tra\r\nGiám sát: Quản lý qua Excel, không đồng bộ, dễ thất lạc dữ liệu.\r\nPhương pháp: Đào tạo trực tiếp tại cơ sở."
            },
            {
                "stars": 3,
                "desc": "Lịch khai giảng: Lùi lịch tối đa 1 lần để đảm bảo sĩ số.\r\nTOPIK: Có đào tạo lên trung cấp, thi đạt chứng chỉ TOPIK II.\r\nGiáo trình: Sử dụng giáo trình chính hãng, có bản quyền + kết hợp tài liệu bổ trợ riêng.\r\nKiểm tra: Có ngân hàng đề thi đa dạng và chuẩn hóa.\r\nGiám sát: Quản lý học viên chuyên nghiệp qua phần mềm hệ thống.\r\nPhương pháp: Học viên có thể chuyển đổi linh hoạt giữa 2 hình thức online và offline"
            },
            {
                "stars": 4,
                "desc": "Lịch khai giảng: Khai giảng đúng hạn cam kết, bất kể số lượng học viên. \r\nTOPIK: Thành tích có trên 5.000 học viên đạt chứng chỉ TOPIK II\r\nGiáo trình: Có giáo trình riêng nhưng chưa chuyên biệt từng kỹ năng.\r\nKiểm tra: Không đỗ các bài kiểm tra vẫn được phép lên lớp.\r\nGiám sát: Quản lý qua hệ thống, có cố vấn đánh giá, nhắc nhở.\r\nPhương pháp: Có record lại bài giảng cho học sinh xem lại"
            },
            {
                "stars": 5,
                "desc": "Lịch khai giảng: Mở nhiều lớp cùng trình độ đồng thời với các khung giờ khác nhau.\r\nTOPIK: Thành tích có trên 10.000 học viên đỗ TOPIK II\r\nGiáo trình: Giáo trình riêng biệt, chuyên sâu từng kỹ năng Nghe-Nói-Đọc-Viết.\r\nKiểm tra: Không vượt qua bài kiểm tra bắt buộc phải ở lại lớp.\r\nGiám sát: Gửi báo cáo kết quả cho phụ huynh hàng tuần.\r\nPhương pháp: Có hệ thống E-learning bổ trợ cho việc tự học"
            }
        ]
    },
    {
        "id": "hỗ_trợ_tại_hàn_quốc",
        "title": "Hỗ trợ tại Hàn Quốc",
        "question": "Đánh giá về tiêu chí: Hỗ trợ tại Hàn Quốc?",
        "weight": 1,
        "order": 11,
        "options": [
            {
                "stars": 1,
                "desc": "Nhân sự & Kết nối: Cắt đứt hoàn toàn liên lạc ngay sau khi học viên xuất cảnh.\r\n\r\nThủ tục & Đời sống: Đùn đẩy mọi trách nhiệm hỗ trợ cho phía trường học Hàn Quốc.\r\n\r\nCam kết hỗ trợ: Thiếu trách nhiệm, không có bất kỳ cam kết hậu mãi nào."
            },
            {
                "stars": 2,
                "desc": "Nhân sự & Kết nối: Không có nhân sự tại Hàn, chỉ hỗ trợ qua điện thoại từ Việt Nam.\r\n\r\nThủ tục & Đời sống: Học viên phải tự xoay xở phần lớn thủ tục sau nhập cảnh.\r\n\r\nCam kết hỗ trợ: Thông tin hỗ trợ thiếu cập nhật, không có sự kết nối thực tế."
            },
            {
                "stars": 3,
                "desc": "Nhân sự & Kết nối: Có nhân sự đầu mối nhưng không thường trực tại Hàn Quốc.\r\n\r\nThủ tục & Đời sống: Chỉ hỗ trợ đón sân bay và thủ tục nhận phòng ký túc xá.\r\n\r\nCam kết hỗ trợ: Mang tính thụ động, chỉ phản hồi khi học viên chủ động hỏi."
            },
            {
                "stars": 4,
                "desc": "Nhân sự & Kết nối: Giữ liên lạc thường xuyên, kết nối chặt chẽ với hội sinh viên trường.\r\n\r\nThủ tục & Đời sống: Đón sân bay, hỗ trợ đăng ký SIM, thẻ ngân hàng, tìm nhà ở.\r\n\r\nCam kết hỗ trợ: Hỗ trợ ổn định cuộc sống và tư vấn hòa nhập giai đoạn đầu."
            },
            {
                "stars": 5,
                "desc": "Nhân sự & Kết nối: Có văn phòng đại diện hoặc cộng đồng sinh viên lớn mạnh tại Hàn.\r\n\r\nThủ tục & Đời sống: Hỗ trợ 24/7 thủ tục cư trú, gia hạn visa và tìm việc làm.\r\n\r\nCam kết hỗ trợ: Xử lý tức thì các sự cố khẩn cấp về y tế và pháp lý."
            }
        ]
    },
    {
        "id": "tam_nhin",
        "title": "Tầm nhìn sự nghiệp lâu dài",
        "question": "Họ có định hướng tầm nhìn nghề nghiệp gì cho du học sinh?",
        "weight": 1,
        "order": 12,
        "options": [
            {
                "stars": 1,
                "desc": "Triết lý lợi ích: Chỉ quan tâm tiền, quảng cáo sai sự thật để trục lợi.\r\n\r\nTư duy vận hành: Trốn tránh trách nhiệm, \"mang con bỏ chợ\" khi gặp sự cố.\r\n\r\nCam kết tương lai: Làm giả hồ sơ, bằng cấp, bất chấp rủi ro cho học viên"
            },
            {
                "stars": 2,
                "desc": "Triết lý lợi ích: Ưu tiên lợi ích trước mắt, làm đúng pháp luật mức tối thiểu.\r\n\r\nTư duy vận hành: Coi học viên là \"món hàng\", không có kế hoạch phát triển dài hạn.\r\n\r\nCam kết tương lai: Không quan tâm học sinh học gì, chỉ tập trung thu đủ phí."
            },
            {
                "stars": 3,
                "desc": "Triết lý lợi ích: Kinh doanh sòng phẳng: Học viên đi được – Trung tâm có tiền.\r\n\r\nTư duy vận hành: Tư vấn đầy đủ thông tin nhưng mang nặng tính chất bán hàng.\r\n\r\nCam kết tương lai: Đảm bảo hài lòng mức cơ bản, chưa gắn kết tương lai lâu dài."
            },
            {
                "stars": 4,
                "desc": "Triết lý lợi ích: Coi trọng uy tín thương hiệu và đầu tư phát triển nhân sự giỏi.\r\n\r\nTư duy vận hành: Ưu tiên chất lượng phục vụ học viên hơn lợi nhuận hoa hồng.\r\n\r\nCam kết tương lai: Chọn trường, ngành theo khả năng thực tế và hướng nghiệp bài bản"
            },
            {
                "stars": 5,
                "desc": "Triết lý lợi ích: Hài hòa lợi ích Học viên, Nhân sự và Doanh nghiệp cùng phát triển.\r\n\r\nTư duy vận hành: Kinh doanh dựa trên giá trị thực, sống tử tế bằng nghề.\r\n\r\nCam kết tương lai: Biến du học thành bước đệm thay đổi cuộc đời học viên."
            }
        ]
    },
    {
        "id": "csvc",
        "title": "Cơ sở vật chất",
        "question": "Cơ sở vật chất giảng dạy và ký túc xá thế nào?",
        "weight": 1,
        "order": 13,
        "options": [
            {
                "stars": 1,
                "desc": "Quy mô & Vị trí: Thuê lớp học dùng chung, không có hệ thống ký túc.\r\nKhông gian: Môi trường chật hẹp, hoàn toàn không có cây xanh thư giãn."
            },
            {
                "stars": 2,
                "desc": "Quy mô & Vị trí: Có lớp học và KTX riêng, nhưng ở cách nhau trên 500m.\r\nNội thất & Tiện ích: Có điều hoà + máy lạnh \r\nKhông gian: Diện tích vừa đủ, không có không gian sinh hoạt chung."
            },
            {
                "stars": 3,
                "desc": "Quy mô & Vị trí: Có lớp học và KTX riêng, nhưng ở cách nhau trên 500m.\r\nNội thất & Tiện ích: Có điều hoà + máy lạnh + lò vi sóng + máy giặt + tủ lạnh\r\nKhông gian: Quy hoạch gọn gàng nhưng thiếu mảng xanh và sân chơi."
            },
            {
                "stars": 4,
                "desc": "Quy mô & Vị trí: Tòa nhà chính chủ gồm Lớp+KTX, gần công viên cây xanh.\r\nNội thất & Tiện ích: Đầy đủ như 3* nhưng có thêm bếp nấu ăn\r\nKhông gian: Có sân chơi chung và khuôn viên thư giãn thoáng mát."
            },
            {
                "stars": 5,
                "desc": "Quy mô & Vị trí: Tòa nhà chính chủ gồm Lớp+KTX, cách công viên và trung tâm thương mại dưới 1km.\r\nNội thất & Tiện ích: Đầy đủ như 4* và có thêm thư viện\r\nKhông gian: Có sân bóng, khu vận động thể thao và mảng xanh."
            }
        ]
    }
];
