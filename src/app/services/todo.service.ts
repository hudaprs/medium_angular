import { Injectable } from '@angular/core';

// Import RxJs for handle async request to server
import {
  Observable, // It's just like a promise base thing, if use this, you will return kind of promise things.
  BehaviorSubject, // Just like wathing some value, that return Observable that you must subscribe to use it
  throwError, // Throwing error to client side or component in this case
} from 'rxjs';

// Import operators RxJs, to interact with data that we receive form server
import {
  map, // function that for mapping data from server
  catchError, // function hat for catching an error from server
} from 'rxjs/operators';

// Import HTTP for interact with server
import {
  HttpClient, // module that used for interact with the server (Must import HttpClientModule to your entrypoint to use this)
} from '@angular/common/http';

// Import your model
import { Todo } from '../models/todo.model';

// Create interface for our todo, it's for represent data that we gonna receive
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
          // Delete userId, we don't need'em
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
        // Filter out the existed todos to deleting the choosed one
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
