import { Component, OnInit, OnDestroy } from '@angular/core';

// Import Subscription from rxjs.
// It's for watching any async request, and you can make that async request canceled.
// It's good for performance purpose.
// When you have case, that if user leaving this todo page, you want to cancel any previous async request.
import { Observable, Subscription } from 'rxjs';

// Import switch map from rxjs/operators for re-subscribe for watching the state
import { switchMap } from 'rxjs/operators';

// Get the todo service
import { TodoService } from '../../services/todo.service';

// Get the todo model
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit, OnDestroy {
  isLoading: boolean;
  todos: Todo[] = [];
  todoSubscription: Subscription;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.isLoading = true;
    // It's just like promise base right?
    // The different is at the name, it's using subscribe() than then() (the Promise)
    this.todoSubscription = this.todoService
      .getTodos()
      .pipe(switchMap(() => this.todoService.todos))
      .subscribe(
        (todos): void => {
          this.todos = todos;
          this.isLoading = false;
        },
        // Have any error from the server?
        // Handle in the second parameter of subscribe
        (err): void => {
          console.error(
            'OOPS, something when wrong when getting todos from the server',
            err
          );
          this.isLoading = false;
        }
      );
  }

  makeTodo(title: string): Observable<any> {
    return this.todoService.createTodo(title);
  }

  removeTodo(todoId: number): void {
    this.isLoading = true;
    this.todoService.deleteTodo(todoId).subscribe(
      (_) => {
        console.log('SUCCESS');
        this.isLoading = false;
      },
      (err) => {
        console.error(
          'OOPS, something when wrong when deleting todo from the server',
          err
        );
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe the get todos, for the performance purpose, see the comment above in import Subscription from rxjs
    this.todoSubscription.unsubscribe();
  }
}
