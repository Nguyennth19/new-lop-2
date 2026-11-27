'use strict';
const SLOT_LABELS = Object.freeze({
  t1_split1: 'Ô số thứ nhất',
  t1_split2: 'Ô số thứ hai',
  t1_ten: 'Ô hàng chục',
  t1_ans: 'Ô kết quả',
  t1_dm: 'Ô hàng chục tách',
  t1_m: 'Ô đơn vị tách'
});
function toLearnerSlotLabel(slotId) {
  if (typeof slotId !== 'string' || !slotId.trim()) return 'Ô đang chọn';
  return SLOT_LABELS[slotId.trim()] || 'Ô đang chọn';
}
function formatSelectedSlotBanner(slotId) {
  return `Đang chọn: ${toLearnerSlotLabel(slotId)}`;
}
module.exports = Object.freeze({ SLOT_LABELS, toLearnerSlotLabel, formatSelectedSlotBanner });