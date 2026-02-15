import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: "sidebar.component.html",
  styleUrl: "sidebar.component.css"
})
export class SidebarComponent
{
  items = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Mitarbeiter", path: "/mitarbeiter" },
    { label: "Abwesenheit", path: "/abwesenheit" },
    { label: "Aufgaben", path: "/aufgaben" },
    { label: "Berichte", path: "/berichte" }
  ];
}
