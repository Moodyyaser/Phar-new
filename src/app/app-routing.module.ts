import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PurchasesComponent } from "./purchases/purchases.component";
import { SalesComponent } from "./sales/sales.component";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";

const routes: Routes = [
    { path: "", redirectTo: "/purchases", pathMatch: "full" },
    { path: "purchases", component: PurchasesComponent },
    { path: "sales", component: SalesComponent },
    { path: "login", component: LoginComponent },
    { path: "signup", component: SignupComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
