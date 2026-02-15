export type EmployeeStatus = "Aktiv" | "Abwesend" | "Inaktiv";
export type TaskStatus = "To do" | "In Arbeit" | "Erledigt";
export type AbsenceType = "Urlaub" | "Krank" | "Andere";

export type Employee = {
  id: string;
  name: string;
  dept: string;
  status: EmployeeStatus;
  email: string;
};

export type Task = {
  id: string;
  title: string;
  assigneeId: string;
  due: string;
  status: TaskStatus;
  notes: string;
};

export type Absence = {
  id: string;
  employeeId: string;
  type: AbsenceType;
  from: string;
  to: string;
};
