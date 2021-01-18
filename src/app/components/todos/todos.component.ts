import {
  Component, // Component module from angular
  OnInit, // Lifecycle that angular have, run when component initialized
  OnDestroy, // Lifecycle that angular have, run when component unmounted / leaving the component
} from '@angular/core';

// Import Subscription from rxjs.
// It's for watching any async request, and you can make that async request canceled.
// It's good for performance purpose.
// When you have case, that if user leaving this todo page, you want to cancel any previous async request.
import { Subscription } from 'rxjs';

// Import switch map from rxjs/operators for re-subscribe for watching the state
import {
  switchMap, // switchMap used for switching the first observable and run the next observable that inside switch map
} from 'rxjs/operators';

// Import the todo service
import { TodoService } from '../../services/todo.service';

// Import the todo model
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todos', // selector that generate html (<app-todos></app-todos>)
  templateUrl: './todos.component.html', // Reference to your html
  styleUrls: ['./todos.component.css'], // Reference to your styles
})
export class TodosComponent implements OnInit, OnDestroy {
  // Define your states here
  isLoading: boolean;
  todos: Todo[] = [];
  todoSubscription: Subscription;

  // Inject your TodoService or any other service here
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.isLoading = true;
    // It's just like promise base right?
    // The different is at the name, it's using subscribe() than then() (Promise)
    // And assign to todoSubscription, for performance purpose
    this.todoSubscription = this.todoService
      .getTodos()
      .pipe(switchMap(() => this.todoService.todos)) // Also subscribe to todos BehaviorSubject using switch map after getTodos completed, for the purpose to update the state
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

  removeTodo(todoId: number): void {
    this.isLoading = true;
    this.todoService.deleteTodo(todoId).subscribe(
      (_) => {
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
