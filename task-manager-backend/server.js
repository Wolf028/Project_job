const express = require('express');
const cors = require('cors'); // 🌟 1. นำเข้าเครื่องมือ CORS
const app = express();
const PORT = 3000;


// คำสั่งนี้ทำให้ Server ของเราอ่านข้อมูลแบบ JSON ได้ (สำคัญมากสำหรับ API)
app.use(cors()); // 🌟 2. สั่งให้เซิร์ฟเวอร์อนุญาตให้หน้าบ้านมาเชื่อมต่อได้
app.use(express.json());

// จำลองฐานข้อมูลชั่วคราว (เก็บข้อมูลไว้ใน Array ก่อน)
let tasks = [
  { id: 1, title: 'เรียนรู้วิธีสร้าง Server', completed: true },
  { id: 2, title: 'สร้าง API ดึงข้อมูลงาน', completed: false }
];

// หน้าแรกเหมือนเดิม
app.get('/', (req, res) => {
  res.send('Hello, Task Manager API is running! 🚀');
});

// 🌟 สร้างเส้นทางใหม่ (Route) สำหรับดึงรายการงานทั้งหมด
app.get('/tasks', (req, res) => {
  // ส่งข้อมูลตัวแปร tasks ออกไปในรูปแบบ JSON
  res.json(tasks);
});

// 🌟 สร้างเส้นทางใหม่สำหรับ "เพิ่ม" งาน (POST)
app.post('/tasks', (req, res) => {
  // รับข้อมูลที่ส่งเข้ามา (เช่น ชื่อรายการงาน)
  const newTask = req.body; 
  
  // กำหนด ID ให้งานใหม่ (สร้างตัวเลข ID รันต่อไปเรื่อยๆ)
  newTask.id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
  
  // ยัดข้อมูลใหม่ใส่เข้าไปใน Array ของเรา
  tasks.push(newTask);
  
  // ส่งข้อความยืนยันกลับไปให้คนที่ส่งข้อมูลมา
  res.json({ message: 'เพิ่มงานสำเร็จแล้ว! 🎉', task: newTask });
});

// 🌟 แก้ไขสถานะงาน (PUT) - สลับสถานะว่าทำเสร็จแล้วหรือยัง
app.put('/tasks/:id', (req, res) => {
  // ดึง ID ของงานที่ต้องการแก้ไขจาก URL
  const taskId = parseInt(req.params.id); 
  
  // ค้นหาว่างานนี้อยู่ในลำดับที่เท่าไหร่
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex !== -1) {
    // ถ้าเจอ ให้สลับสถานะ (ถ้า false เป็น true, ถ้า true เป็น false)
    tasks[taskIndex].completed = !tasks[taskIndex].completed; 
    res.json({ message: 'อัปเดตสถานะสำเร็จ!', task: tasks[taskIndex] });
  } else {
    // ถ้าไม่เจอ ID นี้ ให้แจ้งเตือน Error
    res.status(404).json({ message: 'หางานไม่เจอ!' });
  }
});

// 🌟 ลบงาน (DELETE)
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  // คัดกรองเอางานที่ ID ไม่ตรงกับที่ส่งมาเก็บไว้ (แปลว่าลบตัวที่ตรงกันทิ้งไป)
  tasks = tasks.filter(t => t.id !== taskId);
  res.json({ message: 'ลบงานสำเร็จแล้ว! 🗑️' });
});

// สั่งให้ Server เริ่มทำงาน
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});