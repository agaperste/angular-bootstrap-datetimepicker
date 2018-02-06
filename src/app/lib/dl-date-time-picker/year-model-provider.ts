import {ModelProvider} from './model-provider';
import {DlDateTimePickerModel} from './dl-date-time-picker-model';
import * as moment from 'moment';
import {Moment} from 'moment';
import {NgModule} from '@angular/core';

@NgModule({
  providers: [
    {
      provide: YearModelProvider,
      useClass: YearModelProvider,
    },
  ],
})
export class YearModelProvider implements ModelProvider {

  private static getStartOfDecade(milliseconds: number): Moment {
    // Truncate the last digit from the current year to get the start of the decade
    const startDecade = (Math.trunc(moment.utc(milliseconds).year() / 10) * 10);
    return moment.utc(`${startDecade}-01-01`, 'YYYY-MM-DD').startOf('year');
  }

  getModel(milliseconds: number): DlDateTimePickerModel {
    const rowNumbers = [0, 1];
    const columnNumbers = [0, 1, 2, 3, 4];

    const startYear = moment.utc(milliseconds).startOf('year');
    const startDate = YearModelProvider.getStartOfDecade(milliseconds);

    const futureYear = startDate.year() + 9;
    const pastYear = startDate.year();

    const result: DlDateTimePickerModel = {
      view: 'year',
      viewLabel: `${pastYear}-${futureYear}`,
      activeDate: startYear.valueOf(),
      leftButton: {
        value: moment.utc(startDate).subtract(9, 'years').valueOf(),
        ariaLabel: `Go to ${pastYear - 10}-${pastYear - 1}`,
        classes: {},
      },
      rightButton: {
        value: moment.utc(startDate).add(11, 'years').valueOf(),
        ariaLabel: `Go to ${futureYear + 1}-${futureYear + 10}`,
        classes: {},
      },
      rows: rowNumbers.map(rowOfYears.bind(this))
    };

    result.leftButton.classes[`${result.leftButton.value}`] = true;
    result.rightButton.classes[`${result.rightButton.value}`] = true;

    return result;

    function rowOfYears(rowNumber) {

      const currentMoment = moment.utc();
      const cells = columnNumbers.map((columnNumber) => {
        const yearMoment = moment.utc(startDate).add((rowNumber * columnNumbers.length) + columnNumber, 'years');
        return {
          display: yearMoment.format('YYYY'),
          value: yearMoment.valueOf(),
          classes: {
            today: yearMoment.isSame(currentMoment, 'year'),
          }
        };
      });
      return {cells};
    }
  }

  goUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).subtract(5, 'year').valueOf());
  }

  goDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).add(5, 'year').valueOf());
  }

  goLeft(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).subtract(1, 'year').valueOf());
  }

  goRight(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).add(1, 'year').valueOf());
  }

  pageDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).add(10, 'year').valueOf());
  }

  pageUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).subtract(10, 'year').valueOf());
  }

  goEnd(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(YearModelProvider.getStartOfDecade(fromMilliseconds).add(9, 'years').endOf('year').valueOf());
  }

  goHome(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(YearModelProvider.getStartOfDecade(fromMilliseconds).startOf('year').valueOf());
  }
}
