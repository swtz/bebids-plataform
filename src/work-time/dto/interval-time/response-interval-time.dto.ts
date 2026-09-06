import { IntervalTime } from 'src/work-time/entities/interval-time.entity';
import { ResponseWorkTimeDto } from '../work-time/response-work-time.dto';

export class ResponseIntervalTimeDto {
  readonly id: string;
  readonly initHour: string;
  readonly endHour: string;
  readonly duration: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly workTime: ResponseWorkTimeDto;

  constructor(intervalTime: IntervalTime) {
    this.id = intervalTime.id;
    this.initHour = intervalTime.initHour;
    this.endHour = intervalTime.endHour;
    this.duration = intervalTime.duration;
    this.createdAt = intervalTime.createdAt;
    this.updatedAt = intervalTime.updatedAt;
    this.workTime = new ResponseWorkTimeDto(intervalTime.workTime);
  }
}
