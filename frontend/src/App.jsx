import { useState, useEffect } from 'react'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL || '/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const API_URL = '/api/todos';

  // 1. 목록 가져오기 (Read)
  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 2. 추가하기 (Create)
  const addTodo = async (e) => {
    e.preventDefault();
    if (!input) return;
    try {
      await axios.post(API_URL, { title: input });
      setInput('');
      fetchTodos();
    } catch (error) {
      console.error("추가 실패:", error);
    }
  };

  // 3. 완료 상태 토글 (Update)
  const toggleComplete = async (id, completed) => {
    try {
      await axios.put(`${API_URL}/${id}`, { completed: !completed });
      fetchTodos();
    } catch (error) {
      console.error("수정 실패:", error);
    }
  };

  // 4. 삭제하기 (Delete)
  const deleteTodo = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>📝 My Todo List</h1>
      
      <form onSubmit={addTodo} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="오늘의 할 일은?"
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          추가
        </button>
      </form>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo._id} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '10px',
            borderBottom: '1px solid #eee',
            backgroundColor: todo.completed ? '#f9f9f9' : 'transparent'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="checkbox" 
                checked={todo.completed} 
                onChange={() => toggleComplete(todo._id, todo.completed)}
              />
              <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#888' : '#000' }}>
                {todo.title}
              </span>
            </div>
            <button 
              onClick={() => deleteTodo(todo._id)}
              style={{ padding: '5px 10px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App