import React, { useState } from "react";
import * as Sentry from "@sentry/react";
import { SpanStatusType } from "@sentry/tracing";
import ReactDOM from "react-dom";
import Todo from "./Todo";
import NewTodoForm from "./NewTodoForm";
import uuid from "uuid";
import "./TodoList.css";

function TodoList() {
  const [todos, setTodos] = useState([
    { id: uuid(), task: "task 1", completed: false },
    { id: uuid(), task: "task 2", completed: true }
  ]);

  const create = (newTodo) => {
    const transaction = Sentry.startTransaction({ name: "create-item" });
    const span = transaction.startChild({
      op: "create",
      description: "create item",
      data: {
        item: newTodo
      }
    });

    console.log(newTodo);
    setTodos([...todos, newTodo]);
    span.setStatus("ok");
    span.finish();
    transaction.setStatus("ok").finish();
  };

  const remove = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const update = (id, updtedTask) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, task: updtedTask };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const toggleComplete = (id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const todosList = todos.map((todo) => (
    <Todo
      toggleComplete={toggleComplete}
      update={update}
      remove={remove}
      key={todo.id}
      todo={todo}
    />
  ));

  return (
    <div className="TodoList">
      <h1>
        Todo List <span>A simple React Todo List App</span>
      </h1>
      <ul>{todosList}</ul>
      <NewTodoForm createTodo={create} />
    </div>
  );
}

export default TodoList;
