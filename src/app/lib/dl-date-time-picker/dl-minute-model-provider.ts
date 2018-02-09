import {DlModelProvider} from './dl-model-provider';
import * as moment from 'moment';
import {DlDateTimePickerModel} from './dl-date-time-picker-model';
import {NgModule} from '@angular/core';

@NgModule({
  providers: [
    {
      provide: DlMinuteModelProvider,
      useClass: DlMinuteModelProvider,
    },
  ],
})
export class DlMinuteModelProvider implements DlModelProvider {

  private step = 5;

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
      view: 'minute',
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

  goUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(this.step * 4, 'minutes').valueOf());
  }

  goDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(this.step * 4, 'minutes').valueOf());
  }

  goLeft(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(this.step, 'minutes').valueOf());
  }

  goRight(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(this.step, 'minutes').valueOf());
  }

  pageUp(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).subtract(1, 'hour').valueOf());
  }

  pageDown(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).add(1, 'hour').valueOf());
  }

  goEnd(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds)
      .endOf('hour')
      .valueOf());
  }

  goHome(fromMilliseconds: number): DlDateTimePickerModel {
    return this.getModel(moment(fromMilliseconds).startOf('hour').valueOf());
  }
}
