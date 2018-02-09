import {DlModelProvider} from './dl-model-provider';
import * as momentNs from 'moment';
import {DlDateTimePickerModel} from './dl-date-time-picker-model';
import {Component} from '@angular/core';

/** @internal */
const moment = momentNs;

@Component({
  providers: [
    {
      provide: DlHourModelComponent,
      useClass: DlHourModelComponent,
    },
  ],
})
export class DlHourModelComponent implements DlModelProvider {

  getModel(milliseconds: number): DlDateTimePickerModel {
    const startDate = moment(milliseconds).startOf('day');

    const rowNumbers = [0, 1, 2, 3, 4, 5];
    const columnNumbers = [0, 1, 2, 3];

    const previousDay = moment(startDate).subtract(1, 'day');
    const nextDay = moment(startDate).add(1, 'day');

    const result: DlDateTimePickerModel = {
      view: 'hour',
      viewLabel: startDate.format('ll'),
      activeDate: moment(milliseconds).startOf('hour').valueOf(),
      leftButton: {
        value: previousDay.valueOf(),
        ariaLabel: `Go to ${previousDay.format('ll')}`,
        classes: {},
      },
      upButton: {
        value: startDate.valueOf(),
        ariaLabel: `Go to ${startDate.format('MMM YYYY')}`,
        classes: {},
      },
      rightButton: {
        value: nextDay.valueOf(),
        ariaLabel: `Go to ${nextDay.format('ll')}`,
        classes: {},
      },
      rows: rowNumbers.map(rowOfHours)
    };

    result.leftButton.classes[`${result.leftButton.value}`] = true;
    result.rightButton.classes[`${result.rightButton.value}`] = true;

    return result;

    function rowOfHours(rowNumber) {

      const currentMoment = moment();
      const cells = columnNumbers.map((columnNumber) => {
        const hourMoment = moment(startDate).add((rowNumber * columnNumbers.length) + columnNumber, 'hours');
        return {
          display: hourMoment.format('LT'),
          ariaLabel: hourMoment.format('LLL'),
          value: hourMoment.valueOf(),
          classes: {
            today: hourMoment.isSame(currentMoment, 'hour'),
          }
        };
      });
      return {cells};
    }
  }

  goUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(4, 'hour').valueOf());
  }

  goDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(4, 'hour').valueOf());
  }

  goLeft(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(1, 'hour').valueOf());
  }

  goRight(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(1, 'hour').valueOf());
  }

  pageUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(1, 'day').valueOf());
  }

  pageDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(1, 'day').valueOf());
  }

  goEnd(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(
      moment
      (fromMilliseconds)
        .endOf('day')
        .startOf('hour')
        .valueOf()
    );
  }

  goHome(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).startOf('day').valueOf());
  }
}
