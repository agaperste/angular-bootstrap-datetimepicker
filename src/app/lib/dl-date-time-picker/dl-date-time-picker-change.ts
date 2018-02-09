/**
 * Emitted when the value of a date/time picker changes.
 */
export class DlDateTimePickerChange {
  private _value: number;

  /**
   * Constructs a new instance.
   * @param milliseconds
   * the new value of the date/time picker.
   */
  constructor(milliseconds: number) {
    this._value = milliseconds;
  }

  /**
   * Get the new value of the date/time picker.
   * @returns
   *    the new value or null.
   */
  get value() {
    return this._value;
  }
}
