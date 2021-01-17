import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodosComponent } from './components/todos/todos.component';
import { TodoCreateComponent } from './components/todo-create/todo-create.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';

@NgModule({
  // Register your components here
  declarations: [
    AppComponent,
    TodosComponent,
    TodoCreateComponent,
    TodoItemComponent,
  ],
  // Register any modules from angular or another third party modules, need to be imported in here
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  // Register any providers(Service, etc) right here
  // NOTE: If you use @Injectable({ providedIn: 'root' }) in your service, you dont need to register it
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
