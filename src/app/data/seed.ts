import { Absence, Employee, Task } from "./models";

export const seedEmployees: Employee[] = [
  { id: "e1", name: "Sabine Müller", dept: "Verkauf", status: "Aktiv", email: "sabine.mueller@firma.de" },
  { id: "e2", name: "Peter Hoffmann", dept: "Support", status: "Abwesend", email: "peter.hoffmann@firma.de" },
  { id: "e3", name: "Laura Fischer", dept: "HR", status: "Aktiv", email: "laura.fischer@firma.de" },
  { id: "e4", name: "Michael Weber", dept: "IT", status: "Inaktiv", email: "michael.weber@firma.de" },
  { id: "e5", name: "Anna Schmitt", dept: "HR", status: "Aktiv", email: "anna.schmitt@firma.de" },
  { id: "e6", name: "Tim Becker", dept: "IT", status: "Aktiv", email: "tim.becker@firma.de" },
  { id: "e7", name: "Julia Wagner", dept: "Support", status: "Aktiv", email: "julia.wagner@firma.de" }
];

export const seedTasks: Task[] = [
  { id: "t1", title: "Mitarbeitergespräch planen", assigneeId: "e5", due: "2026-02-24", status: "To do", notes: "Terminvorschläge sammeln, Agenda vorbereiten." },
  { id: "t2", title: "Zugänge für neuen Mitarbeiter erstellen", assigneeId: "e6", due: "2026-02-25", status: "In Arbeit", notes: "VPN, Mail, Nextcloud, HM-Office." },
  { id: "t3", title: "Projektstatus prüfen", assigneeId: "e7", due: "2026-02-25", status: "To do", notes: "Kurzreport für Team-Standup." }
];

export const seedAbsences: Absence[] = [
  { id: "a1", employeeId: "e2", type: "Krank", from: "2026-02-12", to: "2026-02-16" },
  { id: "a2", employeeId: "e1", type: "Urlaub", from: "2026-02-10", to: "2026-02-20" },
  { id: "a3", employeeId: "e3", type: "Andere", from: "2026-02-14", to: "2026-02-14" }
];
