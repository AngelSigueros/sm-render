import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { AuthenticationService } from '../user-authentication/authentication.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  users: User[]=[];
  isLoggedIn = false;
  userEmail = '';
  isAdmin = false;

  constructor(private http: HttpClient,
              private router: Router,
              private authService: AuthenticationService) { 
    this.authService.isAdmin.subscribe(isAdmin=>this.isAdmin=isAdmin);
   }

  ngOnInit(): void {
    console.log('UserListComponent - ' + this.isAdmin);
    this.loadUsers();
    
  }

  loadUsers(){
    this.http.get<User[]>("https://sm-render.onrender.com/user").subscribe(u=>this.users=u);
  }

  deleteUser(userId: number){
    const url = "https://sm-render.onrender.com/user/" + userId;
    // this.http.delete<boolean>(url).subscribe(b => {
    //   this.loadUsers();
    // });
  }

}
