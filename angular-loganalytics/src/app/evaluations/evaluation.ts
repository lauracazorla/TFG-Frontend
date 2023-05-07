import { Metric } from "../metrics/metric";

export class Evaluation {
    date: string;
    internalMetric: Metric;
    value: number;
    subject: string;
    team: string;
}
