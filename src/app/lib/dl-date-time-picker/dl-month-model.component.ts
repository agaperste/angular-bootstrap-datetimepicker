import {DlModelProvider} from './dl-model-provider';
import * as momentNs from 'moment';
import {DlDateTimePickerModel} from './dl-date-time-picker-model';
import {Component} from '@angular/core';

/** @internal */
const moment = momentNs;

/**
 * Default implementation for the `month` view.
 */
@Component({
  providers: [
    {
      provide: DlMonthModelComponent,
      useClass: DlMonthModelComponent,
    },
  ],
})
export class DlMonthModelComponent implements DlModelProvider {

  /**
   * Returns the `month` model for the specified moment in `local` time with the
   * `active` month set to the first day of the specified month.
   *
   * The `month` model represents a year (12 months) as three rows with four columns.
   *
   * The year always starts in January.
   *
   * Each cell represents midnight on the 1st day of the month.
   *
   * The `active` month will be the January of year of the specified milliseconds.
   *
   * @param milliseconds
   *  the moment in time from which the month model will be created.
   * @returns
   *  the model representing the specified moment in time.
   */
  getModel(milliseconds: number): DlDateTimePickerModel {
    const startDate = moment(milliseconds).startOf('year');

    const rowNumbers = [0, 1, 2];
    const columnNumbers = [0, 1, 2, 3];

    const previousYear = moment(startDate).subtract(1, 'year');
    const nextYear = moment(startDate).add(1, 'year');
    const activeValue = moment(milliseconds).startOf('month').valueOf();

    const result = {
      viewName: 'month',
      viewLabel: startDate.format('YYYY'),
      activeDate: activeValue,
      leftButton: {
        value: previousYear.valueOf(),
        ariaLabel: `Go to ${previousYear.format('YYYY')}`,
        classes: {},
      },
      upButton: {
        value: startDate.valueOf(),
        ariaLabel: `Go to ${startDate.format('YYYY')}`,
        classes: {},
      },
      rightButton: {
        value: nextYear.valueOf(),
        ariaLabel: `Go to ${nextYear.format('YYYY')}`,
        classes: {},
      },
      rows: rowNumbers.map(rowOfMonths)
    };

    result.leftButton.classes[`${result.leftButton.value}`] = true;
    result.rightButton.classes[`${result.rightButton.value}`] = true;

    return result;

    function rowOfMonths(rowNumber) {

      const currentMoment = moment();
      const cells = columnNumbers.map((columnNumber) => {
        const monthMoment = moment(startDate).add((rowNumber * columnNumbers.length) + columnNumber, 'months');
        return {
          display: monthMoment.format('MMM'),
          ariaLabel: monthMoment.format('MMM YYYY'),
          value: monthMoment.valueOf(),
          classes: {
            active: activeValue === monthMoment.valueOf(),
            today: monthMoment.isSame(currentMoment, 'month'),
          }
        };
      });
      return {cells};
    }
  }

  /**
   * Move the active `month` one row `down` from the specified moment in time.
   *
   * Moving `down` can result in the `active` month being part of a different year than
   * the specified `fromMilliseconds`, in this case the year represented by the model
   * will change to show the correct year.
   *
   * @param fromMilliseconds
   *  the moment in time from which the next `month` model `down` will be constructed.
   * @returns
   *  model containing an `active` `month` one row `down` from the specified moment in time.
   */
  goDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(4, 'month').valueOf());
  }

  /**
   * Move the active `month` one row `up` from the specified moment in time.
   *
   * Moving `up` can result in the `active` month being part of a different year than
   * the specified `fromMilliseconds`, in this case the year represented by the model
   * will change to show the correct year.
   *
   * @param fromMilliseconds
   *  the moment in time from which the previous `month` model `up` will be constructed.
   * @returns
   *  model containing an `active` `month` one row `up` from the specified moment in time.
   */
  goUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(4, 'month').valueOf());
  }

  /**
   * Move the `active` `month` one (1) month to the `left` of the specified moment in time.
   *
   * Moving `left` can result in the `active` month being part of a different year than
   * the specified `fromMilliseconds`, in this case the year represented by the model
   * will change to show the correct year.
   *
   * @param fromMilliseconds
   *  the moment in time from which the `month` model to the `left` will be constructed.
   * @returns
   *  model containing an `active` `month` one month to the `left` of the specified moment in time.
   */
  goLeft(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(1, 'month').valueOf());
  }

  /**
   * Move the `active` `month` one (1) month to the `right` of the specified moment in time.
   *
   * The `active` month will be `one (1) month after` the specified milliseconds.
   * This moves the `active` date one month `right` in the current `month` view.
   *
   * Moving `right` can result in the `active` month being part of a different year than
   * the specified `fromMilliseconds`, in this case the year represented by the model
   * will change to show the correct year.
   *
   * @param fromMilliseconds
   *  the moment in time from which the `month` model to the `right` will be constructed.
   * @returns
   *  model containing an `active` `month` one year to the `right` of the specified moment in time.
   */
  goRight(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(1, 'month').valueOf());
  }

  /**
   * Move the active `month` one year `down` from the specified moment in time.
   *
   * Paging `down` will result in the `active` month being part of a different year than
   * the specified `fromMilliseconds`. As a result, the year represented by the model
   * will change to show the correct year.
   *
   * @param fromMilliseconds
   *  the moment in time from which the next `month` model page `down` will be constructed.
   * @returns
   *  model containing an `active` `month` one year `down` from the specified moment in time.
   */
  pageDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(12, 'months').valueOf());
  }

  /**
   * Move the active `month` one year `down` from the specified moment in time.
   *
   * Paging `up` will result in the `active` month being part of a different year than
   * the specified `fromMilliseconds`. As a result, the year represented by the model
   * will change to show the correct year.
   *
   * @param fromMilliseconds
   *  the moment in time from which the next `month` model page `up` will be constructed.
   * @returns
   *  model containing an `active` `month` one year `up` from the specified moment in time.
   */
  pageUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(12, 'months').valueOf());
  }

  /**
   * Move the `active` `month` to `December` of the current year.
   *
   * The view or time range will not change unless the `fromMilliseconds` value
   * is in a different year than the displayed decade.
   *
   * @param fromMilliseconds
   *  the moment in time from which `December 1` will be calculated.
   * @returns
   *  a model with the `December` cell in the view as the active `month`.
   */
  goEnd(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).endOf('year').valueOf());
  }

  /**
   * Move the `active` `month` to `January` of the current year.
   *
   * The view or time range will not change unless the `fromMilliseconds` value
   * is in a different year than the displayed decade.
   *
   * @param fromMilliseconds
   *  the moment in time from which `January 1` will be calculated.
   * @returns
   *  a model with the `January` cell in the view as the active `month`.
   */
  goHome(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).startOf('year').valueOf());
  }
}
