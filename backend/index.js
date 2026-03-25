require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 미들웨어 설정
app.use(cors());
app.use(express.json()); // JSON 데이터 파싱용

// 1. MongoDB 연결
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB 연결 성공'))
  .catch(err => console.error('❌ MongoDB 연결 실패:', err));

// 2. Todo 스키마 및 모델 정의
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  date: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now }
});
const Todo = mongoose.model('Todo', todoSchema);

// 3. API 엔드포인트 (CRUD)

// [GET] 모든 할 일 가져오기
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 }); // 최신순 정렬
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// [POST] 새로운 할 일 추가
app.post('/api/todos', async (req, res) => {
  try {
    const { title, date } = req.body; // 👈 date를 추가로 받음
    const newTodo = new Todo({ 
      title, 
      date: date || new Date().toISOString().split('T')[0] // 날짜가 없으면 오늘 날짜로 저장
    });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// [PUT] 할 일 상태 변경 (체크박스)
app.put('/api/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id, 
      { completed: req.body.completed }, 
      { new: true }
    );
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// [DELETE] 할 일 삭제
app.delete('/api/todos/:id', async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: '삭제 완료' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 로컬 테스트용 서버 실행
const PORT = process.env.PORT || 5000;

// 로컬 환경에서만 서버를 직접 실행
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`서버 실행 중: http://localhost:${PORT}`));
}

module.exports = app; // 👈 Vercel이 인식할 수 있게 export 필수!