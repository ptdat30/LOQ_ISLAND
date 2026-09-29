import React from 'react';
import {
  Music, Timer, Download, Bike, Plane, Trophy, GitBranch, Activity,
  Pause, Play, SkipForward, SkipBack, Square, X, Settings,
  Pin, PinOff, Volume2, Camera, Mic, Phone, Check, ChevronDown,
  Layers, Sparkles, Maximize2, Minimize2, Radio, ExternalLink,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Music, Timer, Download, Bike, Plane, Trophy, GitBranch, Activity,
  Pause, Play, SkipForward, SkipBack, Square, X, Settings,
  Pin, PinOff, Volume2, Camera, Mic, Phone, Check, ChevronDown,
  Layers, Sparkles, Maximize2, Minimize2, Radio, ExternalLink,
};

export interface IconRendererProps {
  name?: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  name = 'Sparkles',
  className = 'w-4 h-4 text-white/90',
  size = 16,
  style,
}) => {
  const IconComponent = ICON_MAP[name] || Sparkles;
  return <IconComponent className={className} size={size} strokeWidth={1.5} style={style} />;
};
