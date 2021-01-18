import { Component } from '@angular/core';

// Import todo servie
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.css'],
})
export class TodoCreateComponent {
  isLoading: boolean = false;

  // This state come from two ways binding from [(ngModel)]="title" in the HTML
  // You must import FormsModule at app.module.ts from @angular/forms to start working with this.
  title: string = '';

  constructor(private todoService: TodoService) {}

  onSubmit(): void {
    if (!this.title) return alert('Title is required');

    this.isLoading = true;
    this.todoService.createTodo(this.title).subscribe(
      (_) => {
        // Reset title
        this.title = '';
        this.isLoading = false;
      },
      (err) => {
        console.error('OOPS, something when wrong when creating todo', err);
        this.isLoading = false;
      }
    );
  }
}
