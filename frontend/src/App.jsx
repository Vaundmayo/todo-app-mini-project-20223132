import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || '/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate]);

  const filteredTodos = todos.filter(todo => todo.date === selectedDate);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!input) return;
    try {
      await axios.post(API_URL, { 
        title: input, 
        date: selectedDate 
      });
      setInput('');
      fetchTodos();
      setCurrentPage(1);
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

  // 선택 날짜 전체 삭제
  const deleteAllByDate = async () => {
    if (filteredTodos.length === 0) return;
    if (!window.confirm(`${selectedDate}의 할 일 ${filteredTodos.length}개를 모두 삭제하시겠습니까?`)) return;
    try {
      await Promise.all(filteredTodos.map(todo => axios.delete(`${API_URL}/${todo._id}`)));
      setTodos(todos.filter(todo => todo.date !== selectedDate));
      setCurrentPage(1);
    } catch (error) {
      console.error("전체 삭제 실패:", error);
      fetchTodos();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-gray-900">
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-stretch">
        
        {/* 왼쪽 사이드바 */}
        <div className="w-full lg:w-1/3 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col">
          <div className="text-center mb-10 border-b border-gray-100 pb-8">
            <h1 className="text-3xl font-black text-blue-700 flex items-center justify-center gap-3 tracking-tight">
              <span className="text-4xl">🔥</span>
              作 心 三 日
              <span className="text-4xl">🔥</span>
            </h1>

            <h1 className="text-3xl font-black text-blue-700 flex items-center justify-center gap-3 tracking-tight">
              <span className="text-4xl">🔥</span>
              작 심 삼 일
              <span className="text-4xl">🔥</span>
            </h1>
            
            <label className="mt-6 inline-flex items-center gap-3 bg-blue-50 px-6 py-3 rounded-full border border-blue-100 hover:bg-blue-100 transition-all cursor-pointer group w-full justify-center">
              <span className="text-xl">📅</span>
              <input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                onClick={(e) => e.target.showPicker && e.target.showPicker()}
                className="bg-transparent border-none outline-none cursor-pointer text-blue-900 font-bold text-lg group-hover:text-blue-700 transition-colors"
              />
            </label>
            <p className="text-gray-500 mt-4 font-medium">선택한 날짜의 할 일을 관리하세요.</p>
          </div>

          {/* 통계 + 삭제 버튼: 하단 고정 */}
          <div className="mt-auto flex flex-col gap-4">
            {filteredTodos.length > 0 ? (
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-100">
                <div className="flex justify-between items-end mb-4 font-bold">
                  <div>
                    <h2 className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Progress</h2>
                    <p className="text-2xl font-black">
                      {Math.round((filteredTodos.filter(t => t.completed).length / filteredTodos.length) * 100)}% 완료
                    </p>
                  </div>
                  <p className="text-base opacity-80">
                    {filteredTodos.filter(t => t.completed).length} / {filteredTodos.length}
                  </p>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden border border-white/10 shadow-inner">
                  <div 
                    className="h-full bg-white transition-all duration-500 rounded-full shadow"
                    style={{ width: `${(filteredTodos.filter(t => t.completed).length / filteredTodos.length) * 100}%` }}
                  ></div>
                </div>
                <p className="mt-3 text-center text-indigo-100 font-medium text-sm">
                  {Math.round((filteredTodos.filter(t => t.completed).length / filteredTodos.length) * 100) === 100 
                    ? "🎉 완벽해요! 모든 일을 끝내셨군요." 
                    : "조금만 더 힘내세요! 💪"}
                </p>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-2xl border border-gray-100 text-gray-400">
                <span className="text-4xl block mb-2">☕</span>
                <p className="font-medium">이 날은 할 일이 없네요!</p>
              </div>
            )}

            <button
              onClick={deleteAllByDate}
              disabled={filteredTodos.length === 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all
                bg-red-50 text-red-400 border border-red-100
                hover:bg-red-500 hover:text-white hover:border-red-500 hover:shadow-lg hover:shadow-red-100
                disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-red-50 disabled:hover:text-red-400 disabled:hover:border-red-100 disabled:hover:shadow-none
                active:scale-95"
            >
              <span>🗑️</span>
              {selectedDate} 전체 삭제
            </button>
          </div>
        </div>

        {/* 오른쪽 메인 섹션 */}
        <div className="w-full lg:w-2/3 bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col min-h-[600px]">
          
          <div className="border-b border-gray-100 pb-8 mb-8">
            <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-gray-200"></span>
              ADD TASK FOR {selectedDate}
            </h3>
            <form onSubmit={addTodo} className="flex gap-3 items-center">
              <input 
                className="flex-1 px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all text-lg placeholder:text-gray-300"
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="무엇을 해야 하나요?"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-95 transform">추가</button>
            </form>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              {isLoading ? (
                <div className="text-center py-20 text-gray-400 animate-pulse font-medium">로딩 중...</div>
              ) : filteredTodos.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 font-semibold text-xl">📝 계획을 세워보세요.</div>
              ) : (
                <ul className="space-y-4">
                  {currentTodos.map(todo => (
                    <li key={todo._id} className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm group hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-0.5">
                      <div className="flex items-center gap-4 flex-1">
                        <input type="checkbox" className="w-7 h-7 text-blue-600 rounded-full border-2 border-blue-200 cursor-pointer" checked={todo.completed} onChange={() => toggleComplete(todo._id, todo.completed)} />
                        <span className={`text-xl font-semibold break-words flex-1 ${todo.completed ? 'line-through text-gray-400 opacity-70' : 'text-gray-800'}`}>{todo.title}</span>
                      </div>
                      <button onClick={() => deleteTodo(todo._id)} className="ml-4 text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 rounded-full hover:bg-red-50">삭제</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {filteredTodos.length > postsPerPage && (
              <div className="mt-auto pt-10 border-t border-gray-100 flex justify-center items-center gap-3">
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1} 
                  className="px-5 py-2 bg-gray-50 text-blue-600 rounded-xl font-bold border border-blue-100 disabled:opacity-30 disabled:hover:bg-gray-50 transition-all hover:bg-blue-50 active:scale-95"
                >
                  &larr; 이전
                </button>
              
                <div className="flex gap-2">
                  {[...Array(Math.ceil(filteredTodos.length / postsPerPage)).keys()].map(number => (
                    <button 
                      key={number + 1} 
                      onClick={() => paginate(number + 1)} 
                      className={`w-11 h-11 rounded-2xl text-sm font-black transition-all ${currentPage === number + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110' : 'bg-white text-blue-600 border border-blue-100 hover:bg-blue-50'}`}
                    >
                      {number + 1}
                    </button>
                  ))}
                </div>
              
                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === Math.ceil(filteredTodos.length / postsPerPage)} 
                  className="px-5 py-2 bg-gray-50 text-blue-600 rounded-xl font-bold border border-blue-100 disabled:opacity-30 disabled:hover:bg-gray-50 transition-all hover:bg-blue-50 active:scale-95"
                >
                  다음 &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="text-center mt-16 text-slate-400 font-medium">
        &copy; 2026 Todo Planner - 20223132 임민수
      </footer>
    </div>
  )
}

export default App;