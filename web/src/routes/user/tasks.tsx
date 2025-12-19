import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Badge } from "@shared/components/ui/badge"
import { CheckCircle2, Circle, Clock, Plus, Tag, Trash2 } from 'lucide-react'
import { Button } from "@shared/components/ui/button"
import { Card, CardContent } from "@shared/components/ui/card"
import { toast } from "sonner"

export const Route = createFileRoute('/user/tasks')({
  component: TasksPage,
})

interface Task {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in-progress' | 'completed'
  dueDate: string
  category: string
}

function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    fetch('/data/tasks.json')
      .then(res => res.json())
      .then(data => setTasks(data))
  }, [])

  const toggleStatus = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'completed' ? 'todo' : 'completed'
        if (nextStatus === 'completed') {
          toast.success("Task Synchronized", { description: `"${t.title}" marked as complete.` })
        }
        return { ...t, status: nextStatus }
      }
      return t
    }))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
    toast.info("Task Removed", { description: "Item purged from session catalog." })
  }

  const priorityColors = {
    low: 'text-slate-500 border-slate-500/20 bg-slate-500/10',
    medium: 'text-sky-500 border-sky-500/20 bg-sky-500/10',
    high: 'text-primary border-primary/20 bg-primary/10',
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 glass shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
            Mission <span className="text-primary">Control</span>
          </h1>
          <p className="text-slate-500 mt-2 font-bold uppercase italic text-xs tracking-[0.2em]">Manage your operational targets and deliverables</p>
        </div>
        <Button className="relative z-10 h-12 px-8 accent-gradient border-0 rounded-xl font-black uppercase italic shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-[10px] tracking-widest">
          <Plus className="w-4 h-4 mr-2" />
          Initialize Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task.id} className={`glass border-white/10 rounded-[2rem] overflow-hidden group transition-all duration-300 ${task.status === 'completed' ? 'opacity-60 grayscale-[0.5]' : 'hover:border-primary/40'}`}>
            <CardContent className="p-8 space-y-6">
              <div className="flex items-start justify-between">
                <button
                  onClick={() => toggleStatus(task.id)}
                  className="shrink-0 transition-transform active:scale-90"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                  ) : (
                    <Circle className="text-slate-600 w-6 h-6 hover:text-primary transition-colors" />
                  )}
                </button>
                <div className="flex gap-2">
                  <Badge variant="outline" className={`font-black uppercase italic text-[9px] tracking-tighter px-2 ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </Badge>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-slate-600 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div>
                <h4 className={`text-lg font-black uppercase italic tracking-tighter leading-tight ${task.status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>
                  {task.title}
                </h4>
                <div className="flex items-center gap-4 mt-4 text-[10px] font-bold uppercase italic tracking-widest text-slate-500">
                  <span className="flex items-center gap-1.5"><Tag size={12} className="text-primary" /> {task.category}</span>
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {task.dueDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
