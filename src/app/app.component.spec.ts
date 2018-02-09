import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DlDateTimePickerComponent } from './lib/dl-date-time-picker/dl-date-time-picker.component';
import {FormsModule} from '@angular/forms';
import {DlYearModelComponent} from './lib/dl-date-time-picker/dl-year-model.component';
import {DlMinuteModelComponent} from './lib/dl-date-time-picker/dl-minute-model.component';
import {DlMonthModelComponent} from './lib/dl-date-time-picker/dl-month-model.component';
import {DlDayModelComponent} from './lib/dl-date-time-picker/dl-day-model.component';
import {DlHourModelComponent} from './lib/dl-date-time-picker/dl-hour-model.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        AppComponent,
        DlDateTimePickerComponent
      ],
      providers: [
        DlYearModelComponent,
        DlMonthModelComponent,
        DlDayModelComponent,
        DlHourModelComponent,
        DlMinuteModelComponent
      ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'app'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Dale Lotts\' angular bootstrap date & time picker');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to Dale Lotts\' angular bootstrap date & time picker!');
  }));
});
