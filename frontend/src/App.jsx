import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      // 최신순으로 정렬해서 보여주기
      setTodos(response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

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

  const toggleComplete = async (id, completed) => {
    try {
      // 로컬 상태를 먼저 업데이트해서 반응성 높이기 (Optimistic UI)
      setTodos(todos.map(todo => 
        todo._id === id ? { ...todo, completed: !completed } : todo
      ));
      await axios.put(`${API_URL}/${id}`, { completed: !completed });
    } catch (error) {
      console.error("수정 실패:", error);
      fetchTodos(); // 실패 시 원상복구
    }
  };

  const deleteTodo = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      // 로컬 상태를 먼저 업데이트
      setTodos(todos.filter(todo => todo._id !== id));
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error("삭제 실패:", error);
      fetchTodos(); // 실패 시 원상복구
    }
  };

  return (
    // 배경: 은은한 푸른색 그라데이션
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      
      {/* 메인 컨테이너: 카드 형태 */}
      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-indigo-200">
        
        {/* 헤더 섹션: 그라데이션 배경 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
          <h1 className="text-4xl font-extrabold text-white flex items-center justify-center gap-3 tracking-tight">
            <span className="text-5xl">✨</span>
              My Task Planner
          </h1>
  
      {/* 👇 현재 날짜 표시 영역 */}
      <div className="mt-4 inline-block bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
          <p className="text-indigo-50 font-semibold flex items-center gap-2">
            <span className="text-xl">📅</span>
              {new Date().toLocaleDateString('ko-KR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric', 
                weekday: 'long' 
              })}
          </p>
        </div>
  
        <p className="text-indigo-100 mt-3 text-lg font-medium opacity-90">
          오늘의 할 일을 멋지게 계획해보세요.
        </p>
      </div>
        
        {/* 입력 및 리스트 섹션 */}
        <div className="p-8">
          
          {/* 입력창 & 추가 버튼 */}
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

          {/* 투두 리스트 */}
          {isLoading ? (
            <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              로딩 중입니다...
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-20 text-gray-400 flex flex-col items-center gap-6 border-2 border-dashed border-gray-200 rounded-2xl">
              <span className="text-7xl">🥳</span>
              <p className="text-xl font-semibold">모든 일을 마치셨군요! <br/>이제 푹 쉬세요.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {todos.map(todo => (
                // 개별 투두 항목: 마우스 올리면 뜨는 효과
                <li key={todo._id} className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group hover:border-indigo-100 hover:shadow-indigo-50 hover:bg-indigo-50/30 transition-all duration-300 transform hover:-translate-y-1">
                  
                  <div className="flex items-center gap-4 flex-1">
                    {/* 체크박스: 커스텀 스타일 */}
                    <input 
                      type="checkbox" 
                      className="w-7 h-7 text-indigo-600 rounded-full border-2 border-indigo-200 focus:ring-indigo-500 cursor-pointer transition-colors"
                      checked={todo.completed} 
                      onChange={() => toggleComplete(todo._id, todo.completed)}
                    />
                    
                    {/* 투두 제목: 완료 시 줄 긋기 및 투명도 조절 */}
                    <span className={`text-xl font-medium transition-all duration-300 break-words flex-1 ${todo.completed ? 'line-through text-gray-400 opacity-60' : 'text-gray-800'}`}>
                      {todo.title}
                    </span>
                  </div>

                  {/* 삭제 버튼: 마우스 올렸을 때만 나타남 */}
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

          {/* 하단 통계 */}
          {todos.length > 0 && (
          <div className="mb-8 bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Progress</h2>
                <p className="text-2xl font-black text-indigo-900">
                  {Math.round((todos.filter(t => t.completed).length / todos.length) * 100)}% 완료
              </p>
            </div>
            <div className="text-right">
              <span className="text-indigo-600 font-bold text-lg">{todos.filter(t => t.completed).length}</span>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-gray-600 font-medium">{todos.length}</span>
            </div>
          </div>

          {/* 진행 바 (Progress Bar) */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 ease-out"
              style={{ width: `${(todos.filter(t => t.completed).length / todos.length) * 100}%` }}
            ></div>
          </div>

          {/* 간단한 격려 문구 */}
          <p className="mt-3 text-sm text-indigo-500 font-medium">
            {Math.round((todos.filter(t => t.completed).length / todos.length) * 100) === 100 
              ? "🎉 완벽해요! 모든 일을 끝내셨군요." 
              : "조금만 더 힘내세요! 할 수 있습니다. 💪"}
            </p>
          </div>
          )}
        </div>
        
      </div>

      {/* 푸터 (과제 제출용 정보) */}
      <footer className="text-center mt-12 text-indigo-400 font-medium">
        &copy; 2026 Todo Planner - 20223132 임민수
      </footer>

    </div>
          
  )
}

export default App