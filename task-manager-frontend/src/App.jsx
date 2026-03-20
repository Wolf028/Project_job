import { useState, useEffect } from 'react'

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState(''); // กล่องเก็บข้อความเวลาเราพิมพ์งานใหม่

  // 1. ฟังก์ชันดึงข้อมูล (GET)
  const fetchTasks = () => {
    fetch('http://localhost:3000/tasks')
      .then(response => response.json())
      .then(data => setTasks(data));
  };

  // โหลดข้อมูลครั้งแรกเมื่อเปิดเว็บ
  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. ฟังก์ชันเพิ่มงานใหม่ (POST)
  const addTask = () => {
    if (newTaskTitle.trim() === '') return; // ถ้าไม่ได้พิมพ์อะไร ไม่ต้องส่งข้อมูล

    fetch('http://localhost:3000/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTaskTitle, completed: false })
    })
    .then(() => {
      setNewTaskTitle(''); // ล้างช่องพิมพ์ให้ว่าง
      fetchTasks(); // โหลดข้อมูลใหม่มาโชว์
    });
  };

  // 3. ฟังก์ชันสลับสถานะงาน (PUT)
  const toggleTask = (id) => {
    fetch(`http://localhost:3000/tasks/${id}`, { method: 'PUT' })
      .then(() => fetchTasks()); // โหลดข้อมูลใหม่มาโชว์
  };

  // 4. ฟังก์ชันลบงาน (DELETE)
  const deleteTask = (id) => {
    fetch(`http://localhost:3000/tasks/${id}`, { method: 'DELETE' })
      .then(() => fetchTasks()); // โหลดข้อมูลใหม่มาโชว์
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>📝 My Task Manager</h1>
      
      {/* ส่วนกรอกข้อมูลเพิ่มงานใหม่ */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          type="text" 
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="พิมพ์งานที่ต้องทำ..." 
          style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <button onClick={addTask} style={{ padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ➕ เพิ่มงาน
        </button>
      </div>

      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginTop: 0 }}>รายการงานของคุณ:</h2>
        
        {tasks.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center' }}>ยังไม่มีงานในระบบ ลองเพิ่มดูสิ!</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {tasks.map(task => (
              <li 
                key={task.id} 
                style={{ 
                  padding: '12px', 
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                {/* ปุ่มติ๊กถูก (คลิกเพื่อเปลี่ยนสถานะ) */}
                <input 
                  type="checkbox" 
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  style={{ transform: 'scale(1.5)', cursor: 'pointer' }}
                />
                
                {/* ข้อความงาน */}
                <span style={{ 
                  flex: 1, 
                  textDecoration: task.completed ? 'line-through' : 'none', 
                  color: task.completed ? '#aaa' : '#000' 
                }}>
                  {task.title}
                </span>

                {/* ปุ่มลบ */}
                <button 
                  onClick={() => deleteTask(task.id)}
                  style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  ลบ 🗑️
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App