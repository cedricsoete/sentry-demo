import React from "react";
import ReactDOM from "react-dom";
import TodoList from "./TodoList.js";
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import "./styles.css";

Sentry.init({
  dsn: "https://58ad35fa068a4719b4f9f78d966da272@sentry.cedricsoete.ovh/3",
  integrations: [new BrowserTracing()],
  release: "0.0.0",
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  debug: false,
  beforeBreadcrumb(breadcrumb, hint) {
    if (breadcrumb.category === "console") {
      return null;
    }
    if (breadcrumb.category.startsWith("ui")) {
      // if (hint.id) {
      //   breadcrumb.message = hint.id;
      // }
      const action = document.querySelector(breadcrumb.message);
      if (action.id) {
        breadcrumb.message = action.id;
      }
    }
    return breadcrumb;
  }
});

// Project for Udemy react bootcamp
// https://www.udemy.com/course/modern-react-bootcamp/

function App() {
  return (
    <div className="App">
      <TodoList />
    </div>
  );
}

const AppWithProfiler = Sentry.withProfiler(App);

const rootElement = document.getElementById("root");
ReactDOM.render(<AppWithProfiler />, rootElement);
