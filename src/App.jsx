import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [task, setTask] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleAdd = () => {
    if (task.trim() !== "" && dueTime !== "") {
      const [hours, minutes] = dueTime.split(":").map(Number);
      const due = new Date();
      due.setHours(hours);
      due.setMinutes(minutes);
      due.setSeconds(0);

      const newTask = {
        id: Date.now(),
        text: task,
        completed: false,
        addedAt: new Date(),
        dueTime: due,
      };

      setTasks((prev) =>
        [...prev, newTask].sort((a, b) => a.dueTime - b.dueTime)
      );
      setTask("");
      setDueTime("");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 to-indigo-300 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-violet-700 flex items-center gap-2">
            ✨ To-Do List
          </h1>
          <span className="text-sm text-gray-500">
            Total Tasks: {tasks.length}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task..."
            className="flex-grow p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <input
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
            className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 w-full sm:w-auto"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition"
          >
            Add
          </button>
        </div>

        {tasks.length > 0 && (
          <button
            onClick={handleClear}
            className="mb-4 text-sm text-red-600 hover:underline"
          >
            Clear All
          </button>
        )}

        <ul className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          <AnimatePresence>
            {tasks.map((t, i) => (
              <motion.li
                key={t.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
                className="flex justify-between items-start bg-gray-100 px-4 py-3 rounded-xl shadow"
              >
                <div className="flex gap-3 items-start">
                  <span className="text-gray-500 font-bold">{i + 1}.</span>
                  <div>
                    <p
                      className={`${
                        t.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {t.text}
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      <div>🕒 Due at: {t.dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      <div>📅 Added at: {t.addedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggle(t.id)}
                    className={`text-sm px-3 py-1 rounded-full ${
                      t.completed
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    } hover:opacity-80`}
                  >
                    {t.completed ? "Done" : "Mark"}
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    ✕
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {tasks.length === 0 && (
          <p className="text-center text-gray-500 mt-8">No tasks added yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
