import {DlDateTimePickerModel} from './dl-date-time-picker-model';

export interface ModelProvider {

  getModel(milliseconds: number): DlDateTimePickerModel;

  goDown(fromMilliseconds: number): DlDateTimePickerModel;

  goEnd(fromMilliseconds: number): DlDateTimePickerModel;

  goHome(fromMilliseconds: number): DlDateTimePickerModel;

  goLeft(fromMilliseconds: number): DlDateTimePickerModel;

  goRight(fromMilliseconds: number): DlDateTimePickerModel;

  goUp(fromMilliseconds: number): DlDateTimePickerModel;

  pageDown(fromMilliseconds: number): DlDateTimePickerModel;

  pageUp(fromMilliseconds: number): DlDateTimePickerModel;
}
