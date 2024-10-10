export enum EStatus {
  inactive,
  active,
  pending = -1,
}

export enum ESystemType {
  text,
  number,
  textarea,
  password,
  json,
  file,
}

export enum EUploadType {
  image = 'image/png, image/jpeg',
  document = 'application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export enum EBadWorksType {
  sensitive = 1,
  competitor,
}

export enum EGratitudeVideosStatus {
  draft = 0,
  processing = 1,
  success = 2,
  failed = 3,
}

export enum EGender {
  male = 'male',
  female = 'female',
}

export enum EHCPType {
  NN = 1,
  Referral,
}

export enum EQuestionType {
  single_choice = 1,
  multi_choice,
  rating,
  text,
  percentage,
}

export enum EZaloEventTypes {
  user_send_text = 'user_send_text',
  user_send_gif = 'user_send_gif',
  user_send_image = 'user_send_image',
  user_send_link = 'user_send_link',
  user_send_audio = 'user_send_audio',
  user_send_video = 'user_send_video',
  user_send_sticker = 'user_send_sticker',
  user_send_location = 'user_send_location',
  user_send_business_card = 'user_send_business_card',
  user_send_file = 'user_send_file',
  oa_send_text = 'oa_send_text',
  oa_send_image = 'oa_send_image',
  oa_send_gif = 'oa_send_gif',
  oa_send_list = 'oa_send_list',
  oa_send_file = 'oa_send_file',
  oa_send_sticker = 'oa_send_sticker',
}

export enum EHcpUpdateType {
  system = 1,
  event,
}

// --------------------------------------------------------------

export enum EEventFormDetailType {
  default = 'default',
  custom = 'custom',
}

export enum EEventFormDetailFormat {
  //default
  hco = 'hco',
  specialty = 'specialty',
  gender = 'gender',
  phone = 'phone',
  name = 'name',
  dob = 'dob',
  title = 'title',
  //custom
  multiple_choice = 'multiple_choice',
  text = 'text',
  single_choice = 'single_choice',
  percentage = 'percentage',
  dropdown = 'dropdown',
  date = 'date',
  file_upload = 'file_upload',
}
