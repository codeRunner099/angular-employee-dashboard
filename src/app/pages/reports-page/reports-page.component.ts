import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UiCardComponent } from "../../components/ui-card/ui-card.component";
import { StoreService } from "../../data/store.service";
import { combineLatest, map } from "rxjs";

@Component({
  selector: "app-reports-page",
  standalone: true,
  imports: [CommonModule, UiCardComponent],
  templateUrl: "reports-page.component.html",
  styleUrl: "reports-page.component.css"
})
export class ReportsPageComponent
{
  private store = inject(StoreService);

  summary$ = combineLatest([this.store.employees$, this.store.tasks$, this.store.absences$]).pipe(
    map(([employees, tasks, absences]) => {
      const byDept = new Map<string, number>();
      for (const e of employees) byDept.set(e.dept, (byDept.get(e.dept) ?? 0) + 1);
      const deptRows = Array.from(byDept.entries()).sort((a, b) => b[1] - a[1]).map(([dept, count]) => ({ dept, count }));

      const openTasks = tasks.filter(t => t.status !== "Erledigt").length;
      const doneTasks = tasks.filter(t => t.status === "Erledigt").length;

      return {
        employeesTotal: employees.length,
        tasksTotal: tasks.length,
        openTasks,
        doneTasks,
        absencesTotal: absences.length,
        deptRows
      };
    })
  );

  downloadJson(data: any)
  {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "report.json";
    a.click();
    URL.revokeObjectURL(url);
  }
}
