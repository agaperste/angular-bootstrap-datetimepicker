import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output} from '@angular/core';
import * as moment from 'moment';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {take} from 'rxjs/operators';
import {DlDateTimePickerModel} from './dl-date-time-picker-model';
import {ModelProvider} from './model-provider';
import {YearModelProvider} from './year-model-provider';
import {MonthModelProvider} from './month-model-provider';
import {DayModelProvider} from './day-model-provider';
import {HourModelProvider} from './hour-model-provider';
import {MinuteModelProvider} from './minute-model-provider';

const DOWN_ARROW = 40;
const END = 35;
const ENTER = 13;
const HOME = 36;
const LEFT_ARROW = 37;
const PAGE_DOWN = 34;
const PAGE_UP = 33;
const RIGHT_ARROW = 39;
const SPACE = 32;
const UP_ARROW = 38;
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
    YearModelProvider,
    MonthModelProvider,
    DayModelProvider,
    HourModelProvider,
    MinuteModelProvider
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


  private _changed: ((value: number) => void)[] = [];
  private _model: DlDateTimePickerModel;
  private _touched: (() => void)[] = [];
  private _value: number;

  private _viewToFactory: {
    year: ModelProvider;
    month: ModelProvider;
    day: ModelProvider;
    hour: ModelProvider;
    minute: ModelProvider;
  };

  private _nextView = {
    'year': 'month',
    'month': 'day',
    'day': 'hour',
    'hour': 'minute'
  };

  private _previousView = {
    'minute': 'hour',
    'hour': 'day',
    'day': 'month',
    'month': 'year'
  };

  constructor(private _elementRef: ElementRef,
              private _ngZone: NgZone,
              private yearModelProvider: YearModelProvider,
              private monthModelProvider: MonthModelProvider,
              private dayModelProvider: DayModelProvider,
              private hourModelProvider: HourModelProvider,
              private minuteModelProvider: MinuteModelProvider) {

    this._viewToFactory = {
      year: yearModelProvider,
      month: monthModelProvider,
      day: dayModelProvider,
      hour: hourModelProvider,
      minute: minuteModelProvider,
    };
  }

  ngOnInit(): void {
    this._model = this._viewToFactory[this._getStartView()].getModel(moment.utc().valueOf());
  }

  private _getStartView(): string {
    const startIndex = Math.max(VIEWS.indexOf(this.minView || 'minute'), VIEWS.indexOf(this.startView || 'day'));
    return VIEWS[startIndex];
  }

  _onDateClick(milliseconds: number) {

    let nextView = this._nextView[this._model.view];

    if ((this.minView || 'minute') === this._model.view) {
      this.value = milliseconds;
      nextView = this.startView;
    }

    this._model = this._viewToFactory[nextView].getModel(milliseconds);

    this._onTouch();
  }

  _onLeftClick() {
    this._model = this._viewToFactory[this._model.view].getModel(this._model.leftButton.value);
    this._onTouch();
  }

  _onUpClick() {
    this._model = this._viewToFactory[this._previousView[this._model.view]].getModel(this._model.upButton.value);
  }

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
      this._model = this._viewToFactory[this._model.view].getModel(hasValue(this._value) ? this._value : moment.utc().valueOf());
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

  private _onTouch() {
    this._touched.forEach((onTouch) => onTouch());
  }

  _isActiveCell(value: number) {
    return this._model.activeDate === value;
  }

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

  /** Focuses the active cell after the microtask queue is empty. */
  private _focusActiveCell() {
    this._ngZone.runOutsideAngular(() => {
      this._ngZone.onStable.asObservable().pipe(take(1)).subscribe(() => {
        this._elementRef.nativeElement.querySelector('.active').focus();
      });
    });
  }
}

function hasValue(value: any): boolean {
  return (typeof value !== 'undefined') && (value !== null);
}
