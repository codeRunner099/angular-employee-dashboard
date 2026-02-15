import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { UiCardComponent } from "../../components/ui-card/ui-card.component";
import { UiModalComponent } from "../../components/ui-modal/ui-modal.component";
import { StoreService } from "../../data/store.service";
import { Employee, Task, TaskStatus } from "../../data/models";
import { BehaviorSubject, combineLatest, map, startWith } from "rxjs";

type TaskVM = Task & { assignee: Employee | null };

@Component({
  selector: "app-tasks-page",
  standalone: true,
  imports: [CommonModule, FormsModule, UiCardComponent, UiModalComponent],
  templateUrl: "tasks-page.component.html",
  styleUrl: "tasks-page.component.css"
})
export class TasksPageComponent
{
  private store = inject(StoreService);

  q = "";
  status: "Alle" | TaskStatus = "Alle";
  modalOpen = false;
  editId: string | null = null;

  formTitle = "";
  formAssigneeId = "";
  formDue = "";
  formStatus: TaskStatus = "To do";
  formNotes = "";

  private qSubject = new BehaviorSubject<string>("");
  private statusSubject = new BehaviorSubject<"Alle" | TaskStatus>("Alle");

  employees$ = this.store.employees$;

  tasks$ = combineLatest([
    this.store.tasks$,
    this.store.employees$,
    this.qSubject.asObservable().pipe(startWith("")),
    this.statusSubject.asObservable().pipe(startWith("Alle"))
  ]).pipe(
    map(([tasks, employees, q, status]) => {
      const qq = (q ?? "").toLowerCase().trim();
      const emap = new Map(employees.map(e => [e.id, e]));
      return tasks
        .map(t => ({ ...t, assignee: emap.get(t.assigneeId) ?? null } as TaskVM))
        .filter(t => status === "Alle" ? true : t.status === status)
        .filter(t => {
          if (!qq) return true;
          const a = t.assignee?.name ?? "";
          return t.title.toLowerCase().includes(qq) || a.toLowerCase().includes(qq);
        });
    })
  );

  onQ(x: string)
  {
    this.q = x;
    this.qSubject.next(x);
  }

  onStatus(x: "Alle" | TaskStatus)
  {
    this.status = x;
    this.statusSubject.next(x);
  }

  pillTone(s: TaskStatus)
  {
    if (s === "To do") return "todo";
    if (s === "In Arbeit") return "doing";
    return "done";
  }

  openNew(employees: Employee[])
  {
    this.editId = null;
    this.formTitle = "";
    this.formAssigneeId = employees[0]?.id ?? "";
    this.formDue = new Date().toISOString().slice(0, 10);
    this.formStatus = "To do";
    this.formNotes = "";
    this.modalOpen = true;
  }

  openEdit(t: TaskVM, employees: Employee[])
  {
    this.editId = t.id;
    this.formTitle = t.title;
    this.formAssigneeId = t.assigneeId || (employees[0]?.id ?? "");
    this.formDue = t.due;
    this.formStatus = t.status;
    this.formNotes = t.notes;
    this.modalOpen = true;
  }

  save()
  {
    const title = this.formTitle.trim();
    if (!title || !this.formAssigneeId || !this.formDue) return;
    this.store.upsertTask({
      id: this.editId ?? undefined,
      title,
      assigneeId: this.formAssigneeId,
      due: this.formDue,
      status: this.formStatus,
      notes: this.formNotes
    });
    this.modalOpen = false;
  }

  setStatus(id: string, status: TaskStatus)
  {
    this.store.setTaskStatus(id, status);
  }

  remove(id: string)
  {
    this.store.deleteTask(id);
  }
}
