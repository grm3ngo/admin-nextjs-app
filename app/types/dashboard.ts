export interface DashboardStats { // thong ke tong quan cho dashboard, so admin, so luong hoat dong , khong hoat dong, so luong session hoat dong
  totalAdmins: number;
  activeAdmins: number;
  inactiveAdmins: number;
  activeSessions: number;
}

export interface ChartDataPoint { // diem du lieu bieu do
  name: string;
  value: number;
}

export interface TimeSeriesData { // du lieu chuoi thoi gian cho bieu do
  date: string;
  count: number;
}