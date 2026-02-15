import { Injectable } from "@angular/core";
import { BehaviorSubject, combineLatest, map } from "rxjs";
import { seedAbsences, seedEmployees, seedTasks } from "./seed";
import { Absence, Employee, EmployeeStatus, Task, TaskStatus } from "./models";
import { uid } from "./id";

@Injectable({ providedIn: "root" })
export class StoreService
{
  private employeesSubject = new BehaviorSubject<Employee[]>(seedEmployees);
  private tasksSubject = new BehaviorSubject<Task[]>(seedTasks);
  private absencesSubject = new BehaviorSubject<Absence[]>(seedAbsences);

  employees$ = this.employeesSubject.asObservable();
  tasks$ = this.tasksSubject.asObservable();
  absences$ = this.absencesSubject.asObservable();

  employeeById(id: string)
  {
    return this.employees$.pipe(map(list => list.find(x => x.id === id) ?? null));
  }

  taskById(id: string)
  {
    return this.tasks$.pipe(map(list => list.find(x => x.id === id) ?? null));
  }

  counts$ = combineLatest([this.employees$, this.tasks$, this.absences$]).pipe(
    map(([employees, tasks, absences]) => {
      const active = employees.filter(e => e.status === "Aktiv").length;
      const absent = employees.filter(e => e.status === "Abwesend").length;
      const inactive = employees.filter(e => e.status === "Inaktiv").length;
      const openTasks = tasks.filter(t => t.status !== "Erledigt").length;
      const todaysAbsences = absences.length;
      return { total: employees.length, active, absent, inactive, openTasks, todaysAbsences };
    })
  );

  setEmployeeStatus(id: string, status: EmployeeStatus)
  {
    const next = this.employeesSubject.value.map(e => e.id === id ? { ...e, status } : e);
    this.employeesSubject.next(next);
  }

  upsertEmployee(payload: Omit<Employee, "id"> & { id?: string })
  {
    const list = this.employeesSubject.value;
    if (payload.id)
    {
      const next = list.map(e => e.id === payload.id ? { ...e, ...payload, id: e.id } : e);
      this.employeesSubject.next(next);
      return;
    }
    const next = [{ id: uid("e_"), ...payload }, ...list];
    this.employeesSubject.next(next);
  }

  deleteEmployee(id: string)
  {
    const employees = this.employeesSubject.value.filter(e => e.id !== id);
    const tasks = this.tasksSubject.value.filter(t => t.assigneeId !== id);
    const absences = this.absencesSubject.value.filter(a => a.employeeId !== id);
    this.employeesSubject.next(employees);
    this.tasksSubject.next(tasks);
    this.absencesSubject.next(absences);
  }

  upsertTask(payload: Omit<Task, "id"> & { id?: string })
  {
    const list = this.tasksSubject.value;
    if (payload.id)
    {
      const next = list.map(t => t.id === payload.id ? { ...t, ...payload, id: t.id } : t);
      this.tasksSubject.next(next);
      return;
    }
    const next = [{ id: uid("t_"), ...payload }, ...list];
    this.tasksSubject.next(next);
  }

  setTaskStatus(id: string, status: TaskStatus)
  {
    const next = this.tasksSubject.value.map(t => t.id === id ? { ...t, status } : t);
    this.tasksSubject.next(next);
  }

  deleteTask(id: string)
  {
    const next = this.tasksSubject.value.filter(t => t.id !== id);
    this.tasksSubject.next(next);
  }

  upsertAbsence(payload: Omit<Absence, "id"> & { id?: string })
  {
    const list = this.absencesSubject.value;
    if (payload.id)
    {
      const next = list.map(a => a.id === payload.id ? { ...a, ...payload, id: a.id } : a);
      this.absencesSubject.next(next);
      return;
    }
    const next = [{ id: uid("a_"), ...payload }, ...list];
    this.absencesSubject.next(next);
  }

  deleteAbsence(id: string)
  {
    const next = this.absencesSubject.value.filter(a => a.id !== id);
    this.absencesSubject.next(next);
  }
}
