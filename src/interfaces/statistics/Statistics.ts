// src/interfaces/statistics/Statistics.ts
export interface MonthlyUsersEnrolled {
  month: number;
  year: number;
  totalUsers: number;
}

export interface PendingEvents {
  totalPending: number;
}

export interface YearlyEvents {
  year: number;
  totalEvents: number;
}

export interface MonthlyRevenue {
  month: number;
  year: number;
  totalRevenue: number;
}

export interface MonthlyEnrollmentRecord {
  month: number;
  year: number;
  maxEnrollmentsInADay: number;
  dateOfRecord: string;
}
