import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
    templateUrl: "download-purchases-dialog.html"
})
export class DownloadPurchasesDialog {
    constructor(
        public dialogRef: MatDialogRef<DownloadPurchasesDialog>,
        @Inject(MAT_DIALOG_DATA) public data: ""
    ) {}

    onNoClick() {
        this.dialogRef.close();
    }
}
