import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirmar</h2>
    <mat-dialog-content>{{ message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancelar</button>
      <button mat-flat-button [mat-dialog-close]="true">Eliminar</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialog {
  message = inject<string>(MAT_DIALOG_DATA);
}