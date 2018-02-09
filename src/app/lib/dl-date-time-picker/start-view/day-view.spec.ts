import {DlDateTimePickerComponent} from '../dl-date-time-picker.component';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import * as moment from 'moment';
import {
  dispatchKeyboardEvent,
  DOWN_ARROW,
  END,
  ENTER,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  SPACE,
  UP_ARROW
} from '../../../../testing/dispatch-events';
import {DEC, JAN, NOV} from '../../../../testing/month-constants';
import {DlYearModelComponent} from '../dl-year-model.component';
import {DlMinuteModelComponent} from '../dl-minute-model.component';
import {DlMonthModelComponent} from '../dl-month-model.component';
import {DlDayModelComponent} from '../dl-day-model.component';
import {DlHourModelComponent} from '../dl-hour-model.component';

@Component({
  template: '<dl-date-time-picker></dl-date-time-picker>'
})
class DayStartViewComponent {
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

@Component({
  template: '<dl-date-time-picker [(ngModel)]="selectedDate"></dl-date-time-picker>'
})
class DayStartViewWithNgModelComponent {
  selectedDate = new Date(2018, JAN, 11).getTime();
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

@Component({
  template: '<dl-date-time-picker [startView]="startView"></dl-date-time-picker>'
})
class UndefinedStartViewComponent {
  startView: string;  // intentionally did not assign value
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

describe('DlDateTimePickerComponent startView=day', () => {

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        DlDateTimePickerComponent,
        DayStartViewComponent,
        DayStartViewWithNgModelComponent,
        UndefinedStartViewComponent
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

  describe('default behavior ', () => {
    let component: DayStartViewComponent;
    let fixture: ComponentFixture<DayStartViewComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(DayStartViewComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));

    it('should start with day-view', () => {
      const dayView = fixture.debugElement.query(By.css('.day-view'));
      expect(dayView).toBeTruthy();
    });

    it('should contain 7 .col-label elements', () => {
      const dayLabelElements = fixture.debugElement.queryAll(By.css('.col-label'));
      expect(dayLabelElements.length).toBe(7);
      dayLabelElements.forEach((dayLabelElement, index) => {
        expect(dayLabelElement.nativeElement.textContent).toBe(moment().weekday(index).format('dd'));
      });
    });

    it('should contain 42 .day elements', () => {
      const dayElements = fixture.debugElement.queryAll(By.css('.day'));
      expect(dayElements.length).toBe(42);
    });

    it('should contain 1 .today element for the current day', () => {
      const currentElements = fixture.debugElement.queryAll(By.css('.today'));
      expect(currentElements.length).toBe(1);
      expect(currentElements[0].nativeElement.textContent.trim()).toBe(moment().format('D'));
      expect(currentElements[0].nativeElement.classList).toContain(moment().startOf('day').valueOf().toString());
    });

    it('should contain 1 .active element for the current day', () => {
      const currentElements = fixture.debugElement.queryAll(By.css('.active'));
      expect(currentElements.length).toBe(1);
      expect(currentElements[0].nativeElement.textContent.trim()).toBe(moment().format('D'));
      expect(currentElements[0].nativeElement.classList).toContain(moment().startOf('day').valueOf().toString());
    });
  });

  describe('undefined start view', () => {
    let component: DayStartViewComponent;
    let fixture: ComponentFixture<UndefinedStartViewComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(UndefinedStartViewComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));

    it('should start with day-view', () => {
      const dayView = fixture.debugElement.query(By.css('.day-view'));
      expect(dayView).toBeTruthy();
    });
  });

  describe('ngModel=2018-01-11', () => {
    let component: DayStartViewWithNgModelComponent;
    let fixture: ComponentFixture<DayStartViewWithNgModelComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(DayStartViewWithNgModelComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));

    it('should contain .view-label element with "2018"', () => {
      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Jan 2018');
    });

    it('should contain 1 .past element for Dec 31', () => {
      const pastElement = fixture.debugElement.query(By.css('.past'));
      expect(pastElement.nativeElement.textContent.trim()).toBe('31');
    });

    it('should contain 10 .future elements for February', () => {
      const futureElements = fixture.debugElement.queryAll(By.css('.future'));
      expect(futureElements.length).toBe(10);
      expect(futureElements[0].nativeElement.textContent.trim()).toBe('1');
      expect(futureElements[9].nativeElement.textContent.trim()).toBe('10');
    });

    it('should contain 42 .day elements with start of day utc time as class and role of gridcell', () => {

      const startMoment = moment(new Date(2017, DEC, 31));
      const expectedClass = new Array(42)
        .fill(0)
        .map((value, index) => moment(startMoment).add(index, 'days').valueOf());

      const dayElements = fixture.debugElement.queryAll(By.css('.day'));
      expect(dayElements.length).toBe(42);

      dayElements.forEach((dayElement, index) => {
        const key = expectedClass[index];
        const ariaLabel = moment(key).format('ll');
        expect(dayElement.nativeElement.classList).toContain(key.toString(10));
        expect(dayElement.attributes['role']).toBe('gridcell', index);
        expect(dayElement.attributes['aria-label']).toBe(ariaLabel, index);
      });
    });

    it('.left-button should contain a title', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      expect(leftButton.attributes['title']).toBe('Go to Dec 2017');
    });

