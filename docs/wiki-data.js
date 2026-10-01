// HyperIsland Fishing - Official Wiki Data
const WIKI_DATA = {
  "worlds": [
    {
      "id": 1,
      "name": "Ao Hồ & Đại Dương",
      "subtitle": "Cá Bình Thường & Thần Thoại",
      "priceMultiplier": 1,
      "color": "from-sky-500 to-blue-600",
      "accent": "#38bdf8",
      "description": "Thế giới khởi đầu, nơi tôn vinh những loài cá thực tế từ ao làng quen thuộc đến biển khơi bao la và các thủy quái truyền thuyết cổ xưa."
    },
    {
      "id": 2,
      "name": "Vùng Nước Phóng Xạ",
      "subtitle": "Cá Đột Biến Gen & Năng Lượng Hạt Nhân",
      "priceMultiplier": 3,
      "color": "from-emerald-500 to-teal-600",
      "accent": "#34d399",
      "description": "Môi trường hóa chất độc hại và bức xạ plutonium đã biến đổi sinh vật thành các dị nhân sinh học, mang năng lượng hạt nhân cực mạnh."
    },
    {
      "id": 3,
      "name": "Kỷ Jura Dưới Nước",
      "subtitle": "Cá Khủng Long & Quái Thú Tiền Sử",
      "priceMultiplier": 10,
      "color": "from-amber-500 to-red-600",
      "accent": "#f59e0b",
      "description": "Hành trình ngược thời gian hàng trăm triệu năm về trước, chạm trán các hung thần thời tiền sử và siêu cá mập Megalodon huyền thoại."
    }
  ],
  "tiers": {
    "1": {
      "name": "Phổ Thông",
      "color": "#6E6E78",
      "bg": "rgba(110, 110, 120, 0.15)",
      "border": "rgba(110, 110, 120, 0.35)",
      "rate": "70.0%"
    },
    "2": {
      "name": "Hiếm",
      "color": "#32D74B",
      "bg": "rgba(50, 215, 75, 0.15)",
      "border": "rgba(50, 215, 75, 0.35)",
      "rate": "22.0%"
    },
    "3": {
      "name": "Đặc Sắc",
      "color": "#5AC8FA",
      "bg": "rgba(90, 200, 250, 0.15)",
      "border": "rgba(90, 200, 250, 0.35)",
      "rate": "6.0%"
    },
    "4": {
      "name": "Sử Thi",
      "color": "#BF5AF2",
      "bg": "rgba(191, 90, 242, 0.15)",
      "border": "rgba(191, 90, 242, 0.35)",
      "rate": "1.5%"
    },
    "5": {
      "name": "Huyền Thoại",
      "color": "#FF9F0A",
      "bg": "rgba(255, 159, 10, 0.15)",
      "border": "rgba(255, 159, 10, 0.35)",
      "rate": "0.4%"
    },
    "6": {
      "name": "Thần Thoại",
      "color": "#FF453A",
      "bg": "rgba(255, 69, 58, 0.15)",
      "border": "rgba(255, 69, 58, 0.35)",
      "rate": "0.09%"
    },
    "7": {
      "name": "Boss Độc Tôn",
      "color": "#FFD60A",
      "bg": "rgba(255, 214, 10, 0.18)",
      "border": "rgba(255, 214, 10, 0.45)",
      "rate": "0.01%"
    }
  },
  "fishes": [
    {
      "id": "w1_t1_chep_vang",
      "name": "Cá Chép Vàng",
      "tier": 1,
      "world": 1,
      "basePrice": 10,
      "minSize": 0.5,
      "maxSize": 2.5,
      "description": "Cá nước ngọt phổ biến, vảy vàng óng ánh, tính khí hiền hòa, thích sống ở vùng nước tĩnh."
    },
    {
      "id": "w1_t1_ro_phi",
      "name": "Cá Rô Phi",
      "tier": 1,
      "world": 1,
      "basePrice": 10,
      "minSize": 0.3,
      "maxSize": 1.8,
      "description": "Loài cá thích nghi cao, vây lưng sắc nhọn, thường đi theo đàn nhỏ ven bờ ao hồ đảo."
    },
    {
      "id": "w1_t1_tre_den",
      "name": "Cá Trê Đen",
      "tier": 1,
      "world": 1,
      "basePrice": 10,
      "minSize": 0.8,
      "maxSize": 3.5,
      "description": "Sống ở tầng đáy bùn lầy, râu cảm biến siêu nhạy trong đêm tối, thịt chắc và khỏe."
    },
    {
      "id": "w1_t1_bay_mau",
      "name": "Cá Bảy Màu (Guppy)",
      "tier": 1,
      "world": 1,
      "basePrice": 10,
      "minSize": 0.05,
      "maxSize": 0.2,
      "description": "Loài cá cảnh tí hon rực rỡ sắc màu nhiệt đới, thân hình nhỏ bé bơi lội nhanh thoăn thoắt."
    },
    {
      "id": "w1_t2_loc_nhim",
      "name": "Cá Lóc Nhím",
      "tier": 2,
      "world": 1,
      "basePrice": 50,
      "minSize": 1.5,
      "maxSize": 6,
      "description": "Loài săn mồi hung dữ vùng nước ngọt, vảy gai bảo vệ và hàm răng sắc bén tóm gọn con mồi."
    },
    {
      "id": "w1_t2_hoi_tbd",
      "name": "Cá Hồi Thái Bình Dương",
      "tier": 2,
      "world": 1,
      "basePrice": 50,
      "minSize": 2,
      "maxSize": 9,
      "description": "Loài cá di cư ngược dòng vượt ghềnh thác, cơ bắp cuồn cuộn dẻo dai và giàu năng lượng."
    },
    {
      "id": "w1_t2_thu",
      "name": "Cá Thu",
      "tier": 2,
      "world": 1,
      "basePrice": 50,
      "minSize": 2.5,
      "maxSize": 10,
      "description": "Cá săn mồi biển khơi bơi tốc độ cao, thân thon dài hình ngư lôi xé nước đại dương."
    },
    {
      "id": "w1_t2_ngu_vay_vang",
      "name": "Cá Ngừ Vây Vàng",
      "tier": 2,
      "world": 1,
      "basePrice": 50,
      "minSize": 4,
      "maxSize": 15,
      "description": "Chiến binh đại dương với vây vàng óng ả đặc trưng, bơi không ngừng nghỉ giữa biển mở."
    },
    {
      "id": "w1_t3_kiem",
      "name": "Cá Kiếm",
      "tier": 3,
      "world": 1,
      "basePrice": 250,
      "minSize": 15,
      "maxSize": 75,
      "description": "Sở hữu chiếc mỏ kéo dài như thanh kiếm sắc lẹm, có thể chém rách con mồi khi lao tới với vận tốc lớn."
    },
    {
      "id": "w1_t3_duoi_cham_bi",
      "name": "Cá Đuối Chấm Bi",
      "tier": 3,
      "world": 1,
      "basePrice": 250,
      "minSize": 10,
      "maxSize": 50,
      "description": "Thân dẹt hình cánh cung, hoa văn chấm bi ngụy trang hoàn hảo trên đáy cát ven rạn san hô."
    },
    {
      "id": "w1_t3_chinh_moray",
      "name": "Cá Chình Moray",
      "tier": 3,
      "world": 1,
      "basePrice": 250,
      "minSize": 8,
      "maxSize": 35,
      "description": "Ẩn mình trong các hốc san hô hiểm trở, tung cú đớp bất ngờ với bộ hàm phụ nguy hiểm."
    },
    {
      "id": "w1_t3_nham_cua",
      "name": "Cá Nhám Cưa",
      "tier": 3,
      "world": 1,
      "basePrice": 250,
      "minSize": 12,
      "maxSize": 65,
      "description": "Chiếc mũi kéo dài gắn hàng răng cưa sắc bén đôi bên, vũ khí đào bới và săn mồi cự phách."
    },
    {
      "id": "w1_t4_mat_trang",
      "name": "Cá Mặt Trăng (Sunfish)",
      "tier": 4,
      "world": 1,
      "basePrice": 1500,
      "minSize": 80,
      "maxSize": 450,
      "description": "Loài cá xương nặng nhất thế giới, thân tròn dẹp khổng lồ thích thả mình phơi nắng trên mặt biển."
    },
    {
      "id": "w1_t4_co_xanh",
      "name": "Cá Cờ Xanh",
      "tier": 4,
      "world": 1,
      "basePrice": 1500,
      "minSize": 70,
      "maxSize": 400,
      "description": "Vua tốc độ của biển khơi nhiệt đới, chiếc vây lưng dựng đứng như cánh buồm lướt sóng."
    },
    {
      "id": "w1_t4_map_cao",
      "name": "Cá Mập Cáo",
      "tier": 4,
      "world": 1,
      "basePrice": 1500,
      "minSize": 60,
      "maxSize": 350,
      "description": "Chiếc đuôi dài bằng nửa chiều dài cơ thể, dùng làm roi quất làm choáng đàn cá nhỏ."
    },
    {
      "id": "w1_t4_heo_mui_chai",
      "name": "Cá Heo Mũi Chai",
      "tier": 4,
      "world": 1,
      "basePrice": 1500,
      "minSize": 90,
      "maxSize": 380,
      "description": "Sinh vật thông minh bậc nhất biển cả, sở hữu hệ thống sóng siêu âm định vị cực kỳ chính xác."
    },
    {
      "id": "w1_t5_tam_hoang_gia",
      "name": "Cá Tầm Hoàng Gia (Beluga)",
      "tier": 5,
      "world": 1,
      "basePrice": 10000,
      "minSize": 300,
      "maxSize": 1600,
      "description": "Hóa thạch sống của đại dương, cơ thể bọc xương sụn quý hiếm, nguồn gốc của báu vật trứng cá muối."
    },
    {
      "id": "w1_t5_map_dau_bua",
      "name": "Cá Mập Đầu Búa",
      "tier": 5,
      "world": 1,
      "basePrice": 10000,
      "minSize": 250,
      "maxSize": 1200,
      "description": "Cấu trúc đầu chữ T độc đáo giúp mở rộng tầm nhìn toàn cảnh 360 độ và dò từ trường sinh học nhạy bén."
    },
    {
      "id": "w1_t5_voi_sat_thu",
      "name": "Cá Voi Sát Thủ (Orca)",
      "tier": 5,
      "world": 1,
      "basePrice": 10000,
      "minSize": 600,
      "maxSize": 2400,
      "description": "Kẻ săn mồi đỉnh cao phối hợp bầy đàn hoàn hảo, thông minh, tốc độ và uy lực áp đảo toàn cõi đại dương."
    },
    {
      "id": "w1_t5_duoi_manta",
      "name": "Cá Đuối Manta Khổng Lồ",
      "tier": 5,
      "world": 1,
      "basePrice": 10000,
      "minSize": 400,
      "maxSize": 1800,
      "description": "Lướt êm đềm như cánh chim giữa lòng biển sâu thẳm, người khổng lồ hiền hòa của rạn san hô."
    },
    {
      "id": "w1_t6_map_trang_lon",
      "name": "Cá Mập Trắng Lớn",
      "tier": 6,
      "world": 1,
      "basePrice": 75000,
      "minSize": 1500,
      "maxSize": 6500,
      "description": "Huyền thoại săn mồi đơn độc với khứu giác đánh hơi mùi máu từ hàng dặm xa cùng lực cắn kinh hoàng."
    },
    {
      "id": "w1_t6_voi_xanh",
      "name": "Cá Voi Xanh",
      "tier": 6,
      "world": 1,
      "basePrice": 75000,
      "minSize": 4000,
      "maxSize": 18000,
      "description": "Sinh vật vĩ đại nhất từng tồn tại trên Trái Đất, nhịp tim trầm hùng vang vọng khắp các đại dương."
    },
    {
      "id": "w1_t6_nham_voi",
      "name": "Cá Nhám Voi",
      "tier": 6,
      "world": 1,
      "basePrice": 75000,
      "minSize": 3500,
      "maxSize": 15000,
      "description": "Người khổng lồ hiền lành mang hoa văn đốm sao trời, bơi chậm rãi lọc sinh vật phù du qua mang."
    },
    {
      "id": "w1_t6_ngua_van_bien_sau",
      "name": "Cá Ngựa Vằn Biển Sâu",
      "tier": 6,
      "world": 1,
      "basePrice": 75000,
      "minSize": 1200,
      "maxSize": 5500,
      "description": "Sinh vật kỳ bí nơi biển thẳm tăm tối, hoa văn sọc phát quang huyền ảo dẫn lối trong vực sâu."
    },
    {
      "id": "w1_t7_leviathan",
      "name": "Vua Biển Cả Leviathan",
      "tier": 7,
      "world": 1,
      "basePrice": 500000,
      "isBoss": true,
      "description": "Loài cá voi thần thoại cai quản đại dương, mang vương miện san hô và uy quyền biển sâu ngàn năm.",
      "minSize": 15000,
      "maxSize": 85000
    },
    {
      "id": "w1_t7_kraken",
      "name": "Bạch Tuộc Khổng Lồ Kraken",
      "tier": 7,
      "world": 1,
      "basePrice": 500000,
      "isBoss": true,
      "description": "Bạch tuộc thần bí cổ xưa, có thể vươn xúc tu khổng lồ kéo chìm cả những con tàu buồm kiên cố.",
      "minSize": 12000,
      "maxSize": 70000
    },
    {
      "id": "w1_t7_poseidon_fish",
      "name": "Thần Ngư Poseidon",
      "tier": 7,
      "world": 1,
      "basePrice": 500000,
      "isBoss": true,
      "description": "Mang linh hồn của biển cả, toàn thân bao phủ lớp vảy hoàng kim phát ánh hào quang của thần đại dương.",
      "minSize": 10000,
      "maxSize": 60000
    },
    {
      "id": "w1_t7_hydra_sea",
      "name": "Cửu Đầu Thủy Xà",
      "tier": 7,
      "world": 1,
      "basePrice": 500000,
      "isBoss": true,
      "description": "Sinh vật chín đầu huyền thoại canh giữ rãnh vực sâu nhất đại dương, mỗi chiếc đầu săn một hướng.",
      "minSize": 14000,
      "maxSize": 80000
    },
    {
      "id": "w2_t1_chep_ba_mat",
      "name": "Cá Chép Ba Mắt",
      "tier": 1,
      "world": 2,
      "basePrice": 10,
      "minSize": 0.6,
      "maxSize": 3,
      "description": "Đột biến gen phóng xạ khiến mọc thêm con mắt thứ ba dò bức xạ plutonium trên đỉnh đầu."
    },
    {
      "id": "w2_t1_ro_xuong_kho",
      "name": "Cá Rô Xương Khô",
      "tier": 1,
      "world": 2,
      "basePrice": 10,
      "minSize": 0.4,
      "maxSize": 2,
      "description": "Lớp thịt teo tóp để lộ khung xương trong suốt phát ánh xanh lục lân tinh trong bùn độc."
    },
    {
      "id": "w2_t1_da_quang",
      "name": "Cá Dạ Quang",
      "tier": 1,
      "world": 2,
      "basePrice": 10,
      "minSize": 0.2,
      "maxSize": 1.2,
      "description": "Tự phát ra ánh sáng huỳnh quang xanh ngọc chói lòa trong bóng tối để thu hút sinh vật khác."
    },
    {
      "id": "w2_t1_nong_noc_khong_lo",
      "name": "Cá Nòng Nọc Khổng Lồ",
      "tier": 1,
      "world": 2,
      "basePrice": 10,
      "minSize": 0.8,
      "maxSize": 3.5,
      "description": "Kích thước vượt bậc dị thường do hấp thụ dòng nước thải hóa chất đậm đặc từ nhà máy."
    },
    {
      "id": "w2_t2_map_hai_dau",
      "name": "Cá Mập Hai Đầu",
      "tier": 2,
      "world": 2,
      "basePrice": 50,
      "minSize": 3,
      "maxSize": 14,
      "description": "Đột biến phân tách phôi hạt nhân tạo ra hai chiếc đầu cùng săn mồi độc lập và hung hãn."
    },
    {
      "id": "w2_t2_tre_xuc_tu",
      "name": "Cá Trê Xúc Tu",
      "tier": 2,
      "world": 2,
      "basePrice": 50,
      "minSize": 2.5,
      "maxSize": 11,
      "description": "Bộ râu cá trê đã biến dị thành những xúc tu ngoe nguẩy đầy chất nhầy ăn mòn da thịt."
    },
    {
      "id": "w2_t2_luon_tich_dien_kep",
      "name": "Cá Lươn Tích Điện Kép",
      "tier": 2,
      "world": 2,
      "basePrice": 50,
      "minSize": 2,
      "maxSize": 9,
      "description": "Hai cơ quan phát điện sinh học phóng ra dòng điện cao thế hàng ngàn volt trong nước nhiễm xạ."
    },
    {
      "id": "w2_t2_phoi_nhay_nhua",
      "name": "Cá Phổi Nhầy Nhụa",
      "tier": 2,
      "world": 2,
      "basePrice": 50,
      "minSize": 1.8,
      "maxSize": 8.5,
      "description": "Bao bọc bởi lớp màng gel nhớt bảo vệ nội tạng ngăn axít ăn mòn tế bào bên trong."
    },
    {
      "id": "w2_t3_sua_boc_thep",
      "name": "Cá Sứa Bọc Thép",
      "tier": 3,
      "world": 2,
      "basePrice": 250,
      "minSize": 12,
      "maxSize": 55,
      "description": "Xúc tu sứa kết tinh hợp chất kim loại nặng cứng cáp, mang nọc độc phóng xạ cực mạnh."
    },
    {
      "id": "w2_t3_piranha_rang_cua_sat",
      "name": "Cá Piranha Răng Cưa Sắt",
      "tier": 3,
      "world": 2,
      "basePrice": 250,
      "minSize": 10,
      "maxSize": 45,
      "description": "Hàm răng mọc dài cứng như hợp kim vonfram, có thể cắn thủng cả vỏ tàu ngầm thám hiểm."
    },
    {
      "id": "w2_t3_duoi_tang_hinh",
      "name": "Cá Đuối Tàng Hình",
      "tier": 3,
      "world": 2,
      "basePrice": 250,
      "minSize": 15,
      "maxSize": 60,
      "description": "Lớp biểu bì bẻ cong ánh sáng giúp hòa lẫn vô hình vào làn nước độc sương mù."
    },
    {
      "id": "w2_t3_mut_da_ky_sinh",
      "name": "Cá Mút Đá Ký Sinh",
      "tier": 3,
      "world": 2,
      "basePrice": 250,
      "minSize": 8,
      "maxSize": 40,
      "description": "Miệng giác hút tua tủa gai nhọn bám chặt vào vỏ kim loại và thân quái thú để rút năng lượng."
    },
    {
      "id": "w2_t4_voi_rac_thai",
      "name": "Cá Voi Rác Thải",
      "tier": 4,
      "world": 2,
      "basePrice": 1500,
      "minSize": 90,
      "maxSize": 480,
      "description": "Nuốt chửng hàng tấn phế liệu kim loại và rác thải nguyên tử, biến chúng thành lớp giáp xù xì bọc ngoài."
    },
    {
      "id": "w2_t4_nhen_bien",
      "name": "Cá Nhện Biển",
      "tier": 4,
      "world": 2,
      "basePrice": 1500,
      "minSize": 65,
      "maxSize": 320,
      "description": "Tám chiếc chi dài ngoằng như chân nhện khổng lồ, bò thoăn thoắt trên đáy vực ô nhiễm."
    },
    {
      "id": "w2_t4_ngua_gai_doc",
      "name": "Cá Ngựa Gai Độc",
      "tier": 4,
      "world": 2,
      "basePrice": 1500,
      "minSize": 50,
      "maxSize": 280,
      "description": "Khắp cơ thể mọc đầy gai nhọn chứa chất độc phóng xạ cô đặc, gây hoại tử tế bào tức thì."
    },
    {
      "id": "w2_t4_hoi_buc_xa_do",
      "name": "Cá Hồi Bức Xạ Đỏ",
      "tier": 4,
      "world": 2,
      "basePrice": 1500,
      "minSize": 55,
      "maxSize": 310,
      "description": "Thịt chuyển sang màu đỏ rực rỡ và tỏa nhiệt lượng cao do hấp thụ đồng vị phóng xạ uranium."
    },
    {
      "id": "w2_t5_map_zombie",
      "name": "Cá Mập Zombie",
      "tier": 5,
      "world": 2,
      "basePrice": 10000,
      "minSize": 320,
      "maxSize": 1500,
      "description": "Mô cơ nửa sống nửa hoại tử, không hề biết đau đớn, săn đuổi con mồi bằng bản năng cuồng loạn."
    },
    {
      "id": "w2_t5_may_sinh_hoc",
      "name": "Cá Máy Sinh Học (Cyborg Fish)",
      "tier": 5,
      "world": 2,
      "basePrice": 10000,
      "minSize": 400,
      "maxSize": 1700,
      "description": "Sự kết hợp kỳ dị giữa mô sinh học biến dị và vi mạch nano tự lắp ghép dưới đáy biển sâu."
    },
    {
      "id": "w2_t5_mat_quy_dung_nham",
      "name": "Cá Mặt Quỷ Dung Nham",
      "tier": 5,
      "world": 2,
      "basePrice": 10000,
      "minSize": 350,
      "maxSize": 1600,
      "description": "Thích nghi hoàn hảo với nhiệt độ sôi của miệng núi lửa ngầm, vảy đá bazan nóng đỏ rực."
    },
    {
      "id": "w2_t5_muc_ong_phun_axit",
      "name": "Mực Ống Phun Axit",
      "tier": 5,
      "world": 2,
      "basePrice": 10000,
      "minSize": 280,
      "maxSize": 1300,
      "description": "Túi mực chuyển hóa thành axít clohydric đậm đặc, hòa tan mọi kim loại và vỏ bảo hộ."
    },
    {
      "id": "w2_t6_quai_vat_dam_lay",
      "name": "Quái Vật Đầm Lầy (Swamp Thing)",
      "tier": 6,
      "world": 2,
      "basePrice": 75000,
      "minSize": 1800,
      "maxSize": 7500,
      "description": "Khối sinh khối rêu tảo phóng xạ kết tụ lại thành hình hài quái thú rình rập dưới đáy đầm lầy."
    },
    {
      "id": "w2_t6_rong_dot_bien_gen",
      "name": "Cá Rồng Đột Biến Gen",
      "tier": 6,
      "world": 2,
      "basePrice": 75000,
      "minSize": 2200,
      "maxSize": 9000,
      "description": "Rồng biển uốn lượn mang hào quang tím độc tố bao quanh, phát ra sóng âm làm biến đổi tế bào."
    },
    {
      "id": "w2_t6_tuoc_phong_xa_khong_lo",
      "name": "Tuộc Phóng Xạ Khổng Lồ",
      "tier": 6,
      "world": 2,
      "basePrice": 75000,
      "minSize": 3000,
      "maxSize": 14000,
      "description": "Hàng trăm xúc tu phát ra xung điện từ EMP cực mạnh làm tê liệt toàn bộ thiết bị điện tử."
    },
    {
      "id": "w2_t6_thuy_quai_lo_phan_ung",
      "name": "Thủy Quái Lò Phản Ứng",
      "tier": 6,
      "world": 2,
      "basePrice": 75000,
      "minSize": 4000,
      "maxSize": 16000,
      "description": "Sinh ra ngay tại tâm rò rỉ hạt nhân, thân thể phát xạ ánh sáng chói lòa tựa như một lò phản ứng di động."
    },
    {
      "id": "w2_t7_gojira_fish",
      "name": "Bạo Chúa Hạt Nhân Gojira-Fish",
      "tier": 7,
      "world": 2,
      "basePrice": 500000,
      "isBoss": true,
      "description": "Sinh vật lai giữa cá mập và bạo long, mang năng lượng nguyên tử rực sáng trên các phiến vây lưng.",
      "minSize": 20000,
      "maxSize": 95000
    },
    {
      "id": "w2_t7_chornobyl_behemoth",
      "name": "Quái Thú Chornobyl",
      "tier": 7,
      "world": 2,
      "basePrice": 500000,
      "isBoss": true,
      "description": "Sinh vật khổng lồ hấp thụ tia gamma cực mạnh từ thảm họa thế kỷ, cơ bắp cuồn cuộn không thể bị phá hủy.",
      "minSize": 18000,
      "maxSize": 88000
    },
    {
      "id": "w2_t7_plasma_colossus",
      "name": "Khổng Lồ Plasma Biển Độc",
      "tier": 7,
      "world": 2,
      "basePrice": 500000,
      "isBoss": true,
      "description": "Thân hình bao phủ bởi lớp plasma nhiệt hạch nóng chảy và ion hóa cực độ, thiêu đốt mọi thứ chạm vào.",
      "minSize": 16000,
      "maxSize": 78000
    },
    {
      "id": "w2_t7_abyssal_plutonium",
      "name": "Bóng Ma Plutonium Vực Thẳm",
      "tier": 7,
      "world": 2,
      "basePrice": 500000,
      "isBoss": true,
      "description": "Ẩn mình nơi rãnh biển sâu bị chôn lấp chất thải hạt nhân đậm đặc, toát ra tử khí hủy diệt sự sống.",
      "minSize": 15000,
      "maxSize": 75000
    },
    {
      "id": "w3_t1_bo_ba_thuy",
      "name": "Cá Bọ Ba Thùy (Trilobite)",
      "tier": 1,
      "world": 3,
      "basePrice": 10,
      "minSize": 0.3,
      "maxSize": 1.5,
      "description": "Sinh vật chân khớp cổ xưa bò dưới đáy biển Kỷ Cambri hàng trăm triệu năm trước, dấu ấn đầu tiên của sự sống phức tạp."
    },
    {
      "id": "w3_t1_hoa_thach_song",
      "name": "Cá Hóa Thạch Sống (Coelacanth)",
      "tier": 1,
      "world": 3,
      "basePrice": 10,
      "minSize": 0.8,
      "maxSize": 4,
      "description": "Loài cá vây tay cổ đại ngỡ như đã tuyệt chủng cùng thời khủng long, chứng tích sống động của tiến hóa."
    },
    {
      "id": "w3_t1_giap_co_nho",
      "name": "Cá Giáp Cổ Nhỏ",
      "tier": 1,
      "world": 3,
      "basePrice": 10,
      "minSize": 0.5,
      "maxSize": 2.5,
      "description": "Lớp giáp xương cứng cáp che chắn phần đầu khỏi những kẻ săn mồi nguyên thủy thời Kỷ Silur."
    },
    {
      "id": "w3_t1_nguyen_thuy",
      "name": "Cá Nguyên Thủy",
      "tier": 1,
      "world": 3,
      "basePrice": 10,
      "minSize": 0.4,
      "maxSize": 2,
      "description": "Tổ tiên xa xưa của các loài cá hiện đại với cấu trúc xương sống thô sơ và thị giác nguyên thủy."
    },
    {
      "id": "w3_t2_nham_gai_co_dai",
      "name": "Cá Nhám Gai Cổ Đại (Stethacanthus)",
      "tier": 2,
      "world": 3,
      "basePrice": 50,
      "minSize": 2.5,
      "maxSize": 12,
      "description": "Cá mập cổ đại mang chiếc gai nhọn hình đe kỳ lạ trên lưng, vũ khí phòng thủ và thu hút bạn tình."
    },
    {
      "id": "w3_t2_duoi_rang_cua",
      "name": "Cá Đuối Răng Cưa (Onchopristis)",
      "tier": 2,
      "world": 3,
      "basePrice": 50,
      "minSize": 3.5,
      "maxSize": 15,
      "description": "Mõm dài gắn hàng gai nhọn như lưỡi cưa đôi, dùng để chém quét và đào bới con mồi trong bùn cổ sinh."
    },
    {
      "id": "w3_t2_phoi_khong_lo",
      "name": "Cá Phổi Khổng Lồ",
      "tier": 2,
      "world": 3,
      "basePrice": 50,
      "minSize": 2,
      "maxSize": 10,
      "description": "Có khả năng thở bằng phổi nguyên thủy và ngủ vùi nhiều năm trong bùn khô cạn thời tiền sử."
    },
    {
      "id": "w3_t2_rong_co_dai",
      "name": "Cá Rồng Cổ Đại",
      "tier": 2,
      "world": 3,
      "basePrice": 50,
      "minSize": 3,
      "maxSize": 13,
      "description": "Vảy dày như tấm khiên đồng, thân dài linh hoạt uốn lượn luồn lách giữa các rạn đá cổ xưa."
    },
    {
      "id": "w3_t3_map_rang_xoan",
      "name": "Cá Mập Răng Xoắn (Helicoprion)",
      "tier": 3,
      "world": 3,
      "basePrice": 250,
      "minSize": 15,
      "maxSize": 70,
      "description": "Vòm xoắn ốc răng kỳ lạ ở hàm dưới cuộn tròn như lưỡi cưa đĩa tròn, xé nát con mồi vỏ cứng."
    },
    {
      "id": "w3_t3_dunkleosteus_non",
      "name": "Cá Bọc Thép Dunkleosteus (con non)",
      "tier": 3,
      "world": 3,
      "basePrice": 250,
      "minSize": 12,
      "maxSize": 55,
      "description": "Cá bọc thép Kỷ Devon giai đoạn sơ sinh nhưng đã sở hữu những tấm giáp đầu cứng cáp và hàm cắt sắc bén."
    },
    {
      "id": "w3_t3_rang_kiem",
      "name": "Cá Răng Kiếm (Enchodus)",
      "tier": 3,
      "world": 3,
      "basePrice": 250,
      "minSize": 10,
      "maxSize": 50,
      "description": "Hàm răng nanh dài nhọn nhô ra ngoài như cặp kiếm của hổ răng kiếm, chuyên săn cá nhỏ tốc độ cao."
    },
    {
      "id": "w3_t3_muc_vo_sung",
      "name": "Mực Vỏ Sừng (Ammonite)",
      "tier": 3,
      "world": 3,
      "basePrice": 250,
      "minSize": 8,
      "maxSize": 42,
      "description": "Thân hình xoắn ốc tuyệt mỹ trôi nổi bồng bềnh bằng các khoang khí điều chỉnh độ sâu hoàn hảo."
    },
    {
      "id": "w3_t4_ran_bien_co_dai",
      "name": "Rắn Biển Cổ Đại (Plesiosaur)",
      "tier": 4,
      "world": 3,
      "basePrice": 1500,
      "minSize": 80,
      "maxSize": 420,
      "description": "Chiếc cổ dài ngoằng linh hoạt giúp bất ngờ luồn lách bắt cá trong các rạn san hô tiền sử hiểm trở."
    },
    {
      "id": "w3_t4_map_cho_san",
      "name": "Cá Mập Chó Săn (Cretoxyrhina)",
      "tier": 4,
      "world": 3,
      "basePrice": 1500,
      "minSize": 75,
      "maxSize": 380,
      "description": "Kẻ săn mồi hung hãn thời Phấn Trắng với tốc độ bơi vượt trội, chuyên săn lùng các loài thằn lằn biển."
    },
    {
      "id": "w3_t4_vay_co_tien_su",
      "name": "Cá Vây Cờ Tiền Sử",
      "tier": 4,
      "world": 3,
      "basePrice": 1500,
      "minSize": 60,
      "maxSize": 320,
      "description": "Chiếc vây lưng xòe rộng như cánh buồm tạo lực đẩy xé nước mạnh mẽ giữa các đại dương cổ đại."
    },
    {
      "id": "w3_t4_sau_bien_co_dai",
      "name": "Cá Sấu Biển Cổ Đại (Dakosaurus)",
      "tier": 4,
      "world": 3,
      "basePrice": 1500,
      "minSize": 95,
      "maxSize": 460,
      "description": "Cá sấu cổ đại thích nghi hoàn toàn với biển mở, bốn chi tiến hóa thành mái chèo uy lực và đuôi bơi khỏe khoắn."
    },
    {
      "id": "w3_t5_ngu_long",
      "name": "Ngư Long (Ichthyosaur)",
      "tier": 5,
      "world": 3,
      "basePrice": 10000,
      "minSize": 350,
      "maxSize": 1800,
      "description": "Bò sát biển tiến hóa hình dạng ngư lôi tương tự cá heo, sở hữu đôi mắt to khổng lồ nhìn xuyên bóng tối sâu thẳm."
    },
    {
      "id": "w3_t5_than_lan_bien",
      "name": "Thằn Lằn Biển (Cymbospondylus)",
      "tier": 5,
      "world": 3,
      "basePrice": 10000,
      "minSize": 450,
      "maxSize": 2100,
      "description": "Thân dài ngoằng uốn khúc như trăn biển khổng lồ, kẻ rình mồi đáng sợ của vùng nước nông tiền sử."
    },
    {
      "id": "w3_t5_thuy_quai_co_dai",
      "name": "Thủy Quái Cổ Dài (Elasmosaurus)",
      "tier": 5,
      "world": 3,
      "basePrice": 10000,
      "minSize": 500,
      "maxSize": 2500,
      "description": "Chiếc cổ dài hơn một nửa chiều dài toàn thân, thoắt ẩn thoắt hiện săn lùng các đàn cá cổ đại."
    },
    {
      "id": "w3_t5_quai_ngu_xiphactinus",
      "name": "Quái Ngư Xiphactinus",
      "tier": 5,
      "world": 3,
      "basePrice": 10000,
      "minSize": 320,
      "maxSize": 1600,
      "description": "Cá săn mồi khổng lồ phàm ăn, có thể nuốt chửng trọn vẹn những con mồi to gần bằng nửa cơ thể mình."
    },
    {
      "id": "w3_t6_dunkleosteus_truong_thanh",
      "name": "Quái Vật Bọc Thép Dunkleosteus (trưởng thành)",
      "tier": 6,
      "world": 3,
      "basePrice": 75000,
      "minSize": 2500,
      "maxSize": 9500,
      "description": "Cỗ máy nghiền nát thời Kỷ Devon với lực cắn khủng khiếp hàng đầu lịch sử cổ sinh vật, nghiền vụn mọi bộ giáp."
    },
    {
      "id": "w3_t6_kronosaurus",
      "name": "Vua Biển Thẳm Kronosaurus",
      "tier": 6,
      "world": 3,
      "basePrice": 75000,
      "minSize": 3500,
      "maxSize": 15000,
      "description": "Sát thủ cổ ngắn với hộp sọ dài 3 mét mang những chiếc răng hình nón sắc nhọn, chuyên săn các loài bò sát biển khác."
    },
    {
      "id": "w3_t6_sieu_muc_tusoteuthis",
      "name": "Siêu Mực Tusoteuthis",
      "tier": 6,
      "world": 3,
      "basePrice": 75000,
      "minSize": 2800,
      "maxSize": 12000,
      "description": "Loài mực khổng lồ tiền sử dài hơn chục mét, có thể siết chặt và hạ gục cả những con khủng long nhỏ."
    },
    {
      "id": "w3_t6_mosasaurus",
      "name": "Khủng Long Biển Mosasaurus",
      "tier": 6,
      "world": 3,
      "basePrice": 75000,
      "minSize": 4500,
      "maxSize": 18000,
      "description": "Bạo chúa biển cả thời Phấn Trắng, kẻ thống trị chuỗi thức ăn đại dương cổ đại với hàm răng kép hung bạo."
    },
    {
      "id": "w3_t7_megalodon",
      "name": "Hủy Diệt Cổ Đại - Siêu Cá Mập Megalodon",
      "tier": 7,
      "world": 3,
      "basePrice": 500000,
      "isBoss": true,
      "description": "Chúa tể săn mồi đáng sợ nhất lịch sử Trái Đất với hàm răng nuốt trọn xe hơi và lực cắn lên tới 18 tấn.",
      "minSize": 22000,
      "maxSize": 100000
    },
    {
      "id": "w3_t7_basilosaurus",
      "name": "Vua Cá Voi Tiền Sử Basilosaurus",
      "tier": 7,
      "world": 3,
      "basePrice": 500000,
      "isBoss": true,
      "description": "Tổ tiên hung dữ của loài cá voi hiện đại, thân hình dài ngoằng uốn lượn như rắn biển thần thoại.",
      "minSize": 20000,
      "maxSize": 90000
    },
    {
      "id": "w3_t7_liopleurodon",
      "name": "Bò Sát Biển Khổng Lồ Liopleurodon",
      "tier": 7,
      "world": 3,
      "basePrice": 500000,
      "isBoss": true,
      "description": "Bò sát biển khổng lồ với giác quan ngửi mùi con mồi từ hàng dặm xa cùng 4 mái chèo tạo lực gia tốc kinh hoàng.",
      "minSize": 18000,
      "maxSize": 85000
    },
    {
      "id": "w3_t7_shastasaurus",
      "name": "Ngư Long Vĩ Đại Shastasaurus",
      "tier": 7,
      "world": 3,
      "basePrice": 500000,
      "isBoss": true,
      "description": "Ngư long vĩ đại lớn nhất từng tồn tại với chiều dài vượt xa cá voi xanh, biểu tượng tối thượng của Kỷ Jura.",
      "minSize": 25000,
      "maxSize": 110000
    }
  ],
  "rods": [
    {
      "id": "rod_bamboo",
      "name": "Cần Tre Làng",
      "priceGold": 0,
      "priceDiamond": 0,
      "speed": "0.50 giây/lượt",
      "buff": "Cần câu mặc định khởi đầu",
      "desc": "Chế tác từ tre già làng quê mộc mạc, phù hợp câu cá giải trí tại World 1."
    },
    {
      "id": "rod_carbon",
      "name": "Cần Sợi Carbon Tối Thượng",
      "priceGold": 50000,
      "priceDiamond": 0,
      "speed": "0.50 giây/lượt",
      "buff": "×3 Giá bán mọi cá tại World 1 (+200%)",
      "desc": "Trọng lượng siêu nhẹ từ sợi carbon đàn hồi cực đỉnh, tăng đột biến nguồn tiền đầu game."
    },
    {
      "id": "rod_anti_radiation",
      "name": "Cần Hợp Kim Chống Bức Xạ",
      "priceGold": 500000,
      "priceDiamond": 50,
      "speed": "0.50 giây/lượt",
      "buff": "Mở khóa World 2 • +50% tỉ lệ cá Tier 4-6",
      "desc": "Bọc chì và hợp kim chống suy giảm tế bào. Trang bị bắt buộc để tiến vào Vùng Nước Phóng Xạ."
    },
    {
      "id": "rod_nuclear",
      "name": "Cần Cơ Khí Năng Lượng Hạt Nhân",
      "priceGold": 2000000,
      "priceDiamond": 200,
      "speed": "0.50 giây/lượt",
      "buff": "×6 Giá bán cá tại World 2 (+500%)",
      "desc": "Trục quay titanium tích hợp lò vi phản ứng hạt nhân, tối ưu hóa cày vàng ở World 2."
    },
    {
      "id": "rod_dinosaur_bone",
      "name": "Cần Câu Xương Khủng Long",
      "priceGold": 10000000,
      "priceDiamond": 1000,
      "speed": "0.50 giây/lượt",
      "buff": "Mở khóa World 3 • +50% tỉ lệ cá Tier 5+",
      "desc": "Mài giũa từ hóa thạch xương sống T-Rex khổng lồ. Chìa khóa duy nhất để bước chân vào Kỷ Jura."
    },
    {
      "id": "rod_cosmic",
      "name": "Cần Thần Khí Không Gian (Cosmic)",
      "priceGold": 100000000,
      "priceDiamond": 10000,
      "speed": "0.25 giây/lượt (Tăng tốc gấp đôi!)",
      "buff": "×3 Toàn bộ doanh thu • Tốc độ câu 0.25s",
      "desc": "Vũ khí tối thượng bẻ cong không thời gian. Kéo cá thần tốc và biến bạn thành tỷ phú vũ trụ."
    }
  ],
  "baits": [
    {
      "id": "bait_corn",
      "name": "Mồi Bột Ngô Tẩm Hương",
      "target": "Thích hợp: Mọi thế giới",
      "effect": "Giảm 10% cá Tier 1, dồn đều +5% cho Tier 2 và +5% cho Tier 3.",
      "price": "100 Vàng / 1.000 mồi • 1.000 Vàng / 10.000 mồi",
      "color": "amber"
    },
    {
      "id": "bait_glow_blood",
      "name": "Mồi Máu Dạ Quang",
      "target": "Thích hợp: World 2 (Vùng Phóng Xạ)",
      "effect": "Nhân đôi (×2) tỉ lệ cắn câu của cá Sử Thi Tier 4 và Huyền Thoại Tier 5.",
      "price": "500 Vàng / 1.000 mồi • 5.000 Vàng / 10.000 mồi",
      "color": "emerald"
    },
    {
      "id": "bait_amber_fossil",
      "name": "Mồi Hóa Thạch Hổ Phách",
      "target": "Thích hợp: World 3 (Kỷ Jura)",
      "effect": "Chiết xuất ADN thời tiền sử, tăng 50% cơ hội gặp cá Khủng Long Tier 5 trở lên.",
      "price": "2.000 Vàng / 1.000 mồi • 20.000 Vàng / 10.000 mồi",
      "color": "orange"
    },
    {
      "id": "bait_mystic_gold",
      "name": "Mồi Phù Thủy Hoàng Kim",
      "target": "Thích hợp: Săn cá Thần Thoại Tier 6",
      "effect": "Tăng 300% (×4) tỉ lệ xuất hiện của cá Thần Thoại Tier 6 trên mọi thế giới!",
      "price": "10.000 Vàng / 1.000 mồi • 100 Kim Cương",
      "color": "yellow"
    },
    {
      "id": "bait_boss_awakening",
      "name": "Mồi Thức Tỉnh Boss (Vô Cực)",
      "target": "Thích hợp: Săn Boss Tier 7 (Kraken, Gojira, Megalodon)",
      "effect": "Tăng gấp 10 lần (×10) tỉ lệ triệu hồi Boss Tier 7 Divine độc nhất vô nhị!",
      "price": "50.000 Vàng / 1.000 mồi • 500 Kim Cương",
      "color": "rose"
    }
  ],
  "mutations": [
    {
      "type": "normal",
      "name": "Nguyên Bản",
      "mult": "x1.0",
      "color": "#94a3b8",
      "desc": "Cá chuẩn sinh thái tự nhiên, kích thước và màu sắc nguyên bản."
    },
    {
      "type": "glow",
      "name": "Phát Quang (Neon)",
      "mult": "x1.5",
      "color": "#38bdf8",
      "desc": "Vảy cá tự phát ánh sáng lân tinh trong bóng tối, tăng 50% giá trị bán."
    },
    {
      "type": "cyber",
      "name": "Cơ Khí Sinh Học",
      "mult": "x2.5",
      "color": "#c084fc",
      "desc": "Cấy ghép chip điều khiển và hợp kim nano vào cơ thể, bán được giá gấp 2.5 lần."
    },
    {
      "type": "giant",
      "name": "Đột Biến Khổng Lồ",
      "mult": "x5.0",
      "color": "#fbbf24",
      "desc": "Gen tăng trưởng đột biến khiến kích thước cá vượt ngưỡng tối đa, tăng gấp 5 lần giá bán."
    },
    {
      "type": "nuclear",
      "name": "Lõi Hạt Nhân Siêu Phàm",
      "mult": "x10.0",
      "color": "#f43f5e",
      "desc": "Hấp thụ năng lượng hạt nhân thuần khiết, phát quang rực rỡ, bán được giá gấp 10 lần!"
    }
  ]
};

if (typeof window !== 'undefined') {
  window.WIKI_DATA = WIKI_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WIKI_DATA };
}
