import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// Import model
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
})
export class TodoItemComponent implements OnInit {
  @Input() todo: Todo;
  @Output() removeTodo: EventEmitter<number> = new EventEmitter();

  constructor() {}

  onDelete(userId: number): void {
    this.removeTodo.emit(userId);
  }

  ngOnInit(): void {}
}
