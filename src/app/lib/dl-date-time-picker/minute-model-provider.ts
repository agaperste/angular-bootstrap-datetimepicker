import {ModelProvider} from './model-provider';
import * as moment from 'moment';
import {DlDateTimePickerModel} from './dl-date-time-picker-model';
import {NgModule} from '@angular/core';

@NgModule({
  providers: [
    {
      provide: MinuteModelProvider,
      useClass: MinuteModelProvider,
    },
  ],
})
export class MinuteModelProvider implements ModelProvider {

  private step = 5;

  getModel(milliseconds: number): DlDateTimePickerModel {
    const startDate = moment.utc(milliseconds).startOf('hour');

    const minuteSteps = new Array(60 / this.step).fill(0).map((value, index) => index * this.step);
    const minuteValues = minuteSteps.map((minutesToAdd) => moment.utc(startDate).add(minutesToAdd, 'minutes').valueOf());
    const currentMoment = moment.utc(minuteValues.filter((value) => value <= milliseconds).pop());
    const previousHour = moment.utc(startDate).subtract(1, 'hour');
    const nextHour = moment.utc(startDate).add(1, 'hour');

    const rows = new Array(minuteSteps.length / 4)
      .fill(0)
      .map((value, index) => index)
      .map((value) => {
        return {cells: minuteSteps.slice((value * 4), (value * 4) + 4).map(rowOfMinutes)};
      });

    const result: DlDateTimePickerModel = {
      view: 'minute',
      viewLabel: startDate.format('lll'),
      activeDate: currentMoment.valueOf(),
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
      const minuteMoment = moment.utc(startDate).add(stepMinutes, 'minutes');
      return {
        display: minuteMoment.format('LT'),
        ariaLabel: minuteMoment.format('LLL'),
        value: minuteMoment.valueOf(),
        classes: {
          today: minuteMoment.isSame(currentMoment, 'minute'),
        }
      };
    }
  }

  goUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).subtract(this.step * 4, 'minutes').valueOf());
  }

  goDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).add(this.step * 4, 'minutes').valueOf());
  }

  goLeft(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).subtract(this.step, 'minutes').valueOf());
  }

  goRight(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).add(this.step, 'minutes').valueOf());
  }

  pageUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).subtract(1, 'hour').valueOf());
  }

  pageDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).add(1, 'hour').valueOf());
  }

  goEnd(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds)
      .endOf('hour')
      .valueOf());
  }

  goHome(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment.utc(fromMilliseconds).startOf('hour').valueOf());
  }
}
