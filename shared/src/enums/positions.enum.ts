export enum VolleyballPosition {
  SETTER = 'setter',
  OUTSIDE_HITTER = 'outside_hitter',
  MIDDLE_BLOCKER = 'middle_blocker',
  OPPOSITE_HITTER = 'opposite_hitter',
  LIBERO = 'libero',
  DEFENSIVE_SPECIALIST = 'defensive_specialist'
}

export enum CourtPosition {
  POSITION_1 = 'position_1', // Right back
  POSITION_2 = 'position_2', // Right front
  POSITION_3 = 'position_3', // Middle front
  POSITION_4 = 'position_4', // Left front
  POSITION_5 = 'position_5', // Left back
  POSITION_6 = 'position_6'  // Middle back
}

// Display names cho UI
export const POSITION_NAMES: Record<VolleyballPosition, string> = {
  [VolleyballPosition.SETTER]: 'Phụ công',
  [VolleyballPosition.OUTSIDE_HITTER]: 'Chủ công',
  [VolleyballPosition.MIDDLE_BLOCKER]: 'Phó công',
  [VolleyballPosition.OPPOSITE_HITTER]: 'Đối công',
  [VolleyballPosition.LIBERO]: 'Libero',
  [VolleyballPosition.DEFENSIVE_SPECIALIST]: 'Chuyên gia phòng thủ'
};

export const COURT_POSITION_NAMES: Record<CourtPosition, string> = {
  [CourtPosition.POSITION_1]: 'Vị trí 1 (Chuyền hai)',
  [CourtPosition.POSITION_2]: 'Vị trí 2 (Đối Chuyền)',
  [CourtPosition.POSITION_3]: 'Vị trí 3 (Phụ Công)',
  [CourtPosition.POSITION_4]: 'Vị trí 4 (Chủ Công)',
  [CourtPosition.POSITION_5]: 'Vị trí 5 (Chủ Công)',
  [CourtPosition.POSITION_6]: 'Vị trí 6 (Phụ Công)'
};
