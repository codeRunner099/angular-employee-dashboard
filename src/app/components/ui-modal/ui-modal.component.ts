import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-ui-modal",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "ui-modal.component.html",
  styleUrl: "ui-modal.component.css"
})
export class UiModalComponent
{
  @Input({ required: true }) title!: string;
  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  onBackdrop(e: MouseEvent)
  {
    if (e.target === e.currentTarget) this.close.emit();
  }
}
