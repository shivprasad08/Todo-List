import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [tasks, setTasks] = useState([]);
  const [activeView, setActiveView] = useState("Calendar");
  const [showAddModal, setShowAddModal] = useState(false);
  const [calendarView, setCalendarView] = useState("Week"); // Week, Month
  const [currentDate, setCurrentDate] = useState(new Date());

  const views = ["Overview", "List", "Board", "Timeline", "Calendar", "Dashboard", "More..."];
  const colors = [
    "#EF4444",  // Vibrant Red
    "#F97316",  // Bright Orange
    "#F59E0B",  // Amber
    "#10B981",  // Emerald Green
    "#06B6D4",  // Cyan
    "#3B82F6",  // Bright Blue
    "#8B5CF6",  // Violet
    "#EC4899",  // Pink
    "#14B8A6",  // Teal
    "#F43F5E",  // Rose
  ];

  const handleAdd = () => {
    if (task.trim() !== "" && dueDate !== "") {
      const dateTimeString = dueTime ? `${dueDate}T${dueTime}` : `${dueDate}T09:00`;
      const newTask = {
        id: Date.now(),
        text: task,
        completed: false,
        addedAt: new Date(),
        dueDate: new Date(dateTimeString),
        color: colors[Math.floor(Math.random() * colors.length)],
      };

      setTasks((prev) => [...prev, newTask].sort((a, b) => a.dueDate - b.dueDate));
      setTask("");
      setDueDate("");
      setDueTime("");
      setShowAddModal(false);
    }
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleToggle = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleClear = () => {
    setTasks([]);
  };

  const getWeekDates = (baseDate = currentDate) => {
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - baseDate.getDay() + 1);
    
    const dates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getMonthDates = (baseDate = currentDate) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get starting day of week (0 = Sunday)
    const startingDayOfWeek = firstDay.getDay();
    
    const dates = [];
    
    // Add previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      dates.push(new Date(year, month - 1, prevMonthLastDay - i));
    }
    
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(year, month, i));
    }
    
    // Add next month's days to fill the grid
    const remainingDays = 42 - dates.length; // 6 rows * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      dates.push(new Date(year, month + 1, i));
    }
    
    return dates;
  };

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
  };

  const getWeekDaysForView = (baseDate = currentDate) => {
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - baseDate.getDay()); // Start on Sunday
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getTasksForDateTime = (date, hour) => {
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString() && 
             taskDate.getHours() === hour;
    });
  };

  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

  const goToPrevPeriod = () => {
    setCurrentDate(prev => {
      const nextDate = new Date(prev);
      if (calendarView === "Month") {
        nextDate.setMonth(nextDate.getMonth() - 1);
      } else {
        nextDate.setDate(nextDate.getDate() - 7);
      }
      return nextDate;
    });
  };

  const goToNextPeriod = () => {
    setCurrentDate(prev => {
      const nextDate = new Date(prev);
      if (calendarView === "Month") {
        nextDate.setMonth(nextDate.getMonth() + 1);
      } else {
        nextDate.setDate(nextDate.getDate() + 7);
      }
      return nextDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const weekDates = getWeekDates();
  const dateRangeStart = weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const dateRangeEnd = weekDates[4].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  const monthDates = getMonthDates();
  const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const weekViewDates = getWeekDaysForView();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b-2 border-gray-100 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500">
          <div className="flex gap-6">
            {views.map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`pb-3 px-3 text-sm font-semibold transition-all relative ${
                  activeView === view
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {view}
                {activeView === view && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-white text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <span className="text-xl">+</span>
            Add Task
          </button>
        </div>

        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center gap-4">
            <span className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-md">TODAY</span>
            <span className="text-base text-gray-700 font-semibold">{currentMonth}</span>
          </div>
          <div className="flex items-center gap-5">
            {activeView === "Calendar" && (
              <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1">
                        {["Week", "Month"].map((view) => (
                  <button
                    key={view}
                    onClick={() => setCalendarView(view)}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                      calendarView === view
                        ? "bg-gray-800 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={goToToday}
              className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-semibold hover:bg-indigo-50 px-4 py-2 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* OVERVIEW VIEW */}
          {activeView === "Overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">{tasks.length}</div>
                  <div className="text-sm text-blue-600 mt-2">Total Tasks</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{tasks.filter(t => t.completed).length}</div>
                  <div className="text-sm text-green-600 mt-2">Completed</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600">{tasks.filter(t => !t.completed).length}</div>
                  <div className="text-sm text-orange-600 mt-2">In Progress</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
                  </div>
                  <div className="text-sm text-purple-600 mt-2">Completion Rate</div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Tasks</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {tasks.slice(-5).reverse().map(t => (
                    <div key={t.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex-1">
                        <p className={t.completed ? 'line-through text-gray-400' : 'text-gray-800'}>{t.text}</p>
                        <p className="text-xs text-gray-500">{new Date(t.dueDate).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${t.completed ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {t.completed ? 'Done' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LIST VIEW */}
          {activeView === "List" && (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {tasks.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No tasks yet. Click "Add Task" to create one.</p>
              ) : (
                <AnimatePresence>
                  {tasks.map((t, i) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                      onClick={() => handleToggle(t.id)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={() => handleToggle(t.id)}
                          className="w-5 h-5 text-indigo-600 rounded cursor-pointer"
                        />
                        <div className="flex-1">
                          <p className={`font-medium ${t.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {i + 1}. {t.text}
                          </p>
                          <p className="text-xs text-gray-500">{new Date(t.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(t.id);
                        }}
                        className="text-gray-400 hover:text-red-600 transition"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          )}

          {/* BOARD VIEW (Kanban) */}
          {activeView === "Board" && (
            <div className="grid grid-cols-3 gap-4">
              {["Not Started", "In Progress", "Completed"].map((status) => {
                const statusTasks = status === "Completed" 
                  ? tasks.filter(t => t.completed)
                  : status === "In Progress"
                  ? tasks.filter(t => !t.completed && t.dueDate < new Date())
                  : tasks.filter(t => !t.completed && t.dueDate >= new Date());
                
                return (
                  <div key={status} className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-4">{status}</h3>
                    <div className="space-y-3 min-h-[400px]">
                      <AnimatePresence>
                        {statusTasks.map(t => (
                          <motion.div
                            key={t.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                            style={{ backgroundColor: t.color }}
                            onClick={() => handleToggle(t.id)}
                          >
                            <p className="font-medium text-gray-800 mb-2">{t.text}</p>
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>{new Date(t.dueDate).toLocaleDateString()}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(t.id);
                                }}
                                className="hover:text-red-600"
                              >
                                ✕
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TIMELINE VIEW */}
          {activeView === "Timeline" && (
            <div className="space-y-0">
              {tasks.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No tasks yet. Click "Add Task" to create one.</p>
              ) : (
                <div className="relative pl-8">
                  {[...tasks].sort((a, b) => a.dueDate - b.dueDate).map((t, i) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="relative mb-6 pb-6 border-l-2 border-indigo-300 pl-6"
                    >
                      <div className="absolute -left-3.5 top-2 w-5 h-5 bg-indigo-600 rounded-full border-4 border-white"></div>
                      <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => handleToggle(t.id)}>
                        <div className="flex justify-between items-start mb-2">
                          <p className={`font-semibold ${t.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                            {t.text}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(t.id);
                            }}
                            className="text-gray-400 hover:text-red-600"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-sm text-indigo-600 font-medium">{new Date(t.dueDate).toLocaleDateString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CALENDAR VIEW */}
          {activeView === "Calendar" && (
            <div className="bg-gradient-to-br from-blue-50/30 to-purple-50/30">
              {/* Week View */}
              {calendarView === "Week" && (
                <div>
                  {/* Week Header */}
                  <div className="flex items-center justify-between mb-6 px-2">
                    <div className="flex items-center gap-5">
                      <button onClick={goToPrevPeriod} className="text-indigo-600 hover:text-indigo-700 font-bold text-2xl hover:bg-indigo-100 w-10 h-10 rounded-full transition flex items-center justify-center">←</button>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent min-w-64">
                        {weekViewDates[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h2>
                      <button onClick={goToNextPeriod} className="text-indigo-600 hover:text-indigo-700 font-bold text-2xl hover:bg-indigo-100 w-10 h-10 rounded-full transition flex items-center justify-center">→</button>
                    </div>
                    <div className="text-sm text-gray-600 font-semibold">
                      <span className="text-indigo-600">{tasks.length} events</span>
                    </div>
                  </div>

                  {/* Week Grid */}
                  <div className="overflow-x-auto">
                    <div className="inline-grid grid-cols-8 gap-0 border border-gray-200 rounded-lg overflow-hidden bg-white min-w-full">
                    {/* Time Column */}
                    <div className="border-r border-gray-200 bg-gray-50 w-24">
                      <div className="h-16 border-b border-gray-200 flex items-center justify-center text-xs font-semibold text-gray-500">
                        UTC +1
                      </div>
                      {timeSlots.map((hour) => (
                        <div key={hour} className="h-24 border-b border-gray-200 flex items-start justify-center pt-2">
                          <span className="text-xs font-medium text-gray-600">
                            {hour.toString().padStart(2, '0')} {hour < 12 ? 'AM' : 'PM'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Day Columns */}
                    {weekViewDates.map((date, idx) => {
                      const isTodayDate = isToday(date);
                      return (
                        <div key={idx} className="border-r border-gray-200 last:border-r-0 min-w-[180px]">
                          {/* Day Header */}
                          <div className={`h-16 border-b border-gray-200 flex flex-col items-center justify-center ${
                            isTodayDate ? 'bg-blue-50' : 'bg-gray-50'
                          }`}>
                            <div className="text-xs font-semibold text-gray-500">
                              {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className={`text-2xl font-bold mt-1 ${
                              isTodayDate ? 'text-blue-600' : 'text-gray-700'
                            }`}>
                              {date.getDate()}
                            </div>
                          </div>

                          {/* Time Slots */}
                          {timeSlots.map((hour) => {
                            const slotTasks = getTasksForDateTime(date, hour);
                            return (
                              <div key={hour} className="h-24 border-b border-gray-200 p-1 relative hover:bg-blue-50/30 transition">
                                {slotTasks.map((t) => (
                                  <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-1 p-2 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all text-xs"
                                    style={{ backgroundColor: t.color }}
                                    onClick={() => handleToggle(t.id)}
                                  >
                                    <div className="font-bold text-white truncate">{t.text}</div>
                                    <div className="text-white/80 flex items-center gap-1 mt-1">
                                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                      </svg>
                                      <span>{hour.toString().padStart(2, '0')} {hour < 12 ? 'AM' : 'PM'} - {(hour + 1).toString().padStart(2, '0')} {hour + 1 < 12 ? 'AM' : 'PM'}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mt-2">
                                      <div className="flex -space-x-1">
                                        <span className="w-5 h-5 rounded-full bg-white/40 flex items-center justify-center text-xs">👤</span>
                                      </div>
                                      <span className="text-white/90 text-xs">+2 Other</span>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                  </div>
                </div>
              )}


              {/* Month View */}
              {calendarView === "Month" && (
                <div>
              {/* Month Header */}
              <div className="flex items-center justify-between mb-8 px-2">
                <div className="flex items-center gap-5">
                  <button onClick={goToPrevPeriod} className="text-indigo-600 hover:text-indigo-700 font-bold text-2xl hover:bg-indigo-100 w-10 h-10 rounded-full transition flex items-center justify-center">←</button>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent min-w-64">{currentMonth}</h2>
                  <button onClick={goToNextPeriod} className="text-indigo-600 hover:text-indigo-700 font-bold text-2xl hover:bg-indigo-100 w-10 h-10 rounded-full transition flex items-center justify-center">→</button>
                </div>
                <button className="text-sm text-indigo-600 hover:text-indigo-700 font-bold bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-lg transition">
                  Show weekends
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-4 mb-6">
                {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
                  <div key={day} className="text-center">
                    <div className="text-sm font-extrabold text-gray-600 bg-gray-100 py-2 rounded-lg">{day}</div>
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-4">
                {monthDates.map((date, idx) => {
                  const dayTasks = getTasksForDate(date);
                  const isTodayDate = isToday(date);
                  const isCurrentMonthDate = isCurrentMonth(date);

                  return (
                    <div
                      key={idx}
                      className={`min-h-[220px] rounded-2xl p-4 transition-all hover:shadow-xl ${
                        isTodayDate
                          ? "border-4 border-blue-500 bg-blue-50 shadow-2xl"
                          : isCurrentMonthDate
                          ? "border-2 border-gray-200 bg-white shadow-lg hover:border-indigo-300"
                          : "border-2 border-gray-100 bg-gray-50/50 shadow-sm"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-2xl font-bold ${
                          isTodayDate 
                            ? "text-blue-600" 
                            : isCurrentMonthDate 
                            ? "text-gray-800" 
                            : "text-gray-300"
                        }`}>
                          {date.getDate()}
                        </span>
                        {isTodayDate && (
                          <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-black rounded-full shadow-lg">
                            TODAY
                          </span>
                        )}
                      </div>
                      <div className="space-y-2.5 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
                        <AnimatePresence>
                          {dayTasks.map((t) => (
                            <motion.div
                              key={t.id}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              whileHover={{ scale: 1.03 }}
                              className="p-3.5 rounded-xl shadow-lg cursor-pointer hover:shadow-2xl transition-all group relative overflow-hidden"
                              style={{ 
                                backgroundColor: t.color,
                              }}
                              onClick={() => handleToggle(t.id)}
                              title={t.text}
                            >
                              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <div className="flex items-start gap-2.5 relative z-10">
                                <span className="text-xl flex-shrink-0 filter drop-shadow-md">👤</span>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-bold text-white leading-tight drop-shadow-md ${t.completed ? 'line-through opacity-70' : ''}`}>
                                    {t.text}
                                  </p>
                                  <p className="text-xs text-white/90 mt-1.5 font-medium">Module 2 goes live</p>
                                </div>
                              </div>
                              {t.completed && (
                                <div className="absolute top-2 right-2 bg-green-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                                  ✓
                                </div>
                              )}
                            </motion.div>
                          ))}
                          {dayTasks.length > 0 && (
                            <div className="text-xs text-gray-500 px-2 pt-2 font-bold flex items-center gap-1">
                              <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                              {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'}
                            </div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  );
                })}
              </div>
                </div>
              )}
            </div>
          )}

          {/* DASHBOARD VIEW */}
          {activeView === "Dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Tasks by Status</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Completed</span>
                        <span className="text-sm font-semibold text-green-600">{tasks.filter(t => t.completed).length}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{width: tasks.length > 0 ? `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` : '0%'}}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Pending</span>
                        <span className="text-sm font-semibold text-orange-600">{tasks.filter(t => !t.completed).length}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full" 
                          style={{width: tasks.length > 0 ? `${(tasks.filter(t => !t.completed).length / tasks.length) * 100}%` : '0%'}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Tasks</span>
                      <span className="font-semibold text-gray-800">{tasks.length}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-3">
                      <span className="text-gray-600">Upcoming Tasks</span>
                      <span className="font-semibold text-gray-800">{tasks.filter(t => !t.completed && t.dueDate > new Date()).length}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-3">
                      <span className="text-gray-600">Overdue Tasks</span>
                      <span className="font-semibold text-red-600">{tasks.filter(t => !t.completed && t.dueDate < new Date()).length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tasks.length > 0 && (
            <button
              onClick={handleClear}
              className="mt-6 text-sm text-red-600 hover:underline"
            >
              Clear All Tasks
            </button>
          )}

          {tasks.length === 0 && activeView !== "List" && activeView !== "Timeline" && (
            <p className="text-center text-gray-400 mt-8">No tasks scheduled. Click "Add Task" to get started.</p>
          )}
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-gray-500 pb-6">
        <div>Crafted for your productivity — Week and Month views stay in sync.</div>
        <div className="mt-1">© {new Date().getFullYear()} Shivprasad. All rights reserved.</div>
      </footer>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Task</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Description</label>
                <input
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Enter task description..."
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time (Optional)</label>
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="09:00"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAdd}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  Add Task
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default App;
