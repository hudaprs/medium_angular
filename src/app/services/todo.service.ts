import { Injectable } from '@angular/core';

// Import RxJs for handle async request to server
import { Observable, BehaviorSubject, throwError } from 'rxjs';

// Import operators RxJs, to interact with data that we receive form server
import { map, catchError } from 'rxjs/operators';

// Import HTTP for interact with server
import { HttpClient } from '@angular/common/http';

// Import your model
import { Todo } from '../models/todo.model';

// Create interface for todo
interface TodoInterface {
  id: number;
  title: string;
  completed: boolean;
  userId?: number;
}

@Injectable({
  providedIn: 'root', // will be registered in app.module.ts, providers key.
})
export class TodoService {
  // Define your state here
  todos = new BehaviorSubject<Todo[]>([]);
  todoURL: string = 'https://jsonplaceholder.typicode.com/todos';

  // Inject your service or any other angular modules in constructor
  constructor(private http: HttpClient) {}

  /**
   * @description Get all todos
   *
   * @method GET this.todoURL
   * @access public
   *
   * @return Observable<any>
   */
  getTodos(): Observable<any> {
    return this.http.get(`${this.todoURL}?_limit=5`).pipe(
      map((todos: Todo[]) => {
        // We want to map the response, because I want to delete some object. So you know what we doing XD.
        this.todos.next(
          todos.map((todo: TodoInterface) => {
            // We don't need userId, so we can delete it from the object.
            delete todo.userId;
            return {
              ...todo,
            };
          })
        );
      }),
      // Return error to client if theres any error
      catchError((err) => throwError(err))
    );
  }

  /**
   * @description Create new todo
   *
   * @method POST this.todoURL
   * @access public
   *
   * @param {string} title
   *
   * @return Observable<any>
   */
  createTodo(title: string): Observable<any> {
    return this.http
      .post(this.todoURL, {
        title,
        completed: false,
      })
      .pipe(
        // Map data again just like the getTodos method
        map((todo: Todo) => {
          delete todo.userId;

          // Update the todos state
          this.todos.next([todo, ...this.todos.getValue()]);
        }),
        // Return error to client if theres any error
        catchError((err) => throwError(err))
      );
  }

  /**
   * @description Delete existed todo
   *
   * @method DELETE this.todoURL/:todoId
   * @access public
   *
   * @param {number} todoId
   *
   * @return Observable<any>
   */
  deleteTodo(todoId: number): Observable<any> {
    return this.http.delete(`${this.todoURL}/${todoId}`).pipe(
      // Map data again just like the getTodos method
      map((_): void => {
        // Update the todos state
        // Filter out the existed todos
        this.todos.next(
          this.todos
            .getValue()
            .filter((existedTodo) => existedTodo.id !== todoId)
        );
      }),
      // Return error to client if theres any error
      catchError((err) => throwError(err))
    );
  }
}
