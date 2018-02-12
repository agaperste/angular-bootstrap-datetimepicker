import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output} from '@angular/core';
import * as momentNs from 'moment';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {take} from 'rxjs/operators';
import {DlDateTimePickerModel} from './dl-date-time-picker-model';
import {DlModelProvider} from './dl-model-provider';
import {DlYearModelComponent} from './dl-year-model.component';
import {DlMonthModelComponent} from './dl-month-model.component';
import {DlDayModelComponent} from './dl-day-model.component';
import {DlHourModelComponent} from './dl-hour-model.component';
import {DlMinuteModelComponent} from './dl-minute-model.component';
import {DlDateTimePickerChange} from './dl-date-time-picker-change';

/** @internal */
const moment = momentNs;
/** @internal */
const DOWN_ARROW = 40;
/** @internal */
const END = 35;
/** @internal */
const ENTER = 13;
/** @internal */
const HOME = 36;
/** @internal */
const LEFT_ARROW = 37;
/** @internal */
const PAGE_DOWN = 34;
/** @internal */
const PAGE_UP = 33;
/** @internal */
const RIGHT_ARROW = 39;
/** @internal */
const SPACE = 32;
/** @internal */
const UP_ARROW = 38;
/** @internal */
const VIEWS = [
  'minute',
  'hour',
  'day',
  'month',
  'year'
];

/**
 * Component that provides all of the user facing functionality of the date/time picker.
 */

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DlDateTimePickerComponent,
      multi: true
    }
  ],
  selector: 'dl-date-time-picker',
  styleUrls: ['./dl-date-time-picker.component.css'],
  templateUrl: './dl-date-time-picker.component.html',
})
export class DlDateTimePickerComponent implements OnInit, ControlValueAccessor {

  /**
   * Specifies the classes used to display the left icon.
   *
   * This component uses OPENICONIC https://useiconic.com/open
   * by default but any icon library may be used.
   */
  @Input()
  leftIconClass: string | string[] | Set<string> | {} = [
    'oi',
    'oi-chevron-left'
  ];

  /**
   * The highest view that the date/time picker can show.
   * Setting this to a view less than year could make it more
   * difficult for the end-user to navigate to certain dates.
   */
  @Input()
  maxView: 'year' | 'month' | 'day' | 'hour' | 'minute' = 'year';

  /**
   * The view that will be used for date/time selection.
   *
   * The default of `minute  means that selection will not happen
   * until the end-user clicks on a cell in the minute view.
   *
   * for example, if you want the end-user to select a only day (date),
   * setting `minView` to `day` will cause selection to happen when the
   * end-user selects a cell in the day view.
   *
   * NOTE: This must be set lower than or equal to `startView'
   */
  @Input()
  minView: 'year' | 'month' | 'day' | 'hour' | 'minute' = 'minute';


  /**
   * Specifies the classes used to display the right icon.
   *
   * This component uses OPENICONIC https://useiconic.com/open
   * by default but any icon library may be used.
   */
  @Input()
  rightIconClass = [
    'oi',
    'oi-chevron-right'
  ];

  /**
   * The initial view that the date/time picker will show.
   * The picker will also return to this view after a date/time
   * is selected.
   *
   * NOTE: This must be set lower than or equal to `maxView'
   */
  @Input()
  startView: 'year' | 'month' | 'day' | 'hour' | 'minute' = 'day';

  /**
   * Specifies the classes used to display the up icon.
   *
   * This component uses OPENICONIC https://useiconic.com/open
   * by default but any icon library may be used.
   */
  @Input()
  upIconClass = [
    'oi',
    'oi-chevron-top'
  ];

  /**
   * Emits when a `change` event when date/time is selected or
   * the value of the date/time picker changes.
   **/
  @Output()
  readonly change = new EventEmitter<DlDateTimePickerChange>();

  /** @internal */
  private _changed: ((value: number) => void)[] = [];
  /** @internal */
  private _model: DlDateTimePickerModel;
  /** @internal */
  private _touched: (() => void)[] = [];
  /** @internal */
  private _viewToFactory: {
    year: DlModelProvider;
    month: DlModelProvider;
    day: DlModelProvider;
    hour: DlModelProvider;
    minute: DlModelProvider;
  };
  /** @internal */
  private _nextView = {
    'year': 'month',
    'month': 'day',
    'day': 'hour',
    'hour': 'minute'
  };
  /** @internal */
  private _previousView = {
    'minute': 'hour',
    'hour': 'day',
    'day': 'month',
    'month': 'year'
  };

