import type { Rod, RodId, BaitId, Vehicle, VehicleId } from '../../../types/fishing';

// ──────────────────────────────────────────────
// DANH MỤC 1: CẦN CÂU (Trang bị vĩnh viễn)
// ──────────────────────────────────────────────
export const RODS: Record<RodId, Rod> = {
  rod_bamboo: {
    id: 'rod_bamboo',
    name: 'Cần Tre Làng',
    priceGold: 0,
    priceDiamond: 0,
    description: 'Cần câu cơ bản từ tre già làng quê. Dùng được ở World 1.',
    speedSeconds: 0.5,
  },
  rod_carbon: {
    id: 'rod_carbon',
    name: 'Cần Sợi Carbon Tối Thượng',
    priceGold: 50000,
    priceDiamond: 0,
    description: 'Trọng lượng siêu nhẹ, sợi carbon đàn hồi cực tốt. Tăng 200% giá bán mọi loại cá ở World 1 (×3).',
    priceMultiplier: (world) => (world === 1 ? 3 : 1),
  },
  rod_anti_radiation: {
    id: 'rod_anti_radiation',
    name: 'Cần Hợp Kim Chống Bức Xạ',
    priceGold: 500000,
    priceDiamond: 50,
    description: 'Phủ lớp chì và hợp kim đặc biệt. Điều kiện bắt buộc để vào World 2. Tăng 50% tỉ lệ cá Đột biến Tier 4, 5, 6.',
    unlocksWorld: 2,
    tierBuff: '+50% tỉ lệ cá Tier 4-6 tại World 2',
  },
  rod_nuclear: {
    id: 'rod_nuclear',
    name: 'Cần Câu Cơ Khí Năng Lượng Hạt Nhân',
    priceGold: 2000000,
    priceDiamond: 200,
    description: 'Trục quay titanium tích hợp lõi hạt nhân mini. Tăng 500% giá bán cá tại World 2 (×6).',
    priceMultiplier: (world) => (world === 2 ? 6 : 1),
  },
  rod_dinosaur_bone: {
    id: 'rod_dinosaur_bone',
    name: 'Cần Câu Xương Khủng Long',
    priceGold: 10000000,
    priceDiamond: 1000,
    description: 'Chế tác từ xương sống T-Rex hóa thạch. Điều kiện bắt buộc để vào World 3. Tăng 50% cơ hội gặp cá Tier 5+ ở World 3.',
    unlocksWorld: 3,
    tierBuff: '+50% tỉ lệ cá Tier 5+ tại World 3',
  },
  rod_cosmic: {
    id: 'rod_cosmic',
    name: 'Cần Thần Khí Không Gian',
    priceGold: 100000000,
    priceDiamond: 10000,
    description: 'Cần câu Tối thượng uốn cong không thời gian. Nhân ×3 toàn bộ doanh thu cá và giảm thời gian câu xuống 0.25s/con.',
    priceMultiplier: () => 3,
    speedSeconds: 0.25,
  },
};

// ──────────────────────────────────────────────
// DANH MỤC 2: MỒI CÂU (Gói 1.000 / 10.000 / 100.000)
// ──────────────────────────────────────────────
export interface BaitInfo {
  id: BaitId;
  name: string;
  description: string;
  targetWorld?: number;
  packs: Array<{
    quantity: number;
    priceGold: number;
    priceDiamond: number;
  }>;
}

export const BAITS_INFO: Record<BaitId, BaitInfo> = {
  bait_corn: {
    id: 'bait_corn',
    name: 'Mồi Bột Ngô Tẩm Hương',
    description: 'Giảm 10% tỉ lệ ra cá Cấp 1, chuyển đều +5% cho Cấp 2 và +5% cho Cấp 3.',
    packs: [
      { quantity: 1000, priceGold: 100, priceDiamond: 0 },
      { quantity: 10000, priceGold: 1000, priceDiamond: 0 },
      { quantity: 100000, priceGold: 10000, priceDiamond: 0 },
    ],
  },
  bait_glow_blood: {
    id: 'bait_glow_blood',
    name: 'Mồi Máu Dạ Quang',
    description: 'Thu hút cá đột biến tại World 2. Nhân đôi (×2) tỉ lệ ra cá Cấp 4 và Cấp 5.',
    targetWorld: 2,
    packs: [
      { quantity: 1000, priceGold: 500, priceDiamond: 0 },
      { quantity: 10000, priceGold: 5000, priceDiamond: 0 },
      { quantity: 100000, priceGold: 50000, priceDiamond: 0 },
    ],
  },
  bait_amber_fossil: {
    id: 'bait_amber_fossil',
    name: 'Mồi Hóa Thạch Hổ Phách',
    description: 'Chiết xuất từ ADN cổ đại. Tăng 50% cơ hội chạm trán cá Khủng long Cấp 5 trở lên tại World 3.',
    targetWorld: 3,
    packs: [
      { quantity: 1000, priceGold: 2000, priceDiamond: 0 },
      { quantity: 10000, priceGold: 20000, priceDiamond: 0 },
      { quantity: 100000, priceGold: 200000, priceDiamond: 0 },
    ],
  },
  bait_mystic_gold: {
    id: 'bait_mystic_gold',
    name: 'Mồi Vàng Ròng Thần Bí',
    description: 'Ép buộc 100 con cá tiếp theo cắn câu ít nhất phải từ Cấp 4 trở lên (Tier 4: 75%, Tier 5: 20%, Tier 6: 4.5%, Tier 7: 0.5%).',
    packs: [
      { quantity: 1000, priceGold: 0, priceDiamond: 50 },
      { quantity: 10000, priceGold: 0, priceDiamond: 500 },
      { quantity: 100000, priceGold: 0, priceDiamond: 5000 },
    ],
  },
  bait_boss_awakening: {
    id: 'bait_boss_awakening',
    name: 'Mồi "Thức Tỉnh Boss"',
    description: 'Vật phẩm cực hiếm. Khi sử dụng, con cá tiếp theo cắn câu chắc chắn là cá Cấp 6 hoặc Cấp 7 (50/50). Tiêu hao 1 mồi cho 1 con.',
    packs: [
      { quantity: 1, priceGold: 0, priceDiamond: 500 },
      { quantity: 5, priceGold: 0, priceDiamond: 2500 },
    ],
  },
};

