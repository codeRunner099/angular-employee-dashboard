import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UiCardComponent } from "../../components/ui-card/ui-card.component";
import { StoreService } from "../../data/store.service";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-dashboard-page",
  standalone: true,
  imports: [CommonModule, UiCardComponent, RouterLink],
  templateUrl: "dashboard-page.component.html",
  styleUrl: "dashboard-page.component.css"
})
export class DashboardPageComponent
{
  store = inject(StoreService);
  counts$ = this.store.counts$;
}
