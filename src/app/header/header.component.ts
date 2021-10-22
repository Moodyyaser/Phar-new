import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit, OnDestroy {
    userIsAuthenticated = false;
    isLoading = false;
    private authListenerSubs!: Subscription;

    constructor(private authService: AuthService) {}

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
