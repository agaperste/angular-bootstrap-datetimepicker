export interface DlDateTimePickerModel {
  view: string;
  viewLabel: string;
  activeDate: number;
  leftButton: {
    value: number;
    ariaLabel: string;
    classes: {};
  };
  upButton?: {
    value: number;
    ariaLabel: string;
    classes: {};
  };
  rightButton: {
    value: number;
    ariaLabel: string;
    classes: {};
  };
  rowLabels?: string[];
  rows: Array<{
    cells: Array<{
      display: string;
      ariaLabel: string;
      value: number;
      classes: {};
    }>
  }>;
}
