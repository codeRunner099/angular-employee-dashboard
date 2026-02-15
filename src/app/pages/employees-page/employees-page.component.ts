import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UiCardComponent } from "../../components/ui-card/ui-card.component";
import { UiModalComponent } from "../../components/ui-modal/ui-modal.component";
import { StoreService } from "../../data/store.service";
import { Employee, EmployeeStatus } from "../../data/models";
import { BehaviorSubject, combineLatest, map, startWith } from "rxjs";

@Component({
  selector: "app-employees-page",
  standalone: true,
  imports: [CommonModule, FormsModule, UiCardComponent, UiModalComponent],
  templateUrl: "employees-page.component.html",
  styleUrl: "employees-page.component.css"
})
export class EmployeesPageComponent
{
  private store = inject(StoreService);

  q = "";
  status: "Alle" | EmployeeStatus = "Alle";
  modalOpen = false;
  editId: string | null = null;

  formName = "";
  formDept = "";
  formEmail = "";
  formStatus: EmployeeStatus = "Aktiv";

  private qSubject = new BehaviorSubject<string>("");
  private statusSubject = new BehaviorSubject<"Alle" | EmployeeStatus>("Alle");

  employees$ = combineLatest([
    this.store.employees$,
    this.qSubject.asObservable().pipe(startWith("")),
    this.statusSubject.asObservable().pipe(startWith("Alle"))
  ]).pipe(
    map(([list, q, status]) => {
      const qq = (q ?? "").toLowerCase().trim();
      return list
        .filter(e => status === "Alle" ? true : e.status === status)
        .filter(e => qq ? (e.name.toLowerCase().includes(qq) || e.dept.toLowerCase().includes(qq) || e.email.toLowerCase().includes(qq)) : true);
    })
  );

  onQ(x: string)
  {
    this.q = x;
    this.qSubject.next(x);
  }

  onStatus(x: "Alle" | EmployeeStatus)
  {
    this.status = x;
    this.statusSubject.next(x);
  }

  pillTone(s: EmployeeStatus)
  {
    if (s === "Aktiv") return "active";
    if (s === "Abwesend") return "absent";
    return "inactive";
  }

  openNew()
  {
    this.editId = null;
    this.formName = "";
    this.formDept = "";
    this.formEmail = "";
    this.formStatus = "Aktiv";
    this.modalOpen = true;
  }

  openEdit(e: Employee)
  {
    this.editId = e.id;
    this.formName = e.name;
    this.formDept = e.dept;
    this.formEmail = e.email;
    this.formStatus = e.status;
    this.modalOpen = true;
  }

  save()
  {
    const name = this.formName.trim();
    const dept = this.formDept.trim();
    const email = this.formEmail.trim();
    if (!name || !dept || !email) return;
    this.store.upsertEmployee({ id: this.editId ?? undefined, name, dept, email, status: this.formStatus });
    this.modalOpen = false;
  }

  remove(id: string)
  {
    this.store.deleteEmployee(id);
  }
}
