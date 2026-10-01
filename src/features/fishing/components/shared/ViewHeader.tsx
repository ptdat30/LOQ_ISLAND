import React from 'react';
import { ArrowLeft, X, Music, Coins, Gem, Dna } from 'lucide-react';
import { TOKENS } from '../../constants/tokens';
import { TabularNumber } from './TabularNumber';

interface ViewHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onClose: () => void;
  gold: number;
  diamonds: number;
  mutationPoints?: number;
  hasMedia?: boolean;
  onOpenMedia?: () => void;
}

export const ViewHeader: React.FC<ViewHeaderProps> = ({
  title,
  subtitle,
  onBack,
  onClose,
  gold,
  diamonds,
  mutationPoints = 0,
  hasMedia = false,
  onOpenMedia,
}) => {
  return (
    <div
      className="flex items-center justify-between pb-3 shrink-0 select-none"
      style={{
        borderBottom: `1px solid ${TOKENS.colors.borderSubtle}`,
        gap: TOKENS.spacing[2],
      }}
    >
      {/* CỰC TRÁI: Title hoặc Back Button */}
      <div className="flex items-center gap-2 min-w-0">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-[#8A8A94] hover:text-[#F5F5F7] transition-colors cursor-pointer py-1 pr-2 active:scale-[0.96]"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span style={{ fontSize: TOKENS.typography.caption.fontSize, fontWeight: 500 }}>Quay lại</span>
          </button>
        ) : (
          <div className="flex flex-col min-w-0">
            <h2
              className="text-[#F5F5F7] truncate leading-tight font-display"
              style={{
                fontSize: TOKENS.typography.title.fontSize,
                fontWeight: TOKENS.typography.title.fontWeight,
                letterSpacing: TOKENS.typography.title.letterSpacing,
              }}
            >
              {title}
            </h2>
            {subtitle && (
              <span
                className="text-[#8A8A94] truncate"
                style={{ fontSize: TOKENS.typography.micro.fontSize }}
              >
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>

      {/* CỰC PHẢI: Số liệu tiền tệ (Tabular) & Nút thoát */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Currency Capsule */}
        <div
          className="flex items-center gap-2.5 px-2.5 py-1"
          style={{
            backgroundColor: TOKENS.colors.surface,
            borderRadius: TOKENS.radius.badge,
            border: `1px solid ${TOKENS.colors.borderSubtle}`,
            boxShadow: TOKENS.shadow.subtle,
          }}
        >
          {/* Gold */}
          <div className="flex items-center gap-1 shrink-0" title={`Vàng: ${gold.toLocaleString()}`}>
            <Coins className="w-3.5 h-3.5 text-[#FFD60A]" strokeWidth={1.5} />
            <TabularNumber
              value={gold}
              className="text-[12px] font-bold text-[#F5F5F7]"
            />
          </div>

          {/* Diamonds */}
          <div className="flex items-center gap-1 shrink-0" title={`Kim Cương: ${diamonds.toLocaleString()}`}>
            <Gem className="w-3.5 h-3.5 text-[#5AC8FA]" strokeWidth={1.5} />
            <TabularNumber
              value={diamonds}
              className="text-[12px] font-bold text-[#5AC8FA]"
            />
          </div>

          {/* Mutation Points (khi > 0) */}
          {mutationPoints > 0 && (
            <div className="flex items-center gap-1 shrink-0" title={`Điểm đột biến: ${mutationPoints.toLocaleString()}`}>
              <Dna className="w-3.5 h-3.5 text-[#BF5AF2]" strokeWidth={1.5} />
              <TabularNumber
                value={mutationPoints}
                className="text-[12px] font-bold text-[#BF5AF2]"
              />
            </div>
          )}
        </div>

        {/* Media Button if playing */}
        {hasMedia && onOpenMedia && (
          <button
            type="button"
            onClick={onOpenMedia}
            title="Chuyển sang Trình phát nhạc (Alt+M)"
            className="p-1 rounded-md text-[#32D74B] hover:bg-white/5 transition-colors cursor-pointer active:scale-[0.96]"
          >
            <Music className="w-4 h-4" strokeWidth={1.5} />
          </button>
        )}

        {/* Close Button (Ghost) */}
        <button
          type="button"
          onClick={onClose}
          title="Thu nhỏ về Dynamic Island"
          className="p-1 rounded-md text-[#8A8A94] hover:text-[#F5F5F7] hover:bg-white/5 transition-colors cursor-pointer active:scale-[0.96]"
        >
          <X className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};
