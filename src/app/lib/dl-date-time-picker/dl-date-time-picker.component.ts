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

export class DlDateTimePickerChange {
  utc: number;

  constructor(milliseconds: number) {
    this.utc = milliseconds;
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DlDateTimePickerComponent,
      multi: true
    },
    DlYearModelComponent,
    DlMonthModelComponent,
    DlDayModelComponent,
    DlHourModelComponent,
    DlMinuteModelComponent
  ],
  selector: 'dl-date-time-picker',
  styleUrls: ['./dl-date-time-picker.component.css'],
  templateUrl: './dl-date-time-picker.component.html',
})
export class DlDateTimePickerComponent implements OnInit, ControlValueAccessor {

  @Input()
  maxView: 'year' | 'month' | 'day' | 'hour' | 'minute';

  @Input()
  startView: 'year' | 'month' | 'day' | 'hour' | 'minute' = 'day';

  @Input()
  minView: 'year' | 'month' | 'day' | 'hour' | 'minute' = 'minute';

  @Input()
  leftIconClass: string | string[] | Set<string> | {} = [
    'oi',
    'oi-chevron-left'
  ];

  @Input()
  upIconClass = [
    'oi',
    'oi-chevron-top'
  ];

  @Input()
  rightIconClass = [
    'oi',
    'oi-chevron-right'
  ];


  /** Emits when a `change` event is fired on this date/time picker. */
  @Output()
  readonly change = new EventEmitter<DlDateTimePickerChange>();


  /** @internal */
  private _changed: ((value: number) => void)[] = [];
  /** @internal */
  private _model: DlDateTimePickerModel;
  /** @internal */
  private _touched: (() => void)[] = [];
  /** @internal */
  private _value: number;

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

  ngOnInit(): void {
    this._model = this._viewToFactory[this._getStartView()].getModel(moment().valueOf());
  }

  /** @internal */
  private _getStartView(): string {
    const startIndex = Math.max(VIEWS.indexOf(this.minView || 'minute'), VIEWS.indexOf(this.startView || 'day'));
    return VIEWS[startIndex];
  }

  /** @internal */
  _onDateClick(milliseconds: number) {

    let nextView = this._nextView[this._model.view];

    if ((this.minView || 'minute') === this._model.view) {
      this.value = milliseconds;
      nextView = this.startView;
    }

    this._model = this._viewToFactory[nextView].getModel(milliseconds);

    this._onTouch();
  }

  /** @internal */
  _onLeftClick() {
    this._model = this._viewToFactory[this._model.view].getModel(this._model.leftButton.value);
    this._onTouch();
  }

  /** @internal */
  _onUpClick() {
    this._model = this._viewToFactory[this._previousView[this._model.view]].getModel(this._model.upButton.value);
  }

  /** @internal */
  _onRightClick() {
    this._model = this._viewToFactory[this._model.view].getModel(this._model.rightButton.value);
    this._onTouch();
  }

  get value() {
    return this._value;
  }

  set value(value: number) {
    if (this._value !== value) {
      this._value = value;
      this._model = this._viewToFactory[this._model.view].getModel(hasValue(this._value) ? this._value : moment().valueOf());
      this._changed.forEach(f => f(value));
      this.change.emit(new DlDateTimePickerChange(value));
    }
  }

  writeValue(value: number) {
    this.value = value;
  }

  registerOnChange(fn: (value: number) => void) {
    this._changed.push(fn);
  }

  registerOnTouched(fn: () => void) {
    this._touched.push(fn);
  }

  /** @internal */
  private _onTouch() {
    this._touched.forEach((onTouch) => onTouch());
  }

  /** @internal */
  _isActiveCell(value: number) {
    return this._model.activeDate === value;
  }

  /** @internal */
  _handleKeyDown($event: KeyboardEvent): void {
    const currentViewFactory = this._viewToFactory[this._model.view];
    switch ($event.keyCode) {
      case SPACE:
      case ENTER:
        this._onDateClick(this._model.activeDate);
        // Prevent unexpected default actions such as form submission.
        event.preventDefault();
        return;
      case PAGE_UP:
        this._model = currentViewFactory.pageUp(this._model.activeDate);
        break;
      case PAGE_DOWN:
        this._model = currentViewFactory.pageDown(this._model.activeDate);
        break;
      case END:
        this._model = currentViewFactory.goEnd(this._model.activeDate);
        break;
      case HOME:
        this._model = currentViewFactory.goHome(this._model.activeDate);
        break;
      case LEFT_ARROW:
        this._model = currentViewFactory.goLeft(this._model.activeDate);
        break;
      case RIGHT_ARROW:
        this._model = currentViewFactory.goRight(this._model.activeDate);
        break;
      case UP_ARROW:
        this._model = currentViewFactory.goUp(this._model.activeDate);
        break;
      case DOWN_ARROW:
        this._model = currentViewFactory.goDown(this._model.activeDate);
        break;
      default:
        // Don't prevent default or focus active cell on keys that we don't explicitly handle.
        return;
    }

    this._focusActiveCell();
    // Prevent unexpected default actions such as form submission.
    event.preventDefault();
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
