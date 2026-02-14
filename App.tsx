
import React, { useState, useMemo, useEffect } from 'react';
import { Task, TaskStatus, Priority, Staff, KPIStats } from './types';
import { INITIAL_STAFF, MOCK_TASKS, getStatusColor, getPriorityColor } from './constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

const App: React.FC = () => {
  // Load data from localStorage on init
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('fpt_manager_tasks');
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });
  
  const [staff] = useState<Staff[]>(INITIAL_STAFF);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'report'>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sync with localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('fpt_manager_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Stats Logic
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
    const overdue = tasks.filter(t => t.status === TaskStatus.OVERDUE).length;
    const inProgress = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
    
    const kpiSummary = tasks.reduce((acc, curr) => {
      if (curr.status === TaskStatus.COMPLETED) {
        const type = curr.kpiType.toLowerCase();
        if (type === 'net' || type === 'pay' || type === 'cam') {
          acc[type] += curr.kpiValue;
        }
      }
      return acc;
    }, { net: 0, pay: 0, cam: 0 } as KPIStats);

    return { total, completed, overdue, inProgress, kpiSummary };
  }, [tasks]);

  const staffPerformance = useMemo(() => {
    return staff.map(s => {
      const staffTasks = tasks.filter(t => t.assignee === s.name);
      const done = staffTasks.filter(t => t.status === TaskStatus.COMPLETED).length;
      const total = staffTasks.length;
      const rate = total === 0 ? 0 : Math.round((done / total) * 100);
      
      const score = rate;
      let rank: 'A' | 'B' | 'C' = 'C';
      if (score >= 90) rank = 'A';
      else if (score >= 70) rank = 'B';

      return {
        name: s.name,
        'Hoàn thành (%)': rate,
        'Số việc': total,
        score,
        rank
      };
    });
  }, [tasks, staff]);

  // Form State
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    assignee: staff[0].name,
    deadline: new Date().toISOString().split('T')[0],
    priority: Priority.MEDIUM,
    status: TaskStatus.NOT_STARTED,
    kpiType: 'NET',
    kpiValue: 1,
    target: '',
    notes: ''
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const task: Task = {
      ...newTask as Task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    setTasks([task, ...tasks]);
    setIsModalOpen(false);
    // Reset form
    setNewTask({ ...newTask, title: '', target: '', notes: '' });
  };

  const updateTaskStatus = (id: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const deleteTask = (id: string) => {
    if (confirm('Anh/Chị có chắc chắn muốn xóa công việc này?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `fpt_tasks_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedTasks = JSON.parse(event.target?.result as string);
          if (Array.isArray(importedTasks)) {
            setTasks(importedTasks);
            alert('Đã khôi phục dữ liệu thành công!');
          }
        } catch (err) {
          alert('Lỗi định dạng file!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="bg-fpt-blue text-white w-full md:w-64 flex-shrink-0 shadow-xl z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-white p-1 rounded shadow-sm">
            <span className="text-fpt-orange font-bold text-xl italic tracking-tighter">FPT</span>
          </div>
          <h1 className="text-lg font-bold">Sales Hub</h1>
        </div>
        
        <nav className="mt-6">
          {[
            { id: 'dashboard', icon: 'fa-chart-line', label: 'Dashboard' },
            { id: 'tasks', icon: 'fa-tasks', label: 'Công việc' },
            { id: 'report', icon: 'fa-award', label: 'Xếp hạng' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-200 ${activeTab === tab.id ? 'bg-fpt-orange font-bold' : 'hover:bg-blue-800 opacity-80 hover:opacity-100'}`}
            >
              <i className={`fas ${tab.icon} w-5`}></i> {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-12 p-6">
          <p className="text-xs uppercase font-bold opacity-50 mb-4 tracking-widest">Hệ thống</p>
          <div className="space-y-2">
            <button onClick={exportData} className="w-full text-left text-sm py-2 px-3 rounded hover:bg-blue-800 transition-colors flex items-center gap-2">
              <i className="fas fa-download text-xs"></i> Sao lưu dữ liệu
            </button>
            <label className="w-full text-left text-sm py-2 px-3 rounded hover:bg-blue-800 transition-colors flex items-center gap-2 cursor-pointer">
              <i className="fas fa-upload text-xs"></i> Khôi phục dữ liệu
              <input type="file" className="hidden" onChange={importData} accept=".json" />
            </label>
          </div>
        </div>

        <div className="mt-auto p-6 hidden md:block">
          <div className="bg-blue-900 bg-opacity-40 p-4 rounded-xl border border-blue-700">
            <p className="text-[10px] uppercase font-bold opacity-60 mb-1">Đang đăng nhập</p>
            <p className="font-semibold text-fpt-orange truncate">Trưởng phòng Kinh doanh</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 bg-gray-50">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {activeTab === 'dashboard' && 'Tổng quan Hiệu suất'}
              {activeTab === 'tasks' && 'Danh mục Công việc'}
              {activeTab === 'report' && 'Thi đua & Xếp hạng'}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-slate-500 text-sm font-medium">Chi nhánh FPT Telecom • Trực tuyến</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-fpt-orange text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-[0_10px_20px_-5px_rgba(243,112,33,0.4)] transform hover:-translate-y-1"
          >
            <i className="fas fa-plus-circle"></i> Giao việc mới
          </button>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Tổng số việc" value={stats.total} icon="fa-list-check" color="blue" />
              <StatCard title="Hoàn thành" value={stats.completed} icon="fa-check-circle" color="green" />
              <StatCard title="Đang xử lý" value={stats.inProgress} icon="fa-clock" color="orange" />
              <StatCard title="Trễ hạn" value={stats.overdue} icon="fa-exclamation-triangle" color="red" isAlert={stats.overdue > 0} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                { label: 'Internet (NET)', val: stats.kpiSummary.net, icon: 'fa-wifi', color: 'text-blue-600', bg: 'bg-blue-100', unit: 'HĐ' },
                { label: 'FPT Play', val: stats.kpiSummary.pay, icon: 'fa-play-circle', color: 'text-fpt-orange', bg: 'bg-orange-100', unit: 'HĐ' },
                { label: 'Camera', val: stats.kpiSummary.cam, icon: 'fa-video', color: 'text-purple-600', bg: 'bg-purple-100', unit: 'Thiết bị' }
              ].map(k => (
                <div key={k.label} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center group hover:shadow-md transition-all">
                  <div className={`w-14 h-14 ${k.bg} rounded-2xl flex items-center justify-center mb-4 ${k.color} text-xl group-hover:scale-110 transition-transform`}>
                    <i className={`fas ${k.icon}`}></i>
                  </div>
                  <p className="text-slate-400 uppercase text-[10px] font-black tracking-widest">{k.label}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-black text-slate-800">{k.val}</span>
                    <span className="text-sm font-bold text-slate-400">{k.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold mb-8 text-slate-700 flex items-center gap-2">
                  <i className="fas fa-chart-bar text-fpt-orange"></i> Tỷ lệ hoàn thành theo nhân sự
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={staffPerformance}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: '#f8fafc'}} />
                      <Bar dataKey="Hoàn thành (%)" fill="#F37021" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold mb-8 text-slate-700 flex items-center gap-2">
                  <i className="fas fa-chart-pie text-fpt-blue"></i> Phân bổ trạng thái
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Hoàn thành', value: stats.completed },
                          { name: 'Đang làm', value: stats.inProgress },
                          { name: 'Trễ hạn', value: stats.overdue },
                          { name: 'Chưa làm', value: stats.total - stats.completed - stats.inProgress - stats.overdue }
                        ]}
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={8}
                        dataKey="value"
                      >
                        <Cell fill="#10B981" />
                        <Cell fill="#3B82F6" />
                        <Cell fill="#EF4444" />
                        <Cell fill="#CBD5E1" />
                      </Pie>
                      <Tooltip />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="relative w-full max-w-md">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input type="text" placeholder="Tìm kiếm công việc, nhân viên..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-fpt-orange outline-none transition-all" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-wider">
                    <th className="px-8 py-5">Công việc / Mục tiêu</th>
                    <th className="px-6 py-5">Nhân sự</th>
                    <th className="px-6 py-5">Hạn chót</th>
                    <th className="px-6 py-5 text-center">KPI</th>
                    <th className="px-6 py-5">Trạng thái</th>
                    <th className="px-8 py-5 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tasks.map(task => (
                    <tr key={task.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-10 rounded-full ${task.priority === Priority.HIGH ? 'bg-red-500' : task.priority === Priority.MEDIUM ? 'bg-orange-400' : 'bg-blue-400'}`}></div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{task.title}</p>
                            <p className="text-[11px] text-slate-400 font-medium italic mt-0.5">{task.target}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase border-2 border-white shadow-sm">
                            {task.assignee.split(' ').pop()?.substring(0, 2)}
                          </div>
                          <span className="text-sm font-semibold text-slate-700">{task.assignee}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold ${new Date(task.deadline) < new Date() && task.status !== TaskStatus.COMPLETED ? 'text-red-500' : 'text-slate-600'}`}>
                            {new Date(task.deadline).toLocaleDateString('vi-VN')}
                          </span>
                          <span className="text-[10px] text-slate-400">{new Date(task.deadline) < new Date() ? 'Quá hạn' : 'Đang tới'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-lg text-[10px] font-black border border-slate-200">
                          {task.kpiValue} {task.kpiType}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <select 
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                          className={`text-[11px] font-black px-4 py-1.5 rounded-full border-none focus:ring-2 focus:ring-fpt-orange cursor-pointer shadow-sm transition-all ${getStatusColor(task.status)}`}
                        >
                          {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => deleteTask(task.id)}
                          className="w-8 h-8 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {tasks.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center opacity-30">
                          <i className="fas fa-folder-open text-5xl mb-4"></i>
                          <p className="font-bold">Chưa có công việc nào được giao</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'report' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100 gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Xếp hạng nhân sự</h3>
                <p className="text-slate-500 text-sm">Cập nhật lúc {new Date().toLocaleTimeString('vi-VN')}</p>
              </div>
              <button 
                onClick={() => window.print()}
                className="bg-slate-800 text-white px-6 py-2.5 rounded-xl flex items-center gap-3 hover:bg-slate-900 transition-all font-bold text-sm shadow-lg"
              >
                <i className="fas fa-print"></i> In báo cáo tuần
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {staffPerformance.sort((a, b) => b.score - a.score).map((item, index) => (
                <div key={item.name} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative group hover:-translate-y-2 transition-all duration-300">
                  <div className={`absolute top-0 right-0 w-24 h-24 flex items-end justify-center pb-4 text-white font-black text-3xl rotate-45 translate-x-12 -translate-y-12 shadow-lg ${
                    index === 0 ? 'bg-fpt-orange' : index === 1 ? 'bg-blue-600' : 'bg-slate-400'
                  }`}>
                    #{index + 1}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black border-4 border-white shadow-md ${
                      item.rank === 'A' ? 'bg-orange-100 text-fpt-orange' : item.rank === 'B' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.rank}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-800 leading-tight">{item.name}</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Nhân viên kinh doanh</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <div className="flex justify-between text-xs font-black uppercase mb-2">
                        <span className="text-slate-400">Tiến độ công việc</span>
                        <span className="text-fpt-blue">{item['Hoàn thành (%)']}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200/50">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            item.rank === 'A' ? 'bg-gradient-to-r from-orange-400 to-fpt-orange' : 'bg-fpt-blue'
                          }`} 
                          style={{ width: `${item['Hoàn thành (%)']}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Tổng việc</p>
                        <p className="font-black text-slate-800">{item['Số việc']}</p>
                      </div>
                      <div className="w-px h-8 bg-slate-200"></div>
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Điểm số</p>
                        <p className="font-black text-fpt-orange">{item.score}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-[10px] text-slate-400 uppercase font-black mb-2 flex items-center gap-1">
                        <i className="fas fa-comment-dots text-fpt-orange"></i> Nhận xét quản lý
                      </p>
                      <p className="text-sm italic text-slate-600 leading-relaxed font-medium">
                        {item.rank === 'A' ? 'Năng suất vượt trội, duy trì tốt phong độ.' : item.rank === 'B' ? 'Cần tập trung dứt điểm các task đang dở dang.' : 'Cần chấn chỉnh thái độ làm việc và báo cáo.'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-white/20">
            <div className="bg-fpt-orange p-8 text-white flex justify-between items-center relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-black tracking-tight">Giao nhiệm vụ mới</h3>
                <p className="opacity-80 text-sm font-medium">Thiết lập mục tiêu và KPI cho NVKD</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="relative z-10 text-white hover:rotate-90 transition-transform text-3xl font-light">&times;</button>
              <i className="fas fa-paper-plane absolute -bottom-4 -right-4 text-8xl opacity-10 -rotate-12"></i>
            </div>
            
            <form onSubmit={handleAddTask} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Tên công việc / Tên khách hàng</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-4 focus:ring-fpt-orange/10 focus:border-fpt-orange outline-none transition-all font-bold text-slate-800"
                  placeholder="VD: Ký HĐ Internet anh Hùng - Chung cư Moonlight"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Phân bổ nhân sự</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:border-fpt-orange font-bold text-slate-700"
                  value={newTask.assignee}
                  onChange={e => setNewTask({...newTask, assignee: e.target.value})}
                >
                  {staff.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Hạn hoàn thành</label>
                <input 
                  required
                  type="date" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:border-fpt-orange font-bold text-slate-700"
                  value={newTask.deadline}
                  onChange={e => setNewTask({...newTask, deadline: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Danh mục KPI</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:border-fpt-orange font-bold text-slate-700"
                  value={newTask.kpiType}
                  onChange={e => setNewTask({...newTask, kpiType: e.target.value as any})}
                >
                  <option value="NET">Internet (NET)</option>
                  <option value="PAY">FPT Play (PAY)</option>
                  <option value="CAM">Camera (CAM)</option>
                  <option value="MIX">Hỗn hợp</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Số lượng chỉ tiêu</label>
                <input 
                  type="number" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:border-fpt-orange font-bold text-slate-700"
                  value={newTask.kpiValue}
                  onChange={e => setNewTask({...newTask, kpiValue: parseInt(e.target.value)})}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Ghi chú hướng dẫn</label>
                <textarea 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:border-fpt-orange font-medium text-slate-700 h-28"
                  placeholder="Nhập yêu cầu chi tiết hoặc lưu ý cho nhân viên..."
                  value={newTask.notes}
                  onChange={e => setNewTask({...newTask, notes: e.target.value})}
                ></textarea>
              </div>

              <div className="col-span-2 flex justify-end gap-6 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-3 text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-600 transition-colors">Hủy bỏ</button>
                <button type="submit" className="bg-fpt-orange text-white px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-orange-200 hover:bg-orange-600 hover:-translate-y-1 transition-all">Giao việc ngay</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number; icon: string; color: string; isAlert?: boolean }> = ({ title, value, icon, color, isAlert }) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500 shadow-blue-100',
    green: 'bg-green-500 shadow-green-100',
    orange: 'bg-orange-500 shadow-orange-100',
    red: 'bg-red-500 shadow-red-100',
  };

  return (
    <div className={`bg-white p-6 rounded-[1.5rem] shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-lg transition-all ${isAlert ? 'ring-2 ring-red-100' : ''}`}>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
          <h3 className={`text-3xl font-black ${isAlert ? 'text-red-500' : 'text-slate-800'}`}>{value}</h3>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 ${colors[color]}`}>
          <i className={`fas ${icon} text-lg`}></i>
        </div>
      </div>
      <div className={`absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-5 transition-transform group-hover:scale-150 ${colors[color]}`}></div>
    </div>
  );
};

export default App;
