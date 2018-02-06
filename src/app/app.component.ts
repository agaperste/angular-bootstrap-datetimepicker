import {Component, ViewChild} from '@angular/core';
import {DlDateTimePickerComponent} from './lib/dl-date-time-picker/dl-date-time-picker.component';

@Component({
  selector: 'dl-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Dale Lotts\' angular bootstrap date & time picker';
  startView = 'day';
  selectedDate: number;
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}