  /**
   * Used to construct a new instance of a date/time picker.
   *
   * @param _elementRef
   *  reference to this element.
   * @param _ngZone
   *  reference to an NgZone instance used to select the active element outside of angular.
   * @param yearModelComponent
   *  provider for the year view model.
   * @param monthModelComponent
   *  provider for the month view model.
   * @param dayModelComponent
   *  provider for the day view model.
   * @param hourModelComponent
   *  provider for the hour view model.
   * @param minuteModelComponent
   *  provider for the minute view model.
   */
  constructor(private _elementRef: ElementRef,
              private _ngZone: NgZone,
              private yearModelComponent: DlYearModelComponent,
              private monthModelComponent: DlMonthModelComponent,
              private dayModelComponent: DlDayModelComponent,
              private hourModelComponent: DlHourModelComponent,
              private minuteModelComponent: DlMinuteModelComponent) {

    this._viewToFactory = {
      year: yearModelComponent,
      month: monthModelComponent,
      day: dayModelComponent,
      hour: hourModelComponent,
      minute: minuteModelComponent,
    };
  }

  /** @internal */
  private _value: number;
  private _startDate: number;

  /**
   *  Start at the view containing startDate when no value is selected.
   */
  @Input()
  set startDate(newStartDate: number) {
    this._startDate = newStartDate;
  }


  /**
   * Returns value of the date/time picker or undefined/null if no value is set.
   **/
  get value() {
    return this._value;
  }

  /**
   * Sets value of the date/time picker and emits a change event if the
   * new value is different from the previous value.
   **/
  set value(value: number) {
    if (this._value !== value) {
      this._value = value;
      this._model = this._viewToFactory[this._model.viewName].getModel(this.getStartDate(), this.value);
      this._changed.forEach(f => f(value));
      this.change.emit(new DlDateTimePickerChange(value));
    }
  }

  /** @internal */
  ngOnInit(): void {
    this._model = this._viewToFactory[this.getStartView()].getModel(this.getStartDate(), this.value);
  }

  /** @internal */
  private getStartDate() {
    if (hasValue(this._value)) {
      return this._value;
    }
    if (hasValue(this._startDate)) {
      return this._startDate;
    }
    return moment().valueOf();
  }

  /** @internal */
  _onDateClick(milliseconds: number) {

    let nextView = this._nextView[this._model.viewName];

    if ((this.minView || 'minute') === this._model.viewName) {
      this.value = milliseconds;
      nextView = this.startView;
    }

    this._model = this._viewToFactory[nextView].getModel(milliseconds, this.value);

    this._onTouch();
  }

  /** @internal */
  _onLeftClick() {
    this._model = this._viewToFactory[this._model.viewName].getModel(this._model.leftButton.value, this.value);
    this._onTouch();
  }

  /** @internal */
  _onUpClick() {
    this._model = this._viewToFactory[this._previousView[this._model.viewName]].getModel(this._model.upButton.value, this.value);
  }

  /** @internal */
  _onRightClick() {
    this._model = this._viewToFactory[this._model.viewName].getModel(this._model.rightButton.value, this.value);
    this._onTouch();
  }

  /** @internal */
  writeValue(value: number) {
    this.value = value;
  }

  /** @internal */
  registerOnChange(fn: (value: number) => void) {
    this._changed.push(fn);
  }

  /** @internal */
  registerOnTouched(fn: () => void) {
    this._touched.push(fn);
  }

  /** @internal */
  _handleKeyDown($event: KeyboardEvent): void {
    const currentViewFactory = this._viewToFactory[this._model.viewName];
    switch ($event.keyCode) {
      case SPACE:
      case ENTER:
        this._onDateClick(this._model.activeDate);
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
        return;
      case PAGE_UP:
        this._model = currentViewFactory.pageUp(this._model.activeDate, this.value);
        break;
      case PAGE_DOWN:
        this._model = currentViewFactory.pageDown(this._model.activeDate, this.value);
        break;
      case END:
        this._model = currentViewFactory.goEnd(this._model.activeDate, this.value);
        break;
      case HOME:
        this._model = currentViewFactory.goHome(this._model.activeDate, this.value);
        break;
      case LEFT_ARROW:
        this._model = currentViewFactory.goLeft(this._model.activeDate, this.value);
        break;
      case RIGHT_ARROW:
        this._model = currentViewFactory.goRight(this._model.activeDate, this.value);
        break;
      case UP_ARROW:
        this._model = currentViewFactory.goUp(this._model.activeDate, this.value);
        break;
      case DOWN_ARROW:
        this._model = currentViewFactory.goDown(this._model.activeDate, this.value);
        break;
      default:
        // Don't prevent default or focus active cell on keys that we don't explicitly handle.
        return;
    }

    this._focusActiveCell();
    // Prevent unexpected default actions such as form submission.
    event.preventDefault();
  }

  /** @internal */
  private getStartView(): string {
    const startIndex = Math.max(VIEWS.indexOf(this.minView || 'minute'), VIEWS.indexOf(this.startView || 'day'));
    return VIEWS[startIndex];
  }

  /** @internal */
  private _onTouch() {
    this._touched.forEach((onTouch) => onTouch());
  }

  /**
   * @internal
   * Focuses the active cell after the microtask queue is empty.
   **/
  private _focusActiveCell() {
    this._ngZone.runOutsideAngular(() => {
      this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
        this._elementRef.nativeElement.querySelector('.active').focus();
      });
    });
  }
}

/** @internal */
function hasValue(value: any): boolean {
  return (typeof value !== 'undefined') && (value !== null);
}
