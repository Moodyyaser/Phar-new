import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "./auth/auth.service";
import { Router } from "@angular/router";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {
    userIsAuthenticated = false;
    page = 0;
    private authListenerSubs!: Subscription;
    constructor(private router: Router, private authService: AuthService) {}

    ngOnInit() {
        console.log("header ngOnInit");
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authListenerSubs = this.authService
            .getAuthStatusListener()
            .subscribe((isAuthenticated: boolean) => {
                this.userIsAuthenticated = isAuthenticated;
            });
    }

    onLogout() {
        console.log("header onLogout");
        this.authService.logout();
    }

    ngOnDestroy() {
        console.log("header ngOnDestroy");
        this.authListenerSubs.unsubscribe();
    }
}
