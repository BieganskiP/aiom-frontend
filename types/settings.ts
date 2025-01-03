export enum SettingKey {
  COMPANY_RATE_PER_STOP = "company_rate_per_stop",
  COMPANY_CAR_RATE = "company_car_rate",
  PARENT_COMPANY_DISPLAY_NAME = "parent_company_display_name",
  OWN_COMPANY_DISPLAY_NAME = "own_company_display_name",
}

export type NumericSettingKey =
  | SettingKey.COMPANY_RATE_PER_STOP
  | SettingKey.COMPANY_CAR_RATE;

export type StringSettingKey =
  | SettingKey.PARENT_COMPANY_DISPLAY_NAME
  | SettingKey.OWN_COMPANY_DISPLAY_NAME;

export interface Setting {
  key: SettingKey;
  value: number | string;
  description: string;
}

export const isNumericSetting = (key: SettingKey): key is NumericSettingKey => {
  return [
    SettingKey.COMPANY_RATE_PER_STOP,
    SettingKey.COMPANY_CAR_RATE,
  ].includes(key as NumericSettingKey);
};