// ──────────────────────────────────────────────
// DANH MỤC 3: NÂNG CẤP TỰ ĐỘNG
// ──────────────────────────────────────────────
export const AUTO_UPGRADES_CONFIG: Record<
  string,
  {
    name: string;
    description: string;
    levels: Array<{
      level: number;
      priceGold: number;
      priceDiamond: number;
      label: string;
    }>;
  }
> = {
  upgrade_sorter: {
    name: 'Máy Phân Loại Thủy Hải Sản',
    description: 'Tự động bán cá Cấp 1 ngay khi câu dính, cộng tiền ngay lập tức và không tốn chỗ trong giỏ.',
    levels: [{ level: 1, priceGold: 100000, priceDiamond: 0, label: 'Kích hoạt' }],
  },
  upgrade_quantum_basket: {
    name: 'Tủ Lượng Tử Vô Hạn',
    description: 'Tăng sức chứa giỏ cá từ 1.000 con lên không giới hạn (Infinity). Cho phép treo máy qua đêm.',
    levels: [{ level: 1, priceGold: 1000000, priceDiamond: 100, label: 'Kích hoạt' }],
  },
  upgrade_drone: {
    name: 'Drone Thả Lưới Tự Động',
    description: 'Cho phép nhận thu nhập mỗi giây kể cả khi đã thoát game (Offline Earning, tối đa 24 giờ).',
    levels: [
      { level: 1, priceGold: 5000000, priceDiamond: 500, label: 'Cấp 1: 50% thu nhập' },
      { level: 2, priceGold: 25000000, priceDiamond: 2500, label: 'Cấp 2: 75% thu nhập' },
      { level: 3, priceGold: 125000000, priceDiamond: 12500, label: 'Cấp 3: 100% thu nhập' },
    ],
  },
  upgrade_gene_extractor: {
    name: 'Máy Chiết Xuất Gen',
    description: 'Tự động thu thập 1 "Điểm Đột Biến" mỗi khi câu được cá Cấp 3 trở lên, dùng để nâng cấp Lưỡi Câu Cốt Lõi.',
    levels: [{ level: 1, priceGold: 2000000, priceDiamond: 200, label: 'Kích hoạt' }],
  },
};

// ──────────────────────────────────────────────
// DANH MỤC 4: PHƯƠNG TIỆN (Buff toàn global)
// ──────────────────────────────────────────────
export const VEHICLES: Record<VehicleId, Vehicle> = {
  vehicle_coracle: {
    id: 'vehicle_coracle',
    name: 'Thuyền Thúng Nhựa',
    priceGold: 0,
    priceDiamond: 0,
    description: 'Phương tiện khởi đầu đơn sơ, mộc mạc. Không buff.',
  },
  vehicle_trawler: {
    id: 'vehicle_trawler',
    name: 'Tàu Đánh Cá Viễn Dương',
    priceGold: 200000,
    priceDiamond: 0,
    description: 'Tàu cá công suất lớn viễn chinh. +50% tốc độ câu (giảm từ 0.5s xuống 0.35s/con).',
  },
  vehicle_anti_toxic_sub: {
    id: 'vehicle_anti_toxic_sub',
    name: 'Tàu Ngầm Chống Độc',
    priceGold: 3000000,
    priceDiamond: 300,
    description: 'Vỏ bọc titan chịu ăn mòn axit cực đại. Miễn nhiễm hoàn toàn hiệu ứng Nước Độc tại World 2 (tránh mất cá khi kéo).',
    targetWorld: 2,
  },
  vehicle_time_machine: {
    id: 'vehicle_time_machine',
    name: 'Tàu Xuyên Không Cơ Học',
    priceGold: 20000000,
    priceDiamond: 2000,
    description: 'Tàu trang bị động cơ dịch chuyển thời gian. Mở tính năng "Lỗ Hổng Thời Gian" tại World 3 — thỉnh thoảng lưới được rương báu cổ đại chứa tiền và Mồi Vàng Ròng.',
    targetWorld: 3,
  },
};
