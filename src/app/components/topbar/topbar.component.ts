import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavigationEnd, Router } from "@angular/router";
import { filter, map, startWith } from "rxjs";

@Component({
  selector: "app-topbar",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "topbar.component.html",
  styleUrl: "topbar.component.css"
})
export class TopbarComponent
{
  private router = inject(Router);
  userName = "Max Mustermann";

  title$ = this.router.events.pipe(
    filter(e => e instanceof NavigationEnd),
    startWith(null),
    map(() => {
      const leaf = this.router.routerState.snapshot.root.firstChild;
      return leaf?.title ?? "Dashboard";
    })
  );
}
