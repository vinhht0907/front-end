export const TYPE_OPTIONS = [
  {
    id: 'try',
    text: 'Thi thử'
  },
  {
    id: 'real',
    text: 'Thi thật'
  }
]

export const TT_TEST_TIME = 'test_time'

export const TIME_TYPE_OPTIONS = [
  {
    id: 'unlimited',
    text: 'Không tính giờ'
  },
  {
    id: TT_TEST_TIME,
    text: 'Tính giờ cho toàn đề'
  },
  {
    id: 'section_time',
    text: 'Tính giờ cho từng phần'
  }
]

export const QT_SINGLE_CHOICE_INLINE = 'single_choice_inline'
export const QT_MULTI_CHOICE_INLINE = 'multi_choice_inline'
export const QT_SINGLE_CHOICE_PICTURE = 'single_choice_picture'
export const QT_QUESTION_WITH_ORDER = 'question_with_order'
export const QT_SELECT_ANSWER_SENTENCE = 'select_answer_sentence'
export const QT_SELECT_ANSWER_PARAGRAPH = 'select_answer_paragraph'
export const QT_FILL_IN_BLANK = 'fill_in_blank'
export const QT_FILL_IN_BLANK_SENTENCE = 'fill_in_blank_sentence'
export const QT_REWRITE_BASE_SUGGESTED = 'rewrite_base_suggested'

export const QUESTION_TYPE_OPTIONS_SINGLE_CHOICE = [
  {
    id: QT_SINGLE_CHOICE_INLINE,
    text: 'Câu hỏi 1 lựa chọn'
  }
]

export const QUESTION_TYPE_OPTIONS = [
  {
    id: QT_SINGLE_CHOICE_INLINE,
    text: 'Câu hỏi 1 lựa chọn'
  },
  {
    id: QT_MULTI_CHOICE_INLINE,
    text: 'Câu hỏi nhiều lựa chọn'
  },
  {
    id: QT_SINGLE_CHOICE_PICTURE,
    text: 'Câu hỏi chọn ảnh'
  },
  {
    id: QT_QUESTION_WITH_ORDER,
    text: 'Sắp xếp thành câu theo thứ tự'
  },
  {
    id: QT_SELECT_ANSWER_SENTENCE,
    text: 'Chọn đáp án trong câu'
  },
  {
    id: QT_SELECT_ANSWER_PARAGRAPH,
    text: 'Chọn đáp án trong đoạn văn'
  },
  {
    id: QT_FILL_IN_BLANK_SENTENCE,
    text: 'Điền từ vào chỗ trống trong câu'
  },
  {
    id: QT_FILL_IN_BLANK,
    text: 'Điền từ vào chỗ trống trong đoạn văn'
  },
  {
    id: QT_REWRITE_BASE_SUGGESTED,
    text: 'Viết lại câu dựa vào từ gợi ý'
  }
]
