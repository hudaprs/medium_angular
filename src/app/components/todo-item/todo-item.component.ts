import {
  Component,
  OnInit,
  Input, // For accepting object binding from parent component
  Output, // For accepting event handler from parent component
  EventEmitter,
} from '@angular/core';

// Import model
import { Todo } from '../../models/todo.model';
@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})
export class TodoItemComponent implements OnInit {
  // Accept object binding and event handler from parent
  @Input() todo: Todo;
  @Output() removeTodo: EventEmitter<number> = new EventEmitter();

  constructor() {}

  onDelete(todoId: number): void {
    // Emit the event from parent for deleting todo
    this.removeTodo.emit(todoId);
  }

  ngOnInit(): void {}
}
