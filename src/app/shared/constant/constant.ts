import { EEventFormDetailFormat, EQuestionType } from './enum';

export const QUESTION_TYPE_OPTIONS = [
  { name: 'Short answer', value: EQuestionType.text },
  { name: 'Multi choice', value: EQuestionType.multi_choice },
  { name: 'Checkbox', value: EQuestionType.single_choice },
  { name: 'Rating', value: EQuestionType.rating },
  { name: 'Percentage', value: EQuestionType.percentage },
];

export const DEFAULT_FORMAT_EVENT_FORM_OPTION = [
  { label: 'HCO', value: EEventFormDetailFormat.hco },
  { label: 'Name', value: EEventFormDetailFormat.name },
  { label: 'Specialty', value: EEventFormDetailFormat.specialty },
  { label: 'Gender', value: EEventFormDetailFormat.gender },
  { label: 'DOB', value: EEventFormDetailFormat.dob },
  { label: 'Title', value: EEventFormDetailFormat.title },
];

export const CUSTOM_FORMAT_EVENT_FORM_OPTION = [
  { label: 'Short answer', value: EEventFormDetailFormat.text },
  { label: 'Multi choice', value: EEventFormDetailFormat.multiple_choice },
  { label: 'Checkbox', value: EEventFormDetailFormat.single_choice },
  { label: 'Percentage', value: EEventFormDetailFormat.percentage },
  { label: 'Dropdown', value: EEventFormDetailFormat.dropdown },
  { label: 'Date', value: EEventFormDetailFormat.date },
  { label: 'File upload', value: EEventFormDetailFormat.file_upload },
];
