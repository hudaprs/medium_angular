export class Todo {
  // Shorthand method
  // Define the object or data that you want to get from the server.
  constructor(
    public id: number,
    public title: string,
    public completed: boolean,
    public userId?: number
  ) {}

  // Or you can do this, it's the same as above, but's it's has more code.

  // public id: number;
  // public title: string;
  // public completed: boolean;
  // public userId?: number;

  // constructor(id: number, title:string, completed: boolean, public userId: number) {
  // this.id = id;
  // this.title = title;
  // this.completed = completed;
  // this.userId = userId
  // }
}
