import type { IslandColorCustomization, IslandEffectCustomization } from '../../../types/fishing';

export const ISLAND_COLORS: IslandColorCustomization[] = [
  {
    id: 'color_default_black',
    name: 'Obsidian',
    priceGold: 0,
    priceDiamond: 0,
    colorValue: '#0A0A0F',
    cssStyle: { backgroundColor: '#0A0A0F' },
  },
  {
    id: 'color_night_blue',
    name: 'Night Blue',
    priceGold: 10000,
    priceDiamond: 0,
    colorValue: '#0D1B2A',
    cssStyle: { backgroundColor: '#0D1B2A' },
  },
  {
    id: 'color_titanium_gray',
    name: 'Titanium Gray',
    priceGold: 30000,
    priceDiamond: 0,
    colorValue: '#1E1E28',
    cssStyle: { backgroundColor: '#1E1E28' },
  },
  {
    id: 'color_royal_purple',
    name: 'Midnight Dusk',
    priceGold: 50000,
    priceDiamond: 0,
    colorValue: '#1A1424',
    cssStyle: { backgroundColor: '#1A1424' },
  },
  {
    id: 'color_deep_space',
    name: 'Deep Space',
    priceGold: 100000,
    priceDiamond: 0,
    colorValue: '#14141A',
    cssStyle: { backgroundColor: '#14141A' },
  },
  {
    id: 'color_rainbow',
    name: 'Prism Spectrum',
    priceGold: 0,
    priceDiamond: 10,
    colorValue: 'linear-gradient(135deg, #1A162B 0%, #201D38 50%, #281D30 100%)',
    cssStyle: {
      backgroundImage: 'linear-gradient(135deg, #1A162B 0%, #201D38 50%, #281D30 100%)',
    },
  },
  {
    id: 'color_transparent',
    name: 'Frosted Glass',
    priceGold: 0,
    priceDiamond: 50,
    colorValue: 'rgba(10, 10, 15, 0.75)',
    cssStyle: {
      backgroundColor: 'rgba(10, 10, 15, 0.75)',
      backdropFilter: 'blur(30px) saturate(190%)',
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
  },
];

export const ISLAND_EFFECTS: IslandEffectCustomization[] = [
  {
    id: 'effect_glow_light',
    name: 'Glow nhẹ',
    priceGold: 5000,
    priceDiamond: 0,
    effectType: 'glow_light',
  },
  {
    id: 'effect_glow_strong',
    name: 'Glow mạnh',
    priceGold: 50000,
    priceDiamond: 0,
    effectType: 'glow_strong',
  },
  {
    id: 'effect_pulse',
    name: 'Pulse khi có activity mới',
    priceGold: 100000,
    priceDiamond: 0,
    effectType: 'pulse',
  },
  {
    id: 'effect_particles',
    name: 'Particle bay lên khi mở rộng',
    priceGold: 0,
    priceDiamond: 500,
    effectType: 'particles',
  },
  {
    id: 'effect_ripple',
    name: 'Ripple khi click',
    priceGold: 0,
    priceDiamond: 200,
    effectType: 'ripple',
  },
  {
    id: 'effect_aurora',
    name: 'Aurora borealis',
    priceGold: 0,
    priceDiamond: 1000,
    effectType: 'aurora',
  },
  {
    id: 'effect_collection_master',
    name: '👑 Collection Master (Độc Quyền 84/84)',
    priceGold: 0,
    priceDiamond: 0,
    effectType: 'collection_master',
  },
];
