export interface ModuleUsageData {
  module: string;
  users: number;
  orders: number;
  errors: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}