import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { PurchasesComponent } from "./purchases/purchases.component";
import { SalesComponent } from "./sales/sales.component";

const routes: Routes = [
    { path: "", redirectTo: "/purchases", pathMatch: "full" },
    { path: "purchases", component: PurchasesComponent, canActivate: [AuthGuard] },
    { path: "sales", component: SalesComponent, canActivate: [AuthGuard] },
    { path: "login", component: LoginComponent },
    { path: "signup", component: SignupComponent },
    // otherwise redirect to home
    { path: "**", redirectTo: "/purchases" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}
