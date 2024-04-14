import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service'; // Import UserService

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  userForm: FormGroup;
  users: any[] = [];
  editingUser: boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService // Inject UserService
  ) {
    this.userForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.getUsers(); // Call getUsers() to fetch initial user data
  }

  getUsers() {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  generateUserId(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
  saveUser() {
    if (this.userForm.valid) {
      const newUser = { ...this.userForm.value }; // Create a copy of the form value
      console.log(newUser);
      if (!this.editingUser) {
        // If not editing, generate a new ID for the user
        newUser.id = this.generateUserId();
        this.userService.addUser(newUser).subscribe(user => {
          this.users.push(user); 
        });
        // Add the new user to the users array
      } else {
        // If editing, find the index of the user in the users array
        const index = this.users.findIndex(user => user.id === newUser.id);
        console.log(index);
        if (index !== -1) {
          // Update the user in the users array with the new data
          this.userService.addUser(newUser).subscribe(user => {
            this.users[index] = newUser;
          });
          
        }
      }
      this.userForm.reset(); // Reset the form
      this.editingUser = false; // Reset the editingUser flag
    }
  }
  
  
  
  editUser(user: any) {
    this.userForm.setValue({
      id: user.id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      email: user.email
    });
    this.userForm.patchValue(user);
    this.editingUser = true;
  }
  
  deleteUser(user: any) {
    const confirmDelete = confirm('Are you sure you want to delete this user?');
    if (confirmDelete) {
      this.userService.deleteUser(user.id).subscribe(() => {
        this.users = this.users.filter(u => u.id !== user.id); // Update users array after deleting user
      });
    }
  }
  
}
