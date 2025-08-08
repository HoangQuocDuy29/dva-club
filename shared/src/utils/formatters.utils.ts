import { DATE_FORMATS } from '../constants';

// Date Formatters
export const formatDate = (date: Date | string, format: string = DATE_FORMATS.DATE_ONLY): string => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  switch (format) {
    case DATE_FORMATS.DATE_ONLY:
      return `${day}/${month}/${year}`;
    case DATE_FORMATS.DATE_TIME:
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    case DATE_FORMATS.TIME_ONLY:
      return `${hours}:${minutes}`;
    case DATE_FORMATS.ISO_DATE:
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

export const formatDateTime = (date: Date | string): string => {
  return formatDate(date, DATE_FORMATS.DATE_TIME);
};

export const formatTimeOnly = (date: Date | string): string => {
  return formatDate(date, DATE_FORMATS.TIME_ONLY);
};

export const formatRelativeTime = (date: Date | string): string => {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  
  return formatDate(target);
};

// Number Formatters
export const formatNumber = (number: number, decimals: number = 0): string => {
  return number.toLocaleString('vi-VN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// Text Formatters
export const formatName = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return '';
  if (!firstName) return lastName || '';
  if (!lastName) return firstName;
  return `${lastName} ${firstName}`;
};

export const formatFullName = (fullName: string): string => {
  return fullName
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Volleyball-specific Formatters
export const formatMatchScore = (homeScore: number, awayScore: number): string => {
  return `${homeScore} - ${awayScore}`;
};

export const formatSetScores = (sets: Array<{ homeScore: number; awayScore: number }>): string => {
  return sets.map(set => `${set.homeScore}-${set.awayScore}`).join(', ');
};

export const formatPlayerPosition = (position: string): string => {
  const positions: Record<string, string> = {
    'setter': 'Phụ công',
    'outside_hitter': 'Chủ công',
    'middle_blocker': 'Phó công',
    'opposite_hitter': 'Đối công',
    'libero': 'Libero',
    'defensive_specialist': 'Chuyên gia phòng thủ'
  };
  
  return positions[position] || position;
};

export const formatPlayerStats = (stats: {
  serves: number;
  aces: number;
  attacks: number;
  blocks: number;
}) => {
  return {
    serves: formatNumber(stats.serves),
    aces: formatNumber(stats.aces),
    attacks: formatNumber(stats.attacks),
    blocks: formatNumber(stats.blocks),
    summary: `${stats.aces}A ${stats.attacks}K ${stats.blocks}B`
  };
};

export const formatTeamRecord = (wins: number, losses: number): string => {
  return `${wins}T-${losses}B`;
};

// Status Formatters
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'active': 'Hoạt động',
    'inactive': 'Không hoạt động',
    'pending': 'Chờ xử lý',
    'approved': 'Đã duyệt',
    'rejected': 'Từ chối',
    'completed': 'Hoàn thành',
    'scheduled': 'Đã lên lịch',
    'cancelled': 'Đã hủy',
    'in_progress': 'Đang diễn ra'
  };
  
  return statusMap[status] || status;
};

export const formatUserRole = (role: string): string => {
  const roleMap: Record<string, string> = {
    'super_admin': 'Quản trị viên cấp cao',
    'admin': 'Quản trị viên',
    'coach': 'Huấn luyện viên',
    'assistant_coach': 'Trợ lý HLV',
    'player': 'Cầu thủ',
    'staff': 'Nhân viên',
    'viewer': 'Người xem'
  };
  
  return roleMap[role] || role;
};

// Age and Duration Formatters
export const formatAge = (dateOfBirth: Date | string): string => {
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  
  if (today.getMonth() < birth.getMonth() || 
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return `${age} tuổi`;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins} phút`;
  if (mins === 0) return `${hours} giờ`;
  return `${hours}h ${mins}m`;
};

// Array and List Formatters
export const formatList = (items: string[], separator: string = ', ', lastSeparator: string = ' và '): string => {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return items.join(lastSeparator);
  
  const allButLast = items.slice(0, -1).join(separator);
  const last = items[items.length - 1];
  
  return `${allButLast}${lastSeparator}${last}`;
};

export const formatTags = (tags: string[]): string => {
  return tags.map(tag => `#${tag}`).join(' ');
};

// Color and Badge Formatters
export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    'active': 'green',
    'inactive': 'gray',
    'pending': 'yellow',
    'approved': 'green',
    'rejected': 'red',
    'completed': 'blue',
    'scheduled': 'blue',
    'cancelled': 'red',
    'in_progress': 'orange'
  };
  
  return colorMap[status] || 'gray';
};

export const formatBadge = (text: string, status: string): { text: string; color: string } => {
  return {
    text: formatStatus(status),
    color: getStatusColor(status)
  };
};
