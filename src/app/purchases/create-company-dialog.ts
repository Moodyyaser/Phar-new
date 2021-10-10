import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    templateUrl: "create-company-dialog.html"
})
export class CreateCompanyDialog {
    constructor(
        public dialogRef: MatDialogRef<CreateCompanyDialog>,
        @Inject(MAT_DIALOG_DATA) public data: ""
    ) {}

    onNoClick() {
        this.dialogRef.close();
    }
}
