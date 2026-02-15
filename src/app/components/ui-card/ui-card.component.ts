import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-ui-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "ui-card.component.html",
  styleUrl: "ui-card.component.css"
})
export class UiCardComponent
{
  @Input({ required: true }) title!: string;
  @Input() tone: "neutral" | "accent" | "warn" = "neutral";
  @Input() subtitle: string | null = null;
}
