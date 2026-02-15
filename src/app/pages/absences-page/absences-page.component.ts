import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UiCardComponent } from "../../components/ui-card/ui-card.component";
import { UiModalComponent } from "../../components/ui-modal/ui-modal.component";
import { StoreService } from "../../data/store.service";
import { Absence, AbsenceType, Employee } from "../../data/models";
import { BehaviorSubject, combineLatest, map, startWith } from "rxjs";

type AbsenceVM = Absence & { employee: Employee | null };

@Component({
  selector: "app-absences-page",
  standalone: true,
  imports: [CommonModule, FormsModule, UiCardComponent, UiModalComponent],
  templateUrl: "absences-page.component.html",
  styleUrl: "absences-page.component.css"
})
export class AbsencesPageComponent
{
  private store = inject(StoreService);

  q = "";
  type: "Alle" | AbsenceType = "Alle";
  modalOpen = false;
  editId: string | null = null;

  formEmployeeId = "";
  formType: AbsenceType = "Urlaub";
  formFrom = "";
  formTo = "";

  private qSubject = new BehaviorSubject<string>("");
  private typeSubject = new BehaviorSubject<"Alle" | AbsenceType>("Alle");

  employees$ = this.store.employees$;

  absences$ = combineLatest([
    this.store.absences$,
    this.store.employees$,
    this.qSubject.asObservable().pipe(startWith("")),
    this.typeSubject.asObservable().pipe(startWith("Alle"))
  ]).pipe(
    map(([absences, employees, q, type]) => {
      const qq = (q ?? "").toLowerCase().trim();
      const emap = new Map(employees.map(e => [e.id, e]));
      return absences
        .map(a => ({ ...a, employee: emap.get(a.employeeId) ?? null } as AbsenceVM))
        .filter(a => type === "Alle" ? true : a.type === type)
        .filter(a => {
          if (!qq) return true;
          const n = a.employee?.name ?? "";
          const d = a.employee?.dept ?? "";
          return n.toLowerCase().includes(qq) || d.toLowerCase().includes(qq);
        });
    })
  );

  onQ(x: string)
  {
    this.q = x;
    this.qSubject.next(x);
  }

  onType(x: "Alle" | AbsenceType)
  {
    this.type = x;
    this.typeSubject.next(x);
  }

  openNew(employees: Employee[])
  {
    this.editId = null;
    this.formEmployeeId = employees[0]?.id ?? "";
    this.formType = "Urlaub";
    const d = new Date().toISOString().slice(0, 10);
    this.formFrom = d;
    this.formTo = d;
    this.modalOpen = true;
  }

  openEdit(a: AbsenceVM, employees: Employee[])
  {
    this.editId = a.id;
    this.formEmployeeId = a.employeeId || (employees[0]?.id ?? "");
    this.formType = a.type;
    this.formFrom = a.from;
    this.formTo = a.to;
    this.modalOpen = true;
  }

  save()
  {
    if (!this.formEmployeeId || !this.formFrom || !this.formTo) return;
    this.store.upsertAbsence({
      id: this.editId ?? undefined,
      employeeId: this.formEmployeeId,
      type: this.formType,
      from: this.formFrom,
      to: this.formTo
    });
    this.modalOpen = false;
  }

  remove(id: string)
  {
    this.store.deleteAbsence(id);
  }
}
