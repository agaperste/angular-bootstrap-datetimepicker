import {DlDateTimePickerComponent} from '../dl-date-time-picker.component';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {dispatchKeyboardEvent, ENTER, SPACE} from '../../../../testing/dispatch-events';
import {JAN} from '../../../../testing/month-constants';
import {DlYearModelComponent} from '../dl-year-model.component';
import {DlMinuteModelComponent} from '../dl-minute-model.component';
import {DlMonthModelComponent} from '../dl-month-model.component';
import {DlDayModelComponent} from '../dl-day-model.component';
import {DlHourModelComponent} from '../dl-hour-model.component';

@Component({
  template: '<dl-date-time-picker [(ngModel)]="selectedDate" startView="year" minView="year"></dl-date-time-picker>'
})
class YearSelectorComponent {
  selectedDate: number;
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

describe('DlDateTimePickerComponent', () => {

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        DlDateTimePickerComponent,
        YearSelectorComponent
      ],
      providers: [
        DlYearModelComponent,
        DlMonthModelComponent,
        DlDayModelComponent,
        DlHourModelComponent,
        DlMinuteModelComponent
      ]
    })
      .compileComponents();
  }));

  describe('startView=year', () => {
    let component: YearSelectorComponent;
    let fixture: ComponentFixture<YearSelectorComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(() => {
      fixture = TestBed.createComponent(YearSelectorComponent);
      component = fixture.componentInstance;
      debugElement = fixture.debugElement;
      nativeElement = debugElement.nativeElement;
      fixture.detectChanges();
    });

    it('should be touched when clicking .left-button', () => {
      // ng-untouched/ng-touched requires ngModel
      const pickerElement = fixture.debugElement.query(By.css('dl-date-time-picker')).nativeElement;
      expect(pickerElement.classList).toContain('ng-untouched');

      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      leftButton.nativeElement.click();
      fixture.detectChanges();

      expect(pickerElement.classList).toContain('ng-touched');
    });

    it('should be touched when clicking .right-button', () => {
      // ng-untouched/ng-touched requires ngModel
      const pickerElement = fixture.debugElement.query(By.css('dl-date-time-picker')).nativeElement;
      expect(pickerElement.classList).toContain('ng-untouched');

      const leftButton = fixture.debugElement.query(By.css('.right-button'));
      leftButton.nativeElement.click();
      fixture.detectChanges();

      expect(pickerElement.classList).toContain('ng-touched');
    });

    it('should be touched when clicking .year', () => {
      // ng-untouched/ng-touched requires ngModel
      const pickerElement = fixture.debugElement.query(By.css('dl-date-time-picker')).nativeElement;
      expect(pickerElement.classList).toContain('ng-untouched');

      const yearElement = fixture.debugElement.query(By.css('.year'));
      yearElement.nativeElement.click();
      fixture.detectChanges();

      expect(pickerElement.classList).toContain('ng-touched');
    });

    it('should be dirty when clicking .year', () => {
      const pickerElement = fixture.debugElement.query(By.css('dl-date-time-picker')).nativeElement;
      expect(pickerElement.classList).toContain('ng-untouched');
      expect(pickerElement.classList).toContain('ng-pristine');

      const yearElement = fixture.debugElement.query(By.css('.year'));
      yearElement.nativeElement.click();
      fixture.detectChanges();

      expect(pickerElement.classList).toContain('ng-touched');
      expect(pickerElement.classList).toContain('ng-dirty');
    });

    it('should store the value in ngModel when clicking a .year', () => {
      const yearElements = fixture.debugElement.queryAll(By.css('.year'));
      yearElements[9].nativeElement.click(); // 2019-01-01
      fixture.detectChanges();

      expect(component.selectedDate).toBe(new Date(2019, JAN, 1).getTime());
    });

    it('should store the value internally when clicking a .year', function () {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      const yearElements = fixture.debugElement.queryAll(By.css('.year'));
      yearElements[8].nativeElement.click();  // 2018-01-01
      fixture.detectChanges();

      const expected = new Date(2018, JAN, 1).getTime();
      expect(component.picker.value).toBe(expected);
      expect(changeSpy).toHaveBeenCalled();
      expect(changeSpy.calls.first().args[0].utc).toBe(expected);
    });

    it('should store the value in ngModel when hitting ENTER', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      (component.picker as any)._model.activeDate = new Date('2011-01-01').getTime();
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', ENTER);
      fixture.detectChanges();

      expect(component.picker.value).toBe(1293840000000);
      expect(changeSpy).toHaveBeenCalled();
      expect(changeSpy.calls.first().args[0].utc).toBe(1293840000000);
      expect(component.selectedDate).toBe(1293840000000);
    });

    it('should store the value in ngModel when hitting SPACE', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      (component.picker as any)._model.activeDate = new Date('2011-01-01').getTime();
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', SPACE);
      fixture.detectChanges();

      expect(component.picker.value).toBe(1293840000000);
      expect(changeSpy).toHaveBeenCalled();
      expect(changeSpy.calls.first().args[0].utc).toBe(1293840000000);
      expect(component.selectedDate).toBe(1293840000000);
    });

    it('should not emit change event if value does not change', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      component.picker.value = 1293840000000;
      fixture.detectChanges();

      component.picker.value = 1293840000000;
      fixture.detectChanges();

      expect(component.picker.value).toBe(1293840000000);
      expect(changeSpy).toHaveBeenCalledTimes(1);
      expect(changeSpy.calls.first().args[0].utc).toBe(1293840000000);
      expect(component.selectedDate).toBe(1293840000000);
    });
  });
  // ng-pristine, ng-touched - when should these change?
});
