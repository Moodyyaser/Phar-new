import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

//Materials
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatExpansionModule } from "@angular/material/expansion";

import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { PurchasesComponent } from "./purchases/purchases.component";
import { AppRoutingModule } from "./app-routing.module";

import { MatSortModule } from "@angular/material/sort";
import { SalesComponent } from "./sales/sales.component";
import { CreateComponent } from "./create/create.component";
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { InMemoryDataService } from "./in-memory-data.service";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { AuthInterceptor } from "./auth/auth-interceptor";
import { ErrorInterceptor } from "./error-interseptor";
import { ErrorComponent } from "./error/error.component";
import { HeaderComponent } from "./header/header.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostListComponent } from "./posts/post-list/post-list.component";

@NgModule({
    declarations: [
        AppComponent,
        PurchasesComponent,
        SalesComponent,
        HeaderComponent,
        CreateComponent,
        LoginComponent,
        SignupComponent,
        ErrorComponent,
        PostCreateComponent,
        PostListComponent
    ],
    imports: [
        MatTableModule,
        MatButtonModule,
        MatToolbarModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        MatDialogModule,
        MatMenuModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatDialogModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        MatExpansionModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatSortModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule
    ],
    providers: [
        PurchasesComponent,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    entryComponents: [ErrorComponent]
})
export class AppModule {}
