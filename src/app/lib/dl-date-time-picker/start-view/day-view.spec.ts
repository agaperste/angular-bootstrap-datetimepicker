import {DlDateTimePickerComponent} from '../dl-date-time-picker.component';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import * as moment from 'moment';
import {
  dispatchKeyboardEvent, DOWN_ARROW, END, ENTER, HOME, LEFT_ARROW, PAGE_DOWN, PAGE_UP, RIGHT_ARROW, SPACE,
  UP_ARROW
} from '../../../../testing/dispatch-events';

@Component({

  template: '<dl-date-time-picker startView="day"></dl-date-time-picker>'
})
class DayStartViewComponent {
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

@Component({

  template: '<dl-date-time-picker startView="day" [(ngModel)]="selectedDate"></dl-date-time-picker>'
})
class DayStartViewWithNgModelComponent {
  selectedDate = 1515628800000; // 2018-01-11
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

@Component({
  template: '<dl-date-time-picker startView="month"></dl-date-time-picker>'
})
class YearStartViewComponent {
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
        YearStartViewComponent
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
        expect(dayLabelElement.nativeElement.textContent).toBe(moment.utc().weekday(index).format('dd'));
      });
    });

    it('should contain 42 .day elements', () => {
      const dayElements = fixture.debugElement.queryAll(By.css('.day'));
      expect(dayElements.length).toBe(42);
    });

    it('should contain 1 .today element for the current day', () => {
      const currentElements = fixture.debugElement.queryAll(By.css('.today'));
      expect(currentElements.length).toBe(1);
      expect(currentElements[0].nativeElement.textContent.trim()).toBe(moment.utc().format('D'));
      expect(currentElements[0].nativeElement.classList).toContain(moment.utc().startOf('day').valueOf().toString());
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

    it('should contain 42 .day elements with start of day utc time as class and role of gridcell', () => {

      const expectedClass = [
        1514678400000,
        1514764800000,
        1514851200000,
        1514937600000,
        1515024000000,
        1515110400000,
        1515196800000,
        1515283200000,
        1515369600000,
        1515456000000,
        1515542400000,
        1515628800000,
        1515715200000,
        1515801600000,
        1515888000000,
        1515974400000,
        1516060800000,
        1516147200000,
        1516233600000,
        1516320000000,
        1516406400000,
        1516492800000,
        1516579200000,
        1516665600000,
        1516752000000,
        1516838400000,
        1516924800000,
        1517011200000,
        1517097600000,
        1517184000000,
        1517270400000,
        1517356800000,
        1517443200000,
        1517529600000,
        1517616000000,
        1517702400000,
        1517788800000,
        1517875200000,
        1517961600000,
        1518048000000,
        1518134400000,
        1518220800000
      ];

      const dayElements = fixture.debugElement.queryAll(By.css('.day'));
      expect(dayElements.length).toBe(42);

      dayElements.forEach((dayElement, index) => {
        const key = expectedClass[index];
        const ariaLabel = moment.utc(key).format('ll');
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
      expect(leftButton.nativeElement.classList).toContain('1512086400000');
    });

    it('should switch to previous month value after clicking .left-button', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      leftButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('Dec 2017');

      const dayElements = fixture.debugElement.queryAll(By.css('.day'));
      expect(dayElements[0].nativeElement.textContent.trim()).toBe('26');
      expect(dayElements[0].nativeElement.classList).toContain('1511654400000');
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
      expect(dayElements[0].nativeElement.classList).toContain('1517097600000');
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
      (component.picker as any)._model.activeDate = new Date('2018-01-31').getTime();
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
      (component.picker as any)._model.activeDate = new Date('2018-01-01').getTime();
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
      (component.picker as any)._model.activeDate = new Date('2018-01-01').getTime();
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

    xit('should change .active element to first .day on HOME', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('11');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', HOME);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('1');
    });

    xit('should change .active element to last .day on END', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('11');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', END);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('31');
    });

    xit('should do nothing when hitting non-supported key', () => {
      (component.picker as any)._model.activeDate = new Date('2017-12-01').getTime();
      fixture.detectChanges();

      let activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', 65); // A
      fixture.detectChanges();

      activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');
    });

    xit('should change to .hour-view when hitting ENTER', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', ENTER);
      fixture.detectChanges();

      const dayView = fixture.debugElement.query(By.css('.day-view'));
      expect(dayView).toBeFalsy();

      const hourView = fixture.debugElement.query(By.css('.hour-view'));
      expect(hourView).toBeTruthy();
    });

    xit('should change to .hour-view when hitting SPACE', () => {
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
