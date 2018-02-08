import {ModelProvider} from './model-provider';
import * as moment from 'moment';
import {DlDateTimePickerModel} from './dl-date-time-picker-model';
import {NgModule} from '@angular/core';

@NgModule({
  providers: [
    {
      provide: DayModelProvider,
      useClass: DayModelProvider,
    },
  ],
})
export class DayModelProvider implements ModelProvider {
  getModel(milliseconds: number): DlDateTimePickerModel {

    const startOfMonth = moment(milliseconds).startOf('month');
    const endOfMonth = moment(milliseconds).endOf('month');
    const startOfView = moment(startOfMonth).subtract(Math.abs(startOfMonth.weekday()), 'days');

    const rowNumbers = [0, 1, 2, 3, 4, 5];
    const columnNumbers = [0, 1, 2, 3, 4, 5, 6];

    const previousMonth = moment(startOfMonth).subtract(1, 'month');
    const nextMonth = moment(startOfMonth).add(1, 'month');

    const result: DlDateTimePickerModel = {
      view: 'day',
      viewLabel: startOfMonth.format('MMM YYYY'),
      activeDate: moment(milliseconds).startOf('day').valueOf(),
      leftButton: {
        value: previousMonth.valueOf(),
        ariaLabel: `Go to ${previousMonth.format('MMM YYYY')}`,
        classes: {},
      },
      upButton: {
        value: startOfMonth.valueOf(),
        ariaLabel: `Go to month view`,
        classes: {},
      },
      rightButton: {
        value: nextMonth.valueOf(),
        ariaLabel: `Go to ${nextMonth.format('MMM YYYY')}`,
        classes: {},
      },
      rowLabels: columnNumbers.map((column) => moment().weekday(column).format('dd')),
      rows: rowNumbers.map(rowOfDays)
    };

    result.leftButton.classes[`${result.leftButton.value}`] = true;
    result.rightButton.classes[`${result.rightButton.value}`] = true;

    return result;

    function rowOfDays(rowNumber) {
      const currentMoment = moment();
      const cells = columnNumbers.map((columnNumber) => {
        const dayMoment = moment(startOfView).add((rowNumber * columnNumbers.length) + columnNumber, 'days');
        return {
          display: dayMoment.format('D'),
          ariaLabel: dayMoment.format('ll'),
          value: dayMoment.valueOf(),
          classes: {
            past: dayMoment.isBefore(startOfMonth),
            future: dayMoment.isAfter(endOfMonth),
            today: dayMoment.isSame(currentMoment, 'day'),
          }
        };
      });
      return {cells};
    }
  }

  goLeft(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(1, 'day').valueOf());
  }

  goRight(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(1, 'day').valueOf());
  }

  goUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(7, 'days').valueOf());
  }

  goDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(7, 'days').valueOf());
  }

  pageUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(1, 'month').valueOf());
  }

  pageDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(1, 'month').valueOf());
  }

  goEnd(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds)
      .endOf('month').startOf('day').valueOf());
  }

  goHome(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).startOf('month').valueOf());
  }
}
