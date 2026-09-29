import React from 'react';
import {

  Droplets,
  Camera,
  ClipboardCheck,
  Clock,
  Shirt,
  CalendarCheck,
} from 'lucide-react';

interface ShiftTaskIconProps {
  taskTitle: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ShiftTaskIcon: React.FC<ShiftTaskIconProps> = ({
  taskTitle,
  size = 28,
  className = '',
  style,
}) => {
  const lower = taskTitle.toLowerCase();

  if (lower.includes('chụp báo cáo') || lower.includes('camera')) {
    return <Camera size={size} strokeWidth={1.5} className={className} style={style} />;
  }
  if (lower.includes('nhà vệ sinh') || lower.includes('dọn')) {
    return <Droplets size={size} strokeWidth={1.5} className={className} style={style} />;
  }
  if (lower.includes('giặt') || lower.includes('sấy')) {
    return <Shirt size={size} strokeWidth={1.5} className={className} style={style} />;
  }
  if (lower.includes('kiểm') || lower.includes('phòng') || lower.includes('tú')) {
    return <ClipboardCheck size={size} strokeWidth={1.5} className={className} style={style} />;
  }
  if (lower.includes('chấm công')) {
    return <CalendarCheck size={size} strokeWidth={1.5} className={className} style={style} />;
  }

  return <Clock size={size} strokeWidth={1.5} className={className} style={style} />;
};
