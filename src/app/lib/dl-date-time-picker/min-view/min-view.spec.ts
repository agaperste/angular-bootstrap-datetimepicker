import {DlDateTimePickerComponent} from '../dl-date-time-picker.component';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

@Component({
  template: '<dl-date-time-picker minView="year" [(ngModel)]="selectedDate"></dl-date-time-picker>'
})
class YearMinViewComponent {
  selectedDate: number;
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

@Component({
  template: '<dl-date-time-picker minView="month" [(ngModel)]="selectedDate"></dl-date-time-picker>'
})
class MonthMinViewComponent {
  selectedDate: number;
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

@Component({
  template: '<dl-date-time-picker minView="day" [(ngModel)]="selectedDate"></dl-date-time-picker>'
})
class DayMinViewComponent {
  selectedDate: number;
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

@Component({
  template: '<dl-date-time-picker minView="hour" [(ngModel)]="selectedDate"></dl-date-time-picker>'
})
class HourMinViewComponent {
  selectedDate: number;
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

@Component({
  template: '<dl-date-time-picker minView="minute" [(ngModel)]="selectedDate"></dl-date-time-picker>'
})
class MinuteMinViewComponent {
  selectedDate: number;
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

@Component({
  template: '<dl-date-time-picker [minView]="minView" [(ngModel)]="selectedDate"></dl-date-time-picker>'
})
class UndefinedMinViewComponent {
  minView: string;  // intentionally did not assign value
  selectedDate: number;
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

describe('DlDateTimePickerComponent minView', () => {

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        DlDateTimePickerComponent,
        YearMinViewComponent,
        MonthMinViewComponent,
        DayMinViewComponent,
        HourMinViewComponent,
        MinuteMinViewComponent,
        UndefinedMinViewComponent,
      ]
    })
      .compileComponents();
  }));

  describe('year', () => {
    let component: YearMinViewComponent;
    let fixture: ComponentFixture<YearMinViewComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(YearMinViewComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));

    it('should start with year-view', () => {
      // no other options are specified and year-view is a higher level view than
      // day-view (the default start view)
      const monthView = fixture.debugElement.query(By.css('.year-view'));
      expect(monthView).toBeTruthy();
    });

    it('should store the value in ngModel when clicking a .year', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      expect(component.picker.value).toBeUndefined();

      const monthElements = fixture.debugElement.queryAll(By.css('.year'));
      monthElements[2].nativeElement.click();
      fixture.detectChanges();

      expect(component.picker.value).not.toBeUndefined();
      expect(component.picker.value).toBe(component.selectedDate);
      expect(changeSpy).toHaveBeenCalled();
    });
  });

  describe('month', () => {
    let component: MonthMinViewComponent;
    let fixture: ComponentFixture<MonthMinViewComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(MonthMinViewComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));

    it('should start with month-view', () => {
      // no other options are specified and month-view is a higher level view than
      // day view (the default start view)
      const monthView = fixture.debugElement.query(By.css('.month-view'));
      expect(monthView).toBeTruthy();
    });

    it('should store the value in ngModel when clicking a .month', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      expect(component.picker.value).toBeUndefined();

      const monthElements = fixture.debugElement.queryAll(By.css('.month'));
      monthElements[9].nativeElement.click();
      fixture.detectChanges();

      expect(component.picker.value).not.toBeUndefined();
      expect(component.picker.value).toBe(component.selectedDate);
      expect(changeSpy).toHaveBeenCalled();
    });
  });

  describe('day', () => {
    let component: DayMinViewComponent;
    let fixture: ComponentFixture<DayMinViewComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(DayMinViewComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));

    it('should start with day-view', () => {
      // no other options are specified and month-view is a higher level view than
      // day view (the default start view)
      const monthView = fixture.debugElement.query(By.css('.day-view'));
      expect(monthView).toBeTruthy();
    });

    it('should store the value in ngModel when clicking a .day', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      expect(component.picker.value).toBeUndefined();

      const monthElements = fixture.debugElement.queryAll(By.css('.day'));
      monthElements[22].nativeElement.click();
      fixture.detectChanges();

      expect(component.picker.value).not.toBeUndefined();
      expect(component.picker.value).toBe(component.selectedDate);
      expect(changeSpy).toHaveBeenCalled();
    });
  });

  describe('hour', () => {
    let component: HourMinViewComponent;
    let fixture: ComponentFixture<HourMinViewComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(HourMinViewComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));

    it('should start with day-view', () => {
      // day-view (the default start view) is a higher level view than hour-view
      const monthView = fixture.debugElement.query(By.css('.day-view'));
      expect(monthView).toBeTruthy();
    });

    it('should store the value in ngModel when clicking a .hour', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      expect(component.picker.value).toBeUndefined();

      const monthElements = fixture.debugElement.queryAll(By.css('.day'));
      monthElements[19].nativeElement.click();
      fixture.detectChanges();

      expect(component.picker.value).toBeUndefined();
      expect(component.picker.value).toBeUndefined();
      expect(changeSpy).not.toHaveBeenCalled();

      const hourElements = fixture.debugElement.queryAll(By.css('.hour'));
      hourElements[11].nativeElement.click();
      fixture.detectChanges();

      expect(component.picker.value).not.toBeUndefined();
      expect(component.picker.value).toBe(component.selectedDate);
      expect(changeSpy).toHaveBeenCalled();
    });
  });

  describe('minute', () => {
    let component: MinuteMinViewComponent;
    let fixture: ComponentFixture<MinuteMinViewComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(MinuteMinViewComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));

    it('should start with day-view', () => {
      // day-view (the default start view) is a higher level view than hour-view
      const monthView = fixture.debugElement.query(By.css('.day-view'));
      expect(monthView).toBeTruthy();
    });

    it('should store the value in ngModel when clicking a .minute', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      expect(component.picker.value).toBeUndefined();

      const monthElements = fixture.debugElement.queryAll(By.css('.day'));
      monthElements[19].nativeElement.click();
      fixture.detectChanges();

      expect(component.picker.value).toBeUndefined();
      expect(component.picker.value).toBeUndefined();
      expect(changeSpy).not.toHaveBeenCalled();

      const hourElements = fixture.debugElement.queryAll(By.css('.hour'));
      hourElements[11].nativeElement.click();
      fixture.detectChanges();

      expect(component.picker.value).toBeUndefined();
      expect(component.picker.value).toBeUndefined();
      expect(changeSpy).not.toHaveBeenCalled();

      const minuteElements = fixture.debugElement.queryAll(By.css('.minute'));
      minuteElements[7].nativeElement.click();
      fixture.detectChanges();

      expect(component.picker.value).not.toBeUndefined();
      expect(component.picker.value).toBe(component.selectedDate);
      expect(changeSpy).toHaveBeenCalled();
    });
  });

  describe('undefined', () => {
    let component: UndefinedMinViewComponent;
    let fixture: ComponentFixture<UndefinedMinViewComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(UndefinedMinViewComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));

    it('should start with day-view', () => {
      // day-view (the default start view) is a higher level view than hour-view
      const monthView = fixture.debugElement.query(By.css('.day-view'));
      expect(monthView).toBeTruthy();
    });

    it('should store the value in ngModel when clicking a .minute', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      expect(component.picker.value).toBeUndefined();

      const monthElements = fixture.debugElement.queryAll(By.css('.day'));
      monthElements[19].nativeElement.click();
      fixture.detectChanges();

      expect(component.picker.value).toBeUndefined();
      expect(component.picker.value).toBeUndefined();
      expect(changeSpy).not.toHaveBeenCalled();

      const hourElements = fixture.debugElement.queryAll(By.css('.hour'));
      hourElements[11].nativeElement.click();
      fixture.detectChanges();

      expect(component.picker.value).toBeUndefined();
      expect(component.picker.value).toBeUndefined();
      expect(changeSpy).not.toHaveBeenCalled();

      const minuteElements = fixture.debugElement.queryAll(By.css('.minute'));
      minuteElements[7].nativeElement.click();
      fixture.detectChanges();

      expect(component.picker.value).not.toBeUndefined();
      expect(component.picker.value).toBe(component.selectedDate);
      expect(changeSpy).toHaveBeenCalled();
    });
  });
});
