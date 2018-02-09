import {DlModelProvider} from './dl-model-provider';
import * as moment from 'moment';
import {DlDateTimePickerModel} from './dl-date-time-picker-model';
import {NgModule} from '@angular/core';

@NgModule({
  providers: [
    {
      provide: DlMonthModelProvider,
      useClass: DlMonthModelProvider,
    },
  ],
})
export class DlMonthModelProvider implements DlModelProvider {

  getModel(milliseconds: number): DlDateTimePickerModel {
    const startDate = moment(milliseconds).startOf('year');

    const rowNumbers = [0, 1, 2];
    const columnNumbers = [0, 1, 2, 3];

    const previousYear = moment(startDate).subtract(1, 'year');
    const nextYear = moment(startDate).add(1, 'year');

    const result = {
      view: 'month',
      viewLabel: startDate.format('YYYY'),
      activeDate: moment(milliseconds).startOf('month').valueOf(),
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
            today: monthMoment.isSame(currentMoment, 'month'),
          }
        };
      });
      return {cells};
    }
  }

  goUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(4, 'month').valueOf());
  }

  goDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(4, 'month').valueOf());
  }

  goLeft(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(1, 'month').valueOf());
  }

  goRight(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(1, 'month').valueOf());
  }

  pageUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(12, 'months').valueOf());
  }

  pageDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(12, 'months').valueOf());
  }

  goEnd(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).endOf('year').valueOf());
  }

  goHome(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).startOf('year').valueOf());
  }
}
