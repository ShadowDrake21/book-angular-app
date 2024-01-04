import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input({ alias: 'button-styles', required: false }) styles!: string;
  @Input({ required: true }) text!: string;
  @Input() disabled: boolean = false;
}
