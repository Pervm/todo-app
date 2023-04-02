import React, { createContext, useContext, useState } from 'react';

// Tworzymy kontekst aplikacji
const TodoContext = createContext();

// Właściwość Provider zapewnia dostarczenie stanu aplikacji do komponentów podrzędnych
const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);

  // Funkcje do dodawania, usuwania i edycji zadań
  const addTodo = (text) => {
    const newTodo = { id: Date.now(), text, completed: false };
    setTodos([...todos, newTodo]);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const editTodo = (id, newText) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, text: newText };
        }
        return todo;
      })
    );
  };

  return (
    <TodoContext.Provider value={{ todos, addTodo, deleteTodo, editTodo }}>
      {children}
    </TodoContext.Provider>
  );
};

// Zwracamy kontekst aplikacji
const useTodoContext = () => useContext(TodoContext);

// Kontener Todo zarządza stanem aplikacji i dostarcza go do komponentów prezentacyjnych
const KontenerTodo = ({ children }) => {
  const { todos, addTodo, deleteTodo, editTodo } = useTodoContext();
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAddTodo = (e) => {
    e.preventDefault();
    const input = e.target.elements.todo;
    const text = input.value.trim();
    if (text) {
      addTodo(text);
      input.value = '';
    }
  };

  const handleDeleteTodo = (id) => {
    deleteTodo(id);
  };

  const handleEditTodo = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    editTodo(editId, editText);
    setEditId(null);
    setEditText('');
  };

  return (
    <div>
      <form onSubmit={handleAddTodo}>
        <input type="text" name="todo" placeholder="Add todo" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {editId === todo.id ? (
              <form onSubmit={handleSaveEdit}>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button type="submit">Save</button>
              </form>
            ) : (
              <span>{todo.text}</span>
            )}
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
            <button onClick={() => handleEditTodo(todo.id, todo.text)}>
              Edit
            </button>
          </li>
        ))}
      </ul>
      {children}
</div>
);
};

// Komponent prezentacyjny Todo
const Todo = () => {
return (
<KontenerTodo>
<h1>Todo List</h1>
</KontenerTodo>
);
};

export default function App() {
return (
<TodoProvider>
<Todo />
</TodoProvider>
);
}