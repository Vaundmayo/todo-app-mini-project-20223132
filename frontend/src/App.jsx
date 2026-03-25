import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 1. 선택된 날짜 상태 추가 (기본값: 오늘 날짜 YYYY-MM-DD 형식)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      // 최신순 정렬
      setTodos(response.data);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // 2. 현재 선택된 날짜에 해당하는 할 일만 필터링
  const filteredTodos = todos.filter(todo => todo.date === selectedDate);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!input) return;
    try {
      // 👇 현재 달력에서 선택된 날짜(selectedDate)를 서버에 함께 보냅니다.
      await axios.post(API_URL, { 
        title: input, 
        date: selectedDate 
      });
      setInput('');
      fetchTodos();
    } catch (error) {
      console.error("추가 실패:", error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      setTodos(todos.map(todo => 
        todo._id === id ? { ...todo, completed: !completed } : todo
      ));
      await axios.put(`${API_URL}/${id}`, { completed: !completed });
    } catch (error) {
      console.error("수정 실패:", error);
      fetchTodos();
    }
  };

  const deleteTodo = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      setTodos(todos.filter(todo => todo._id !== id));
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("삭제 실패:", error);
      fetchTodos();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-indigo-200">
        
        {/* 헤더 섹션 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
          <h1 className="text-4xl font-extrabold text-white flex items-center justify-center gap-3 tracking-tight">
            <span className="text-5xl">✨</span>
              My Task Planner
          </h1>
  
          {/* 3. 날짜 표시 영역을 날짜 선택기로 변경 */}
          <label className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-all cursor-pointer group">
            <span className="text-xl">📅</span>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              // 클릭 시 브라우저 날짜 선택기 강제 실행
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              className="bg-transparent border-none outline-none cursor-pointer text-white font-bold [color-scheme:dark] group-hover:text-indigo-100 transition-colors"
            />
          </label>
  
          <p className="text-indigo-100 mt-3 text-lg font-medium opacity-90">
            {selectedDate === new Date().toISOString().split('T')[0] ? "오늘" : selectedDate}의 할 일을 계획해보세요.
          </p>
        </div>
        
        <div className="p-8">
          
          <form onSubmit={addTodo} className="flex gap-3 mb-10 items-center">
            <input 
              className="flex-1 px-6 py-4 border-2 border-indigo-100 rounded-full focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all text-lg placeholder:text-gray-300"
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="무엇을 해야 하나요?"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors flex items-center gap-2 shadow-lg shadow-indigo-100 active:scale-95 transform">
              <span className="text-2xl">+</span>
              추가
            </button>
          </form>

          {/* 4. 통계 섹션 (목록 위로 배치 & 간격 확보를 위해 mb-12 적용) */}
          {filteredTodos.length > 0 && (
            <div className="mb-12 bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Progress</h2>
                  <p className="text-2xl font-black text-indigo-900">
                    {Math.round((filteredTodos.filter(t => t.completed).length / filteredTodos.length) * 100)}% 완료
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-indigo-600 font-bold text-lg">{filteredTodos.filter(t => t.completed).length}</span>
                  <span className="text-gray-400 mx-1">/</span>
                  <span className="text-gray-600 font-medium">{filteredTodos.length}</span>
                </div>
              </div>

              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
                  style={{ width: `${(filteredTodos.filter(t => t.completed).length / filteredTodos.length) * 100}%` }}
                ></div>
              </div>

              <p className="mt-3 text-sm text-indigo-500 font-medium">
                {Math.round((filteredTodos.filter(t => t.completed).length / filteredTodos.length) * 100) === 100 
                  ? "🎉 완벽해요! 모든 일을 끝내셨군요." 
                  : "조금만 더 힘내세요! 할 수 있습니다. 💪"}
              </p>
            </div>
          )}

          {/* 📝 할 일 목록 섹션 */}
          <div className="space-y-4">
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-gray-200"></span>
              Task List for {selectedDate}
            </h3>

            {isLoading ? (
              <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                데이터를 가져오는 중...
              </div>
            ) : filteredTodos.length === 0 ? (
              <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-6 border-2 border-dashed border-gray-100 rounded-2xl">
                <span className="text-7xl">☕</span>
                <p className="text-xl font-semibold">이 날은 할 일이 없네요!<br/>여유를 즐겨보세요.</p>
              </div>
            ) : (
              <ul className="space-y-4">
                {filteredTodos.map(todo => (
                  <li key={todo._id} className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group hover:border-indigo-100 hover:shadow-indigo-50 hover:bg-indigo-50/30 transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex items-center gap-4 flex-1">
                      <input 
                        type="checkbox" 
                        className="w-7 h-7 text-indigo-600 rounded-full border-2 border-indigo-200 focus:ring-indigo-500 cursor-pointer transition-colors"
                        checked={todo.completed} 
                        onChange={() => toggleComplete(todo._id, todo.completed)}
                      />
                      <span className={`text-xl font-medium transition-all duration-300 break-words flex-1 ${todo.completed ? 'line-through text-gray-400 opacity-60' : 'text-gray-800'}`}>
                        {todo.title}
                      </span>
                    </div>
                    <button 
                      onClick={() => deleteTodo(todo._id)}
                      className="ml-4 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all duration-300 font-semibold p-2 rounded-full hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <footer className="text-center mt-12 text-indigo-400 font-medium">
        &copy; 2026 Todo Planner - 20223132 임민수
      </footer>
    </div>
  )
}

export default App;