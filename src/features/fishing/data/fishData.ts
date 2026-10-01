import type { Fish, FishTier, WorldId } from '../../../types/fishing';

export interface WorldInfo {
  id: WorldId;
  name: string;
  subtitle: string;
  priceMultiplier: number;
  description: string;
}

export const WORLDS_INFO: Record<WorldId, WorldInfo> = {
  1: {
    id: 1,
    name: 'Ao Hồ Đại Dương',
    subtitle: 'Cá Bình Thường',
    priceMultiplier: 1,
    description: 'Thế giới bắt đầu, nơi vinh danh những loài cá thực tế từ ao làng đến biển khơi.',
  },
  2: {
    id: 2,
    name: 'Vùng Nước Phóng Xạ',
    subtitle: 'Cá Đột Biến',
    priceMultiplier: 3,
    description: 'Môi trường ô nhiễm và hóa chất đã biến đổi sinh vật nơi đây thành những cỗ máy sinh học đáng sợ.',
  },
  3: {
    id: 3,
    name: 'Kỷ Jura Dưới Nước',
    subtitle: 'Cá Khủng Long / Tiền Sử',
    priceMultiplier: 10,
    description: 'Xuyên không về quá khứ hàng trăm triệu năm trước, đối đầu với những hung thần đại dương thời tiền sử.',
  },
};

export const ALL_FISH: Fish[] = [
  // ──────────────────────────────────────────────
  // WORLD 1: AO HỒ ĐẠI DƯƠNG
  // ──────────────────────────────────────────────
  // Tier 1
  { id: 'w1_t1_chep_vang', name: 'Cá Chép Vàng', tier: 1, world: 1, basePrice: 10, minSize: 0.5, maxSize: 2.5 },
  { id: 'w1_t1_ro_phi', name: 'Cá Rô Phi', tier: 1, world: 1, basePrice: 10, minSize: 0.3, maxSize: 1.8 },
  { id: 'w1_t1_tre_den', name: 'Cá Trê Đen', tier: 1, world: 1, basePrice: 10, minSize: 0.8, maxSize: 3.5 },
  { id: 'w1_t1_bay_mau', name: 'Cá Bảy Màu (Guppy)', tier: 1, world: 1, basePrice: 10, minSize: 0.05, maxSize: 0.2 },

  // Tier 2
  { id: 'w1_t2_loc_nhim', name: 'Cá Lóc Nhím', tier: 2, world: 1, basePrice: 50, minSize: 1.5, maxSize: 6.0 },
  { id: 'w1_t2_hoi_tbd', name: 'Cá Hồi Thái Bình Dương', tier: 2, world: 1, basePrice: 50, minSize: 2.0, maxSize: 9.0 },
  { id: 'w1_t2_thu', name: 'Cá Thu', tier: 2, world: 1, basePrice: 50, minSize: 2.5, maxSize: 10.0 },
  { id: 'w1_t2_ngu_vay_vang', name: 'Cá Ngừ Vây Vàng', tier: 2, world: 1, basePrice: 50, minSize: 4.0, maxSize: 15.0 },

  // Tier 3
  { id: 'w1_t3_kiem', name: 'Cá Kiếm', tier: 3, world: 1, basePrice: 250, minSize: 15.0, maxSize: 75.0 },
  { id: 'w1_t3_duoi_cham_bi', name: 'Cá Đuối Chấm Bi', tier: 3, world: 1, basePrice: 250, minSize: 10.0, maxSize: 50.0 },
  { id: 'w1_t3_chinh_moray', name: 'Cá Chình Moray', tier: 3, world: 1, basePrice: 250, minSize: 8.0, maxSize: 35.0 },
  { id: 'w1_t3_nham_cua', name: 'Cá Nhám Cưa', tier: 3, world: 1, basePrice: 250, minSize: 12.0, maxSize: 65.0 },

  // Tier 4
  { id: 'w1_t4_mat_trang', name: 'Cá Mặt Trăng (Sunfish)', tier: 4, world: 1, basePrice: 1500, minSize: 80.0, maxSize: 450.0 },
  { id: 'w1_t4_co_xanh', name: 'Cá Cờ Xanh', tier: 4, world: 1, basePrice: 1500, minSize: 70.0, maxSize: 400.0 },
  { id: 'w1_t4_map_cao', name: 'Cá Mập Cáo', tier: 4, world: 1, basePrice: 1500, minSize: 60.0, maxSize: 350.0 },
  { id: 'w1_t4_heo_mui_chai', name: 'Cá Heo Mũi Chai', tier: 4, world: 1, basePrice: 1500, minSize: 90.0, maxSize: 380.0 },

  // Tier 5
  { id: 'w1_t5_tam_hoang_gia', name: 'Cá Tầm Hoàng Gia (Beluga)', tier: 5, world: 1, basePrice: 10000, minSize: 300, maxSize: 1600 },
  { id: 'w1_t5_map_dau_bua', name: 'Cá Mập Đầu Búa', tier: 5, world: 1, basePrice: 10000, minSize: 250, maxSize: 1200 },
  { id: 'w1_t5_voi_sat_thu', name: 'Cá Voi Sát Thủ (Orca)', tier: 5, world: 1, basePrice: 10000, minSize: 600, maxSize: 2400 },
  { id: 'w1_t5_duoi_manta', name: 'Cá Đuối Manta Khổng Lồ', tier: 5, world: 1, basePrice: 10000, minSize: 400, maxSize: 1800 },

  // Tier 6
  { id: 'w1_t6_map_trang_lon', name: 'Cá Mập Trắng Lớn', tier: 6, world: 1, basePrice: 75000, minSize: 1500, maxSize: 6500 },
  { id: 'w1_t6_voi_xanh', name: 'Cá Voi Xanh', tier: 6, world: 1, basePrice: 75000, minSize: 4000, maxSize: 18000 },
  { id: 'w1_t6_nham_voi', name: 'Cá Nhám Voi', tier: 6, world: 1, basePrice: 75000, minSize: 3500, maxSize: 15000 },
  { id: 'w1_t6_ngua_van_bien_sau', name: 'Cá Ngựa Vằn Biển Sâu', tier: 6, world: 1, basePrice: 75000, minSize: 1200, maxSize: 5500 },

  // Tier 7 (Boss)
  {
    id: 'w1_t7_leviathan',
    name: 'Vua Biển Cả Leviathan',
    tier: 7,
    world: 1,
    basePrice: 500000,
    isBoss: true,
    description: 'Loài cá voi thần thoại cai quản đại dương, mang vương miện san hô.',
    minSize: 15000,
    maxSize: 85000,
  },
  {
    id: 'w1_t7_kraken',
    name: 'Bạch Tuộc Khổng Lồ Kraken',
    tier: 7,
    world: 1,
    basePrice: 500000,
    isBoss: true,
    description: 'Bạch tuộc thần bí có thể nuốt chửng cả những con tàu buồm cổ kính.',
    minSize: 12000,
    maxSize: 70000,
  },
  {
    id: 'w1_t7_poseidon_fish',
    name: 'Thần Ngư Poseidon',
    tier: 7,
    world: 1,
    basePrice: 500000,
    isBoss: true,
    description: 'Mang linh hồn của biển cả, vảy phát ánh hoàng kim linh thiêng.',
    minSize: 10000,
    maxSize: 60000,
  },
  {
    id: 'w1_t7_hydra_sea',
    name: 'Cửu Đầu Thủy Xà',
    tier: 7,
    world: 1,
    basePrice: 500000,
    isBoss: true,
    description: 'Sinh vật chín đầu huyền thoại canh giữ rãnh vực sâu nhất đại dương.',
    minSize: 14000,
    maxSize: 80000,
  },

  // ──────────────────────────────────────────────
  // WORLD 2: VÙNG NƯỚC PHÓNG XẠ
  // ──────────────────────────────────────────────
  // Tier 1
  { id: 'w2_t1_chep_ba_mat', name: 'Cá Chép Ba Mắt', tier: 1, world: 2, basePrice: 10, minSize: 0.6, maxSize: 3.0 },
  { id: 'w2_t1_ro_xuong_kho', name: 'Cá Rô Xương Khô', tier: 1, world: 2, basePrice: 10, minSize: 0.4, maxSize: 2.0 },
  { id: 'w2_t1_da_quang', name: 'Cá Dạ Quang', tier: 1, world: 2, basePrice: 10, minSize: 0.2, maxSize: 1.2 },
  { id: 'w2_t1_nong_noc_khong_lo', name: 'Cá Nòng Nọc Khổng Lồ', tier: 1, world: 2, basePrice: 10, minSize: 0.8, maxSize: 3.5 },

  // Tier 2
  { id: 'w2_t2_map_hai_dau', name: 'Cá Mập Hai Đầu', tier: 2, world: 2, basePrice: 50, minSize: 3.0, maxSize: 14.0 },
  { id: 'w2_t2_tre_xuc_tu', name: 'Cá Trê Xúc Tu', tier: 2, world: 2, basePrice: 50, minSize: 2.5, maxSize: 11.0 },
  { id: 'w2_t2_luon_tich_dien_kep', name: 'Cá Lươn Tích Điện Kép', tier: 2, world: 2, basePrice: 50, minSize: 2.0, maxSize: 9.0 },
  { id: 'w2_t2_phoi_nhay_nhua', name: 'Cá Phổi Nhầy Nhụa', tier: 2, world: 2, basePrice: 50, minSize: 1.8, maxSize: 8.5 },

  // Tier 3
  { id: 'w2_t3_sua_boc_thep', name: 'Cá Sứa Bọc Thép', tier: 3, world: 2, basePrice: 250, minSize: 12.0, maxSize: 55.0 },
  { id: 'w2_t3_piranha_rang_cua_sat', name: 'Cá Piranha Răng Cưa Sắt', tier: 3, world: 2, basePrice: 250, minSize: 10.0, maxSize: 45.0 },
  { id: 'w2_t3_duoi_tang_hinh', name: 'Cá Đuối Tàng Hình', tier: 3, world: 2, basePrice: 250, minSize: 15.0, maxSize: 60.0 },
  { id: 'w2_t3_mut_da_ky_sinh', name: 'Cá Mút Đá Ký Sinh', tier: 3, world: 2, basePrice: 250, minSize: 8.0, maxSize: 40.0 },

  // Tier 4
  { id: 'w2_t4_voi_rac_thai', name: 'Cá Voi Rác Thải', tier: 4, world: 2, basePrice: 1500, minSize: 90.0, maxSize: 480.0 },
  { id: 'w2_t4_nhen_bien', name: 'Cá Nhện Biển', tier: 4, world: 2, basePrice: 1500, minSize: 65.0, maxSize: 320.0 },
  { id: 'w2_t4_ngua_gai_doc', name: 'Cá Ngựa Gai Độc', tier: 4, world: 2, basePrice: 1500, minSize: 50.0, maxSize: 280.0 },
  { id: 'w2_t4_hoi_buc_xa_do', name: 'Cá Hồi Bức Xạ Đỏ', tier: 4, world: 2, basePrice: 1500, minSize: 55.0, maxSize: 310.0 },

  // Tier 5
  { id: 'w2_t5_map_zombie', name: 'Cá Mập Zombie', tier: 5, world: 2, basePrice: 10000, minSize: 320, maxSize: 1500 },
  { id: 'w2_t5_may_sinh_hoc', name: 'Cá Máy Sinh Học (Cyborg Fish)', tier: 5, world: 2, basePrice: 10000, minSize: 400, maxSize: 1700 },
  { id: 'w2_t5_mat_quy_dung_nham', name: 'Cá Mặt Quỷ Dung Nham', tier: 5, world: 2, basePrice: 10000, minSize: 350, maxSize: 1600 },
  { id: 'w2_t5_muc_ong_phun_axit', name: 'Mực Ống Phun Axit', tier: 5, world: 2, basePrice: 10000, minSize: 280, maxSize: 1300 },

  // Tier 6
  { id: 'w2_t6_quai_vat_dam_lay', name: 'Quái Vật Đầm Lầy (Swamp Thing)', tier: 6, world: 2, basePrice: 75000, minSize: 1800, maxSize: 7500 },
  { id: 'w2_t6_rong_dot_bien_gen', name: 'Cá Rồng Đột Biến Gen', tier: 6, world: 2, basePrice: 75000, minSize: 2200, maxSize: 9000 },
  { id: 'w2_t6_tuoc_phong_xa_khong_lo', name: 'Tuộc Phóng Xạ Khổng Lồ', tier: 6, world: 2, basePrice: 75000, minSize: 3000, maxSize: 14000 },
  { id: 'w2_t6_thuy_quai_lo_phan_ung', name: 'Thủy Quái Lò Phản Ứng', tier: 6, world: 2, basePrice: 75000, minSize: 4000, maxSize: 16000 },

  // Tier 7 (Boss)
  {
    id: 'w2_t7_gojira_fish',
    name: 'Bạo Chúa Hạt Nhân Gojira-Fish',
    tier: 7,
    world: 2,
    basePrice: 500000,
    isBoss: true,
    description: 'Sinh vật lai giữa cá mập và rồng, mang năng lượng nguyên tử rực sáng trên vây lưng.',
    minSize: 20000,
    maxSize: 95000,
  },
  {
    id: 'w2_t7_chornobyl_behemoth',
    name: 'Quái Thú Chornobyl',
    tier: 7,
    world: 2,
    basePrice: 500000,
    isBoss: true,
    description: 'Sinh vật khổng lồ hấp thụ tia bức xạ cực mạnh từ thảm họa thế kỷ.',
    minSize: 18000,
    maxSize: 88000,
  },
  {
    id: 'w2_t7_plasma_colossus',
    name: 'Khổng Lồ Plasma Biển Độc',
    tier: 7,
    world: 2,
    basePrice: 500000,
    isBoss: true,
    description: 'Thân hình bao phủ bởi lớp plasma nhiệt hạch nóng chảy và ion hóa cực độ.',
    minSize: 16000,
    maxSize: 78000,
  },
  {
    id: 'w2_t7_abyssal_plutonium',
    name: 'Bóng Ma Plutonium Vực Thẳm',
    tier: 7,
    world: 2,
    basePrice: 500000,
    isBoss: true,
    description: 'Ẩn mình nơi rãnh biển sâu bị chôn lấp chất thải hạt nhân đậm đặc.',
    minSize: 15000,
    maxSize: 75000,
  },

  // ──────────────────────────────────────────────
  // WORLD 3: KỶ JURA DƯỚI NƯỚC
  // ──────────────────────────────────────────────
  // Tier 1
  { id: 'w3_t1_bo_ba_thuy', name: 'Cá Bọ Ba Thùy (Trilobite)', tier: 1, world: 3, basePrice: 10, minSize: 0.3, maxSize: 1.5 },
  { id: 'w3_t1_hoa_thach_song', name: 'Cá Hóa Thạch Sống (Coelacanth)', tier: 1, world: 3, basePrice: 10, minSize: 0.8, maxSize: 4.0 },
  { id: 'w3_t1_giap_co_nho', name: 'Cá Giáp Cổ Nhỏ', tier: 1, world: 3, basePrice: 10, minSize: 0.5, maxSize: 2.5 },
  { id: 'w3_t1_nguyen_thuy', name: 'Cá Nguyên Thủy', tier: 1, world: 3, basePrice: 10, minSize: 0.4, maxSize: 2.0 },

  // Tier 2
  { id: 'w3_t2_nham_gai_co_dai', name: 'Cá Nhám Gai Cổ Đại (Stethacanthus)', tier: 2, world: 3, basePrice: 50, minSize: 2.5, maxSize: 12.0 },
  { id: 'w3_t2_duoi_rang_cua', name: 'Cá Đuối Răng Cưa (Onchopristis)', tier: 2, world: 3, basePrice: 50, minSize: 3.5, maxSize: 15.0 },
  { id: 'w3_t2_phoi_khong_lo', name: 'Cá Phổi Khổng Lồ', tier: 2, world: 3, basePrice: 50, minSize: 2.0, maxSize: 10.0 },
  { id: 'w3_t2_rong_co_dai', name: 'Cá Rồng Cổ Đại', tier: 2, world: 3, basePrice: 50, minSize: 3.0, maxSize: 13.0 },

  // Tier 3
  { id: 'w3_t3_map_rang_xoan', name: 'Cá Mập Răng Xoắn (Helicoprion)', tier: 3, world: 3, basePrice: 250, minSize: 15.0, maxSize: 70.0 },
  { id: 'w3_t3_dunkleosteus_non', name: 'Cá Bọc Thép Dunkleosteus (con non)', tier: 3, world: 3, basePrice: 250, minSize: 12.0, maxSize: 55.0 },
  { id: 'w3_t3_rang_kiem', name: 'Cá Răng Kiếm (Enchodus)', tier: 3, world: 3, basePrice: 250, minSize: 10.0, maxSize: 50.0 },
  { id: 'w3_t3_muc_vo_sung', name: 'Mực Vỏ Sừng (Ammonite)', tier: 3, world: 3, basePrice: 250, minSize: 8.0, maxSize: 42.0 },

  // Tier 4
  { id: 'w3_t4_ran_bien_co_dai', name: 'Rắn Biển Cổ Đại (Plesiosaur)', tier: 4, world: 3, basePrice: 1500, minSize: 80.0, maxSize: 420.0 },
  { id: 'w3_t4_map_cho_san', name: 'Cá Mập Chó Săn (Cretoxyrhina)', tier: 4, world: 3, basePrice: 1500, minSize: 75.0, maxSize: 380.0 },
  { id: 'w3_t4_vay_co_tien_su', name: 'Cá Vây Cờ Tiền Sử', tier: 4, world: 3, basePrice: 1500, minSize: 60.0, maxSize: 320.0 },
  { id: 'w3_t4_sau_bien_co_dai', name: 'Cá Sấu Biển Cổ Đại (Dakosaurus)', tier: 4, world: 3, basePrice: 1500, minSize: 95.0, maxSize: 460.0 },

  // Tier 5
  { id: 'w3_t5_ngu_long', name: 'Ngư Long (Ichthyosaur)', tier: 5, world: 3, basePrice: 10000, minSize: 350, maxSize: 1800 },
  { id: 'w3_t5_than_lan_bien', name: 'Thằn Lằn Biển (Cymbospondylus)', tier: 5, world: 3, basePrice: 10000, minSize: 450, maxSize: 2100 },
  { id: 'w3_t5_thuy_quai_co_dai', name: 'Thủy Quái Cổ Dài (Elasmosaurus)', tier: 5, world: 3, basePrice: 10000, minSize: 500, maxSize: 2500 },
  { id: 'w3_t5_quai_ngu_xiphactinus', name: 'Quái Ngư Xiphactinus', tier: 5, world: 3, basePrice: 10000, minSize: 320, maxSize: 1600 },

  // Tier 6
  { id: 'w3_t6_dunkleosteus_truong_thanh', name: 'Quái Vật Bọc Thép Dunkleosteus (trưởng thành)', tier: 6, world: 3, basePrice: 75000, minSize: 2500, maxSize: 9500 },
  { id: 'w3_t6_kronosaurus', name: 'Vua Biển Thẳm Kronosaurus', tier: 6, world: 3, basePrice: 75000, minSize: 3500, maxSize: 15000 },
  { id: 'w3_t6_sieu_muc_tusoteuthis', name: 'Siêu Mực Tusoteuthis', tier: 6, world: 3, basePrice: 75000, minSize: 2800, maxSize: 12000 },
  { id: 'w3_t6_mosasaurus', name: 'Khủng Long Biển Mosasaurus', tier: 6, world: 3, basePrice: 75000, minSize: 4500, maxSize: 18000 },

  // Tier 7 (Boss)
  {
    id: 'w3_t7_megalodon',
    name: 'Hủy Diệt Cổ Đại - Siêu Cá Mập Megalodon',
    tier: 7,
    world: 3,
    basePrice: 500000,
    isBoss: true,
    description: 'Kích thước che lấp cả màn hình, hàm răng có thể nghiền nát mọi thứ.',
    minSize: 25000,
    maxSize: 100000,
  },
  {
    id: 'w3_t7_liopleurodon',
    name: 'Sát Thủ Bờ Biển Liopleurodon',
    tier: 7,
    world: 3,
    basePrice: 500000,
    isBoss: true,
    description: 'Loài bò sát biển ăn thịt nguy hiểm bậc nhất kỷ Jura với cú cắn kinh hoàng.',
    minSize: 20000,
    maxSize: 90000,
  },
  {
    id: 'w3_t7_shastasaurus',
    name: 'Hải Thần Shastasaurus',
    tier: 7,
    world: 3,
    basePrice: 500000,
    isBoss: true,
    description: 'Sinh vật biển có kích thước đồ sộ nhất từng lướt qua các đại dương cổ.',
    minSize: 22000,
    maxSize: 92000,
  },
  {
    id: 'w3_t7_basilosaurus',
    name: 'Vua Cá Voi Tiền Sử Basilosaurus',
    tier: 7,
    world: 3,
    basePrice: 500000,
    isBoss: true,
    description: 'Tổ tiên cá voi với thân hình dài uốn lượn như loài rồng biển cổ xưa.',
    minSize: 18000,
    maxSize: 85000,
  },
];

export const FISH_MAP: Record<string, Fish> = ALL_FISH.reduce<Record<string, Fish>>((acc, fish) => {
  acc[fish.id] = fish;
  return acc;
}, {});

export const getFishByWorldAndTier = (world: WorldId, tier: FishTier): Fish[] => {
  return ALL_FISH.filter((f) => f.world === world && f.tier === tier);
};
