import {DlModelProvider} from './dl-model-provider';
import * as momentNs from 'moment';
import {DlDateTimePickerModel} from './dl-date-time-picker-model';
import {Component} from '@angular/core';

/** @internal */
const moment = momentNs;

/**
 * Default implementation for the `minute` view.
 */
@Component({
  providers: [
    {
      provide: DlMinuteModelComponent,
      useClass: DlMinuteModelComponent,
    },
  ],
})
export class DlMinuteModelComponent implements DlModelProvider {

  private step = 5;

  /**
   * Returns the `minute` model for the specified moment in `local` time with the
   * `active` minute set to the beginning of the hour.
   *
   * The `minute` model represents an hour (60 minutes) as three rows with four columns
   * and each cell representing 5-minute increments.
   *
   * The hour always starts at midnight.
   *
   * Each cell represents a 5-minute increment starting at midnight.
   *
   * The `active` minute will be the 5-minute increments less than or equal to the specified milliseconds.
   *
   * @param milliseconds
   *  the moment in time from which the minute model will be created.
   * @returns
   *  the model representing the specified moment in time.
   */
  getModel(milliseconds: number): DlDateTimePickerModel {
    const startDate = moment(milliseconds).startOf('hour');
    const currentMilliseconds = moment().valueOf();

    const minuteSteps = new Array(60 / this.step).fill(0).map((value, index) => index * this.step);
    const minuteValues = minuteSteps.map((minutesToAdd) => moment(startDate).add(minutesToAdd, 'minutes').valueOf());


    const activeMoment = moment(minuteValues.filter((value) => value <= milliseconds).pop());
    const todayMoment = moment(minuteValues.filter((value) => value <= currentMilliseconds).pop());
    const previousHour = moment(startDate).subtract(1, 'hour');
    const nextHour = moment(startDate).add(1, 'hour');

    const rows = new Array(minuteSteps.length / 4)
      .fill(0)
      .map((value, index) => index)
      .map((value) => {
        return {cells: minuteSteps.slice((value * 4), (value * 4) + 4).map(rowOfMinutes)};
      });

    const result: DlDateTimePickerModel = {
      viewName: 'minute',
      viewLabel: startDate.format('lll'),
      activeDate: activeMoment.valueOf(),
      leftButton: {
        value: previousHour.valueOf(),
        ariaLabel: `Go to ${previousHour.format('lll')}`,
        classes: {},
      },
      upButton: {
        value: startDate.valueOf(),
        ariaLabel: `Go to ${startDate.format('ll')}`,
        classes: {},
      },
      rightButton: {
        value: nextHour.valueOf(),
        ariaLabel: `Go to ${nextHour.format('lll')}`,
        classes: {},
      },
      rows
    };

    result.leftButton.classes[`${result.leftButton.value}`] = true;
    result.rightButton.classes[`${result.rightButton.value}`] = true;

    return result;

    function rowOfMinutes(stepMinutes): {
      display: string;
      ariaLabel: string;
      value: number;
      classes: {};
    } {
      const minuteMoment = moment(startDate).add(stepMinutes, 'minutes');
      return {
        display: minuteMoment.format('LT'),
        ariaLabel: minuteMoment.format('LLL'),
        value: minuteMoment.valueOf(),
        classes: {
          today: minuteMoment.isSame(todayMoment, 'minute'),
        }
      };
    }
  }

  /**
   * Move the active `minute` one row `down` from the specified moment in time.
   *
   * Moving `down` can result in the `active` minute being part of a different hour than
   * the specified `fromMilliseconds`, in this case the hour represented by the model
   * will change to show the correct hour.
   *
   * @param fromMilliseconds
   *  the moment in time from which the next `minute` model `down` will be constructed.
   * @returns
   *  model containing an `active` `minute` one row `down` from the specified moment in time.
   */
  goDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(this.step * 4, 'minutes').valueOf());
  }

  /**
   * Move the active `minute` one row `down` from the specified moment in time.
   *
   * Moving `down` can result in the `active` minute being part of a different hour than
   * the specified `fromMilliseconds`, in this case the hour represented by the model
   * will change to show the correct hour.
   *
   * @param fromMilliseconds
   *  the moment in time from which the next `minute` model `down` will be constructed.
   * @returns
   *  model containing an `active` `minute` one row `down` from the specified moment in time.
   */
  goUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(this.step * 4, 'minutes').valueOf());
  }

  /**
   * Move the `active` date one cell to `left` in the current `minute` view.
   *
   * Moving `left` can result in the `active` hour being part of a different hour than
   * the specified `fromMilliseconds`, in this case the hour represented by the model
   * will change to show the correct hour.
   *
   * @param fromMilliseconds
   *  the moment in time from which the `minute` model to the `left` will be constructed.
   * @returns
   *  model containing an `active` `minute` one cell to the `left` of the specified moment in time.
   */
  goLeft(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(this.step, 'minutes').valueOf());
  }

  /**
   * Move `active` minute one cell to `right` in the current `minute` view.
   *
   * Moving `right` can result in the `active` hour being part of a different hour than
   * the specified `fromMilliseconds`, in this case the hour represented by the model
   * will change to show the correct hour.
   *
   * @param fromMilliseconds
   *  the moment in time from which the `minute` model to the `right` will be constructed.
   * @returns
   *  model containing an `active` `minute` one cell to the `right` of the specified moment in time.
   */
  goRight(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(this.step, 'minutes').valueOf());
  }

  /**
   * Move the active `minute` one hour `down` from the specified moment in time.
   *
   * The `active` minute will be `one (1) hour after` the specified milliseconds.
   * This moves the `active` date one `page` `down` from the current `minute` view.
   *
   * The next cell `page-down` will be in a different hour than the currently
   * displayed view and the model time range will include the new active cell.
   *
   * @param fromMilliseconds
   *  the moment in time from which the next `month` model page `down` will be constructed.
   * @returns
   *  model containing an `active` `month` one year `down` from the specified moment in time.
   */
  pageDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(1, 'hour').valueOf());
  }

  /**
   * Move the active `minute` one hour `up` from the specified moment in time.
   *
   * The `active` minute will be `one (1) hour before` the specified milliseconds.
   * This moves the `active` date one `page` `down` from the current `minute` view.
   *
   * The next cell `page-up` will be in a different hour than the currently
   * displayed view and the model time range will include the new active cell.
   *
   * @param fromMilliseconds
   *  the moment in time from which the next `month` model page `down` will be constructed.
   * @returns
   *  model containing an `active` `month` one year `down` from the specified moment in time.
   */
  pageUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(1, 'hour').valueOf());
  }

  /**
   * Move the `active` `minute` to the last cell of the current hour.
   *
   * The view or time range will not change unless the `fromMilliseconds` value
   * is in a different hour than the displayed decade.
   *
   * @param fromMilliseconds
   *  the moment in time from which the last cell will be calculated.
   * @returns
   *  a model with the last cell in the view as the active `minute`.
   */
  goEnd(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds)
      .endOf('hour')
      .valueOf());
  }

  /**
   * Move the `active` `minute` to the first cell of the current hour.
   *
   * The view or time range will not change unless the `fromMilliseconds` value
   * is in a different hour than the displayed decade.
   *
   * @param fromMilliseconds
   *  the moment in time from which the first cell will be calculated.
   * @returns
   *  a model with the first cell in the view as the active `minute`.
   */
  goHome(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).startOf('hour').valueOf());
  }
}
