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
  template: '<dl-date-time-picker startView="month"></dl-date-time-picker>'
})
class MonthStartViewComponent {
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

@Component({

  template: '<dl-date-time-picker startView="month" [(ngModel)]="selectedDate"></dl-date-time-picker>'
})
class MonthStartViewWithNgModelComponent {
  selectedDate = 1514160000000; // 2017-12-22
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

describe('DlDateTimePickerComponent startView=month', () => {

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        DlDateTimePickerComponent,
        MonthStartViewComponent,
        MonthStartViewWithNgModelComponent
      ]
    })
      .compileComponents();
  }));

  describe('default behavior ', () => {
    let component: MonthStartViewComponent;
    let fixture: ComponentFixture<MonthStartViewComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(MonthStartViewComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));

    it('should start with month-view', () => {
      const monthView = fixture.debugElement.query(By.css('.month-view'));
      expect(monthView).toBeTruthy();
    });

    it('should contain 0 .col-label elements', () => {
      const dayLabelElements = fixture.debugElement.queryAll(By.css('.col-label'));
      expect(dayLabelElements.length).toBe(0);
    });

    it('should contain 12 .month elements', () => {
      const monthElements = fixture.debugElement.queryAll(By.css('.month'));
      expect(monthElements.length).toBe(12);
    });

    it('should contain 1 .today element for the current month', () => {
      const currentElements = fixture.debugElement.queryAll(By.css('.today'));
      expect(currentElements.length).toBe(1);
      expect(currentElements[0].nativeElement.textContent.trim()).toBe(moment.utc().format('MMM'));
      expect(currentElements[0].nativeElement.classList).toContain(moment.utc().startOf('month').valueOf().toString());
    });

    it('should contain 1 .active element for the current month', () => {
      const currentElements = fixture.debugElement.queryAll(By.css('.active'));
      expect(currentElements.length).toBe(1);
      expect(currentElements[0].nativeElement.textContent.trim()).toBe(moment.utc().format('MMM'));
      expect(currentElements[0].nativeElement.classList).toContain(moment.utc().startOf('month').valueOf().toString());
    });
  });

  describe('ngModel=2017-12-22', () => {
    let component: MonthStartViewWithNgModelComponent;
    let fixture: ComponentFixture<MonthStartViewWithNgModelComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(MonthStartViewWithNgModelComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));


    it('should contain .view-label element with "2017"', () => {
      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2017');
    });

    it('should contain 12 .month elements with start of month utc time as class and role of gridcell', () => {

      const expectedClass = [
        1483228800000,
        1485907200000,
        1488326400000,
        1491004800000,
        1493596800000,
        1496275200000,
        1498867200000,
        1501545600000,
        1504224000000,
        1506816000000,
        1509494400000,
        1512086400000
      ];

      const monthElements = fixture.debugElement.queryAll(By.css('.month'));
      expect(monthElements.length).toBe(12);

      monthElements.forEach((monthElement, index) => {
        const key = expectedClass[index];
        const ariaLabel = moment.utc(key).format('MMM YYYY');
        expect(monthElement.nativeElement.classList).toContain(key.toString(10));
        expect(monthElement.attributes['role']).toBe('gridcell', index);
        expect(monthElement.attributes['aria-label']).toBe(ariaLabel, index);
      });
    });

    it('.left-button should contain a title', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      expect(leftButton.attributes['title']).toBe('Go to 2016');
    });

    it('.left-button should contain aria-label', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      expect(leftButton.attributes['aria-label']).toBe('Go to 2016');
    });

    it('should have a class for previous year value on .left-button ', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      expect(leftButton.nativeElement.classList).toContain('1451606400000');
    });

    it('should switch to previous year value after clicking .left-button', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      leftButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2016');

      const monthElements = fixture.debugElement.queryAll(By.css('.month'));
      expect(monthElements[0].nativeElement.textContent.trim()).toBe('Jan');
      expect(monthElements[0].nativeElement.classList).toContain('1451606400000');
    });

    it('.right-button should contain a title', () => {
      const leftButton = fixture.debugElement.query(By.css('.right-button'));
      expect(leftButton.attributes['title']).toBe('Go to 2018');
    });

    it('.right-button should contain aria-label', () => {
      const leftButton = fixture.debugElement.query(By.css('.right-button'));
      expect(leftButton.attributes['aria-label']).toBe('Go to 2018');
    });

    it('should have a class for previous year value on .right-button ', () => {
      const leftButton = fixture.debugElement.query(By.css('.right-button'));
      expect(leftButton.nativeElement.classList).toContain('1514764800000');
    });

    it('should switch to next year value after clicking .right-button', () => {
      const rightButton = fixture.debugElement.query(By.css('.right-button'));
      rightButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2018');

      const monthElements = fixture.debugElement.queryAll(By.css('.month'));
      expect(monthElements[0].nativeElement.textContent.trim()).toBe('Jan');
      expect(monthElements[0].nativeElement.classList).toContain('1514764800000');
    });

    it('.up-button should contain a title', () => {
      const leftButton = fixture.debugElement.query(By.css('.up-button'));
      expect(leftButton.attributes['title']).toBe('Go to 2017');
    });

    it('.up-button should contain aria-label', () => {
      const leftButton = fixture.debugElement.query(By.css('.up-button'));
      expect(leftButton.attributes['aria-label']).toBe('Go to 2017');
    });

    it('should switch to year view after clicking .up-button', () => {
      const upButton = fixture.debugElement.query(By.css('.up-button'));
      upButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent).toBe('2010-2019');

      const yearView = fixture.debugElement.query(By.css('.year-view'));
      expect(yearView).toBeTruthy();
    });

    it('should not emit a change event when clicking .month', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      const monthElements = fixture.debugElement.queryAll(By.css('.month'));
      monthElements[9].nativeElement.click(); // OCT
      fixture.detectChanges();

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should change to .day-view when selecting .month', () => {
      const monthElements = fixture.debugElement.queryAll(By.css('.month'));
      monthElements[0].nativeElement.click(); // 2009
      fixture.detectChanges();

      const monthView = fixture.debugElement.query(By.css('.month-view'));
      expect(monthView).toBeFalsy();

      const dayView = fixture.debugElement.query(By.css('.day-view'));
      expect(dayView).toBeTruthy();
    });

    it('should have one .active element', () => {
      const activeElements = fixture.debugElement.queryAll(By.css('.active'));
      expect(activeElements.length).toBe(1);
    });

    it('should change .active element on right arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', RIGHT_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('Jan');
    });

    it('should change to next year when last .month is .active element and pressing on right arrow', () => {
      (component.picker as any)._model.activeDate = new Date('2017-12-01').getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.active')).nativeElement, 'keydown', RIGHT_ARROW); // 2018
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Jan');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2018');
    });

    it('should change .active element on left arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', LEFT_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('Nov');
    });

    it('should change to previous year when first .month is .active element and pressing on left arrow', () => {
      (component.picker as any)._model.activeDate = new Date('2017-01-01').getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.active')).nativeElement, 'keydown', LEFT_ARROW); // 2019
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2016');
    });

    it('should change .active element on up arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', UP_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('Aug');
    });

    it('should change to previous year when first .month is .active element and pressing on up arrow', () => {
      (component.picker as any)._model.activeDate = new Date('2017-01-01').getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.active')).nativeElement, 'keydown', UP_ARROW); // 2019
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Sep');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2016');
    });

    it('should change .active element on down arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', DOWN_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('Apr');
    });

    it('should change .active element on page-up (fn+up-arrow)', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', PAGE_UP);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('Dec');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2016');
    });

    it('should change .active element on page-down (fn+down-arrow)', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', PAGE_DOWN);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('Dec');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent.trim()).toBe('2018');
    });

    it('should change .active element to first .month on HOME', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', HOME);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('Jan');
    });

    it('should change .active element to last .month on END', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', END);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('Dec');
    });

    it('should do nothing when hitting non-supported key', () => {
      (component.picker as any)._model.activeDate = new Date('2017-12-01').getTime();
      fixture.detectChanges();

      let activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', 65); // A
      fixture.detectChanges();

      activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('Dec');
    });

    it('should change to .day-view when hitting ENTER', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', ENTER);
      fixture.detectChanges();

      const monthView = fixture.debugElement.query(By.css('.month-view'));
      expect(monthView).toBeFalsy();

      const dayView = fixture.debugElement.query(By.css('.day-view'));
      expect(dayView).toBeTruthy();
    });

    it('should change to .day-view when hitting SPACE', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', SPACE);
      fixture.detectChanges();

      const monthView = fixture.debugElement.query(By.css('.month-view'));
      expect(monthView).toBeFalsy();

      const dayView = fixture.debugElement.query(By.css('.day-view'));
      expect(dayView).toBeTruthy();
    });
  });
});
