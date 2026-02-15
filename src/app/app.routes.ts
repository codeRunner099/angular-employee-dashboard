import { Routes } from "@angular/router";
import { DashboardPageComponent } from "./pages/dashboard-page/dashboard-page.component";
import { EmployeesPageComponent } from "./pages/employees-page/employees-page.component";
import { TasksPageComponent } from "./pages/tasks-page/tasks-page.component";
import { AbsencesPageComponent } from "./pages/absences-page/absences-page.component";
import { ReportsPageComponent } from "./pages/reports-page/reports-page.component";

export const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "dashboard" },
  { path: "dashboard", component: DashboardPageComponent, title: "Dashboard" },
  { path: "mitarbeiter", component: EmployeesPageComponent, title: "Mitarbeiter" },
  { path: "abwesenheit", component: AbsencesPageComponent, title: "Abwesenheit" },
  { path: "aufgaben", component: TasksPageComponent, title: "Aufgaben" },
  { path: "berichte", component: ReportsPageComponent, title: "Berichte" },
  { path: "**", redirectTo: "dashboard" }
];
