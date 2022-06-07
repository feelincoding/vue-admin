export interface SearchOption {
  type: string;
  label: string;
  target?: string;
  placeholder: string;
  selectOptions?: SelectOptionType[];
}

export interface SelectOptionType {
  label: string;
  value: string;
}

export interface SearchCondition {
  nm?: string;
  id?: string;
  uri?: string;
  athnType?: string;
  tkcgrNm?: string;
  page?: string;
  size?: string;
  sort_by?: string;
  order_by?: string;
}
