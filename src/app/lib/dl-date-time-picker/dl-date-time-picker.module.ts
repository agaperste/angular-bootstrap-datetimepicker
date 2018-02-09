import {NgModule} from '@angular/core';
import {DlDateTimePickerComponent} from './dl-date-time-picker.component';
import {CommonModule} from '@angular/common';
import {DlYearModelComponent} from './dl-year-model.component';
import {DlMinuteModelComponent} from './dl-minute-model.component';
import {DlMonthModelComponent} from './dl-month-model.component';
import {DlDayModelComponent} from './dl-day-model.component';
import {DlHourModelComponent} from './dl-hour-model.component';

@NgModule({
  declarations: [DlDateTimePickerComponent],
  imports: [CommonModule],
  exports: [DlDateTimePickerComponent],
  providers: [
    DlYearModelComponent,
    DlMonthModelComponent,
    DlDayModelComponent,
    DlHourModelComponent,
    DlMinuteModelComponent
  ],
})
export class DlDateTimePickerModule {
}
