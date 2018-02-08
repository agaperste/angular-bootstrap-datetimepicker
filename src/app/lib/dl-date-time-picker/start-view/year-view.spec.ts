import {DlDateTimePickerComponent} from '../dl-date-time-picker.component';
import {Component, DebugElement, ViewChild} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
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
import * as moment from 'moment';
import {DEC, JAN} from '../../../../testing/month-constants';

@Component({

  template: '<dl-date-time-picker startView="year"></dl-date-time-picker>'
})
class YearStartViewComponent {
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

@Component({

  template: '<dl-date-time-picker startView="year" [(ngModel)]="selectedDate"></dl-date-time-picker>'
})
class YearStartViewWithNgModelComponent {
  selectedDate = new Date(2017, DEC, 22).getTime();
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

@Component({
  template: '<dl-date-time-picker startView="year" minView="year" maxView="year"></dl-date-time-picker>'
})
class YearSelectorComponent {
  @ViewChild(DlDateTimePickerComponent) picker: DlDateTimePickerComponent;
}

describe('DlDateTimePickerComponent', () => {

  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        DlDateTimePickerComponent,
        YearStartViewComponent,
        YearStartViewWithNgModelComponent,
        YearSelectorComponent]
    })
      .compileComponents();
  }));

  describe('default behavior ', () => {
    let component: YearStartViewComponent;
    let fixture: ComponentFixture<YearStartViewComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(YearStartViewComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));

    it('should start with year-view', () => {
      const monthView = fixture.debugElement.query(By.css('.year-view'));
      expect(monthView).toBeTruthy();
    });

    it('should contain 0 .col-label elements', () => {
      const dayLabelElements = fixture.debugElement.queryAll(By.css('.col-label'));
      expect(dayLabelElements.length).toBe(0);
    });

    it('should contain 10 .year elements', () => {
      const monthElements = fixture.debugElement.queryAll(By.css('.year'));
      expect(monthElements.length).toBe(10);
    });

    it('should contain 1 .today element for the current year', () => {
      const currentElements = fixture.debugElement.queryAll(By.css('.today'));
      expect(currentElements.length).toBe(1);
      expect(currentElements[0].nativeElement.textContent.trim()).toBe(moment().year().toString());
      expect(currentElements[0].nativeElement.classList).toContain(moment().startOf('year').valueOf().toString());
    });

    it('should contain 1 .active element for the current year', () => {
      const currentElements = fixture.debugElement.queryAll(By.css('.active'));
      expect(currentElements.length).toBe(1);
      expect(currentElements[0].nativeElement.textContent.trim()).toBe(moment().year().toString());
      expect(currentElements[0].nativeElement.classList).toContain(moment().startOf('year').valueOf().toString());
    });
  });

  describe('ngModel=2017-12-22', () => {
    let component: YearStartViewWithNgModelComponent;
    let fixture: ComponentFixture<YearStartViewWithNgModelComponent>;
    let debugElement: DebugElement;
    let nativeElement: any;

    beforeEach(async(() => {
      fixture = TestBed.createComponent(YearStartViewWithNgModelComponent);
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        nativeElement = debugElement.nativeElement;
      });
    }));

    it('should contain .view-label element with "2010-2019"', () => {
      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent).toBe('2010-2019');
    });

    it('should contain 10 .year elements with start of year utc time as class and role of gridcell', () => {
      // Truncate the last digit from the current year to get the start of the decade
      const startDecade = (Math.trunc(moment().year() / 10) * 10);

      const expectedClass = new Array(10)
        .fill(0)
        .map((value, index) => new Date(startDecade + index, JAN, 1).getTime().toString());

      const yearElements = fixture.debugElement.queryAll(By.css('.year'));

      yearElements.forEach((yearElement, index) => {
        const key = expectedClass[index];
        expect(yearElement.nativeElement.classList).toContain(key);
        expect(yearElement.attributes['role']).toBe('gridcell', index);
        expect(yearElement.attributes['aria-label']).toBeNull(); // why isn't this undefined?
      });
    });

    it('should have a class for previous decade value on .left-button ', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      const expected = new Date(2000, JAN, 1).getTime();
      expect(leftButton.nativeElement.classList).toContain(expected.toString());
    });

    it('should switch to previous decade value after clicking .left-button', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      leftButton.nativeElement.click();
      fixture.detectChanges();

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent).toBe('2000-2009');

      const yearElements = fixture.debugElement.queryAll(By.css('.year'));
      expect(yearElements[0].nativeElement.textContent.trim()).toBe('2000');
    });

    it('should has a class for next decade on .right-button ', () => {
      const rightButton = fixture.debugElement.query(By.css('.right-button')).nativeElement;
      const expected = new Date(2020, JAN, 1).getTime();
      expect(rightButton.classList).toContain(expected.toString());
    });

    it('should switch to next decade after clicking .right-button', () => {
      const rightButton = fixture.debugElement.query(By.css('.right-button'));
      rightButton.nativeElement.click();
      fixture.detectChanges();

      const yearElements = fixture.debugElement.queryAll(By.css('.year'));
      expect(yearElements[0].nativeElement.textContent.trim()).toBe('2020');
    });

    it('.left-button should have a title', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      expect(leftButton.attributes['title']).toBe('Go to 2000-2009');
    });


    it('.left-button should have arial label', () => {
      const leftButton = fixture.debugElement.query(By.css('.left-button'));
      expect(leftButton.attributes['aria-label']).toBe('Go to 2000-2009');
    });

    it('.right-button should have a title', () => {
      const rightButton = fixture.debugElement.query(By.css('.right-button'));
      expect(rightButton.attributes['title']).toBe('Go to 2020-2029');
    });

    it('.right-button should have aria-label', () => {
      const rightButton = fixture.debugElement.query(By.css('.right-button'));
      expect(rightButton.attributes['aria-label']).toBe('Go to 2020-2029');
    });

    it('should not emit a change event when clicking .year', () => {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      const yearElements = fixture.debugElement.queryAll(By.css('.year'));
      yearElements[9].nativeElement.click(); // 2019
      fixture.detectChanges();

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('should change to .month-view when selecting year', () => {
      const yearElements = fixture.debugElement.queryAll(By.css('.year'));
      yearElements[0].nativeElement.click(); // 2009
      fixture.detectChanges();

      const monthView = fixture.debugElement.query(By.css('.month-view'));
      expect(monthView).toBeTruthy();

      const yearView = fixture.debugElement.query(By.css('.year-view'));
      expect(yearView).toBeFalsy();
    });

    it('should do nothing when hitting non-supported key', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2017');

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', 65); // A
      fixture.detectChanges();

      expect(activeElement.nativeElement.textContent).toBe('2017');
    });

    it('should change to .month-view when hitting ENTER', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', ENTER);
      fixture.detectChanges();

      const monthView = fixture.debugElement.query(By.css('.month-view'));
      expect(monthView).toBeTruthy();

      const yearView = fixture.debugElement.query(By.css('.year-view'));
      expect(yearView).toBeFalsy();
    });

    it('should change to .month-view when hitting SPACE', () => {
      (component.picker as any)._model.activeDate = new Date(2011, JAN, 1).getTime();
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', SPACE);
      fixture.detectChanges();

      const monthView = fixture.debugElement.query(By.css('.month-view'));
      expect(monthView).toBeTruthy();

      const yearView = fixture.debugElement.query(By.css('.year-view'));
      expect(yearView).toBeFalsy();
    });

    it('should have one .active element', () => {
      const activeElements = fixture.debugElement.queryAll(By.css('.active'));
      expect(activeElements.length).toBe(1);
    });

    it('should change .active element on right arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2017');

      activeElement.nativeElement.focus();
      expect(document.activeElement).toBe(activeElement.nativeElement, document.activeElement.outerHTML);

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', RIGHT_ARROW);

      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2018');
    });

    it('should change to next decade when last .year is .active element and pressing on right arrow', () => {
      (component.picker as any)._model.activeDate = new Date(2019, JAN, 1).getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.active')).nativeElement, 'keydown', RIGHT_ARROW); // 2019
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2020');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent).toBe('2020-2029');
    });

    it('should change .active element on left arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2017');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', LEFT_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2016');
    });

    it('should change to previous decade when first .year is .active element and pressing on left arrow', () => {
      (component.picker as any)._model.activeDate = new Date(2010, JAN, 1).getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.active')).nativeElement, 'keydown', LEFT_ARROW); // 2019
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2009');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent).toBe('2000-2009');
    });

    it('should change .active element on up arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2017');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', UP_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2012');
    });

    it('should change to previous decade when first .year is .active element and pressing on up arrow', () => {
      (component.picker as any)._model.activeDate = new Date(2014, JAN, 1).getTime();
      fixture.detectChanges();

      dispatchKeyboardEvent(fixture.debugElement.query(By.css('.active')).nativeElement, 'keydown', UP_ARROW); // 2019
      fixture.detectChanges();

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2009');

      const viewLabel = fixture.debugElement.query(By.css('.view-label'));
      expect(viewLabel.nativeElement.textContent).toBe('2000-2009');
    });

    it('should change .active element on down arrow', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2017');

      activeElement.nativeElement.focus();

      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', DOWN_ARROW);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2022');
    });

    it('should change .active element on page-up (fn+up-arrow)', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2017');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', PAGE_UP);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2007');
    });

    it('should change .active element on page-down (fn+down-arrow)', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2017');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', PAGE_DOWN);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2027');
    });

    it('should change .active element to first .year on HOME', () => {
      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2017');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', HOME);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2010');
    });

    it('should change .active element to last .year on END', () => {
      debugElement.nativeElement.dispatchEvent(new Event('input'));

      const activeElement = fixture.debugElement.query(By.css('.active'));
      expect(activeElement.nativeElement.textContent).toBe('2017');

      activeElement.nativeElement.focus();
      dispatchKeyboardEvent(activeElement.nativeElement, 'keydown', END);
      fixture.detectChanges();

      const newActiveElement = fixture.debugElement.query(By.css('.active'));
      expect(newActiveElement.nativeElement.textContent).toBe('2019');
    });
  });

  describe('year selector (minView=year)', () => {
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

    it('should store the value and emit change event when clicking a .year', function () {
      const changeSpy = jasmine.createSpy('change listener');
      component.picker.change.subscribe(changeSpy);

      const yearElements = fixture.debugElement.queryAll(By.css('.year'));
      yearElements[0].nativeElement.click();
      fixture.detectChanges();

      // Truncate the last digit from the current year to get the start of the decade
      const startDecade = (Math.trunc(moment().year() / 10) * 10);

      const expectedTime = new Date(startDecade, JAN, 1).getTime();
      expect(component.picker.value).toBe(expectedTime);
      expect(changeSpy).toHaveBeenCalled();
      expect(changeSpy.calls.first().args[0].utc).toBe(expectedTime);
    });
  });
});
