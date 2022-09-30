export const IN_PROGRESS = 'in_progress'
export const PENDING = 'pending'
export const ERROR = 'error'
export const CANCEL = 'cancel'
export const COMPLETED = 'completed'
export const IN_REVIEW = 'in_review'
export const ALL = 'all'

export const contentDisplayStatus = [
  { id: ALL, text: 'Tất cả', cssClass: 'primary' },
  { id: IN_PROGRESS, text: 'Chưa xử lý', cssClass: 'primary' },
  { id: PENDING, text: 'Đang chờ', cssClass: 'info' },
  { id: ERROR, text: 'Dữ liệu lỗi', cssClass: 'danger' },
  { id: CANCEL, text: 'Hủy bỏ', cssClass: 'dark' },
  { id: COMPLETED, text: 'Hoàn thành', cssClass: 'success' },
  { id: IN_REVIEW, text: 'Chờ duyệt', cssClass: 'warning' }
]

export const NEED_TRANSLATE = 1
export const FOREIGN_LANGUAGE_ID = 16