    it('.left-button should contain aria-label', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      expect(leftButton.attributes['aria-label']).toBe('Go to Dec 2017');
    });

    it('should have a class for previous month value on .left-button ', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      expect(leftButton.nativeElement.classList).toContain(new Date(2017, DEC, 1).getTime().toString());
    });

    it('should switch to previous month value after clicking .left-button', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      leftButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Dec 2017');

      const dayElements = fixture.debugElement.queryAll(By.css('.day'));
      expect(dayElements[0].nativeElement.textContent.trim()).toBe('26');
      expect(dayElements[0].nativeElement.classList).toContain(new Date(2017, NOV, 26).getTime().toString());
    });

    it('.right-button should contain a title', () => {
      const leftButton = fixture.debugElement.query(By.css('.right-button'));
      expect(leftButton.attributes['title']).toBe('Go to Feb 2018');
    });

    it('.right-button should contain aria-label', () => {
      const leftButton = fixture.debugElement.query(By.css('.right-button'));
      expect(leftButton.attributes['aria-label']).toBe('Go to Feb 2018');
    });

    it('should switch to next month value after clicking .right-button', () => {
      const rightButton = fixture.debugElement.query(By.css('.right-button'));
      rightButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Feb 2018');

      const dayElements = fixture.debugElement.queryAll(By.css('.day'));
      expect(dayElements[0].nativeElement.textContent.trim()).toBe('28');
      expect(dayElements[0].nativeElement.classList).toContain(new Date(2018, JAN, 28).getTime().toString());
    });

    it('.up-button should contain a title', () => {
      const leftButton = fixture.debugElement.query(By.css('.up-button'));
      expect(leftButton.attributes['title']).toBe('Go to month view');
    });

    it('.up-button should contain aria-label', () => {
      const leftButton = fixture.debugElement.query(By.css('.up-button'));
      expect(leftButton.attributes['aria-label']).toBe('Go to month view');
    });

    it('should switch to month view after clicking .up-button', () => {
      const upButton = fixture.debugElement.query(By.css('.up-button'));
      upButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2018');

      const monthView = fixture.debugElement.query(By.css('.month-view'));
      expect(monthView).toBeTruthy();
    });

    it('should not emit a change event when clicking .day', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      const dayElements = fixture.debugElement.queryAll(By.css('.day'));
      dayElements[0].nativeElement.click();
      fixture.detectChanges();

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should change to .hour-view when selecting .day', () => {
      const dayElements = fixture.debugElement.queryAll(By.css('.day'));
      dayElements[0].nativeElement.click(); // 2009
      fixture.detectChanges();

      const dayView = fixture.debugElement.query(By.css('.day-view'));
      expect(dayView).toBeFalsy();

      const hourView = fixture.debugElement.query(By.css('.hour-view'));
      expect(hourView).toBeTruthy();
    });

    it('should have one .active element', () => {
      const activeElements = fixture.debugElement.queryAll(By.css('.active'));
      expect(activeElements.length).toBe(1);
    });

    it('should change .active element on right arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('11');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('12');
    });

    it('should change to next month when last .day is .active element and pressing on right arrow', () => {
      (component.picker as any)._model.activeDate = new Date(2018, JAN, 31).getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.active')).nativeElement, 'keydown', RIGHT_ARROW); // 2018
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('1');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Feb 2018');
    });

    it('should change .active element on left arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('11');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', LEFT_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('10');
    });

    it('should change to previous month when first .day is .active element and pressing on left arrow', () => {
      (component.picker as any)._model.activeDate = new Date(2018, JAN, 1).getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.active')).nativeElement, 'keydown', LEFT_ARROW); // 2019
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('31');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Dec 2017');
    });

    it('should change .active element on up arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('11');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', UP_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('4');
    });

    it('should change to previous month when first .day is .active element and pressing on up arrow', () => {
      (component.picker as any)._model.activeDate = new Date(2018, JAN, 1).getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.active')).nativeElement, 'keydown', UP_ARROW); // 2019
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('25');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Dec 2017');
    });

    it('should change .active element on down arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('11');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', DOWN_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('18');
    });

    it('should change .active element on page-up (fn+up-arrow)', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('11');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', PAGE_UP);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('11');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Dec 2017');
    });

    it('should change .active element on page-down (fn+down-arrow)', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('11');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', PAGE_DOWN);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('11');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Feb 2018');
    });

    it('should change .active element to first .day on HOME', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('11');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', HOME);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('1');
    });

    it('should change .active element to last .day on END', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('11');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', END);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('31');
    });

    it('should do nothing when hitting non-supported key', () => {
      fixture.detectChanges();

      let activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('11');

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', 65); // A
      fixture.detectChanges();

      activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('11');
    });

    it('should change to .hour-view when hitting ENTER', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', ENTER);
      fixture.detectChanges();

      const dayView = fixture.debugElement.query(By.css('.day-view'));
      expect(dayView).toBeFalsy();

      const hourView = fixture.debugElement.query(By.css('.hour-view'));
      expect(hourView).toBeTruthy();
    });

    it('should change to .hour-view when hitting SPACE', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', SPACE);
      fixture.detectChanges();

      const dayView = fixture.debugElement.query(By.css('.day-view'));
      expect(dayView).toBeFalsy();

      const hourView = fixture.debugElement.query(By.css('.hour-view'));
      expect(hourView).toBeTruthy();
    });
  });
});
