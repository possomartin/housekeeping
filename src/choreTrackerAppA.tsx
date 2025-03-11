import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
// Add these imports to the top of your file
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PencilIcon } from "@heroicons/react/24/outline";

import {
  CalendarIcon,
  CheckCircle,
  Circle,
  PlusCircle,
  Trash2,
} from "lucide-react";

// Types
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date | null;
  assignee: string;
  completed: boolean;
}

interface User {
  id: string;
  name: string;
}

// Dummy data for users
const users: User[] = [
  { id: "user1", name: "Alice" },
  { id: "user2", name: "Bob" },
  { id: "user3", name: "Charlie" },
];

const ChoreTrackerApp = () => {
  // State for tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const savedTasks = localStorage.getItem("choreTasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    }
    return [];
  });

  // State for managing dialogs
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState(false);
  const [openEditTaskDialog, setOpenEditTaskDialog] = useState(false);
  const [openViewTaskDialog, setOpenViewTaskDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Form state for adding/editing tasks
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDueDate, setFormDueDate] = useState<Date | null>(null);
  const [formAssignee, setFormAssignee] = useState("");

  // Save tasks to local storage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("choreTasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Handlers for adding, editing, and deleting tasks
  const handleAddTask = () => {
    if (!formTitle.trim() || !formAssignee) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: formTitle,
      description: formDescription,
      dueDate: formDueDate,
      assignee: formAssignee,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setOpenAddTaskDialog(false);
    resetForm();
  };

  const handleEditTask = () => {
    if (!formTitle.trim() || !formAssignee || !selectedTask) return;

    const updatedTasks = tasks.map((task) =>
      task.id === selectedTask.id
        ? {
            ...task,
            title: formTitle,
            description: formDescription,
            dueDate: formDueDate,
            assignee: formAssignee,
          }
        : task
    );

    setTasks(updatedTasks);
    setOpenEditTaskDialog(false);
    resetForm();
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
      setOpenViewTaskDialog(false);
    }
  };

  const handleCompleteTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Helper function to reset form state
  const resetForm = () => {
    setFormTitle("");
    setFormDescription("");
    setFormDueDate(null);
    setFormAssignee("");
  };

  // Handlers for dialogs
  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setOpenViewTaskDialog(true);
  };

  const openEditTask = (task: Task) => {
    setSelectedTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormDueDate(task.dueDate);
    setFormAssignee(task.assignee);
    setOpenEditTaskDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Chore Tracker
        </h1>

        {/* Task List */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Tasks
          </h2>
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400">
                No tasks yet. Add some tasks to get started!
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    task.completed
                      ? "bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                    "shadow-md flex items-center justify-between"
                  )}
                >
                  <div
                    className="flex items-center gap-4 cursor-pointer"
                    onClick={() => openTaskDetails(task)}
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => handleCompleteTask(task.id)}
                      className={cn(
                        task.completed
                          ? "bg-green-500 dark:bg-green-700"
                          : "bg-gray-100 dark:bg-gray-700",
                        "border-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "font-medium",
                          task.completed
                            ? "line-through text-gray-500 dark:text-gray-400"
                            : "text-gray-800 dark:text-gray-200"
                        )}
                      >
                        {task.title}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {task.assignee}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditTask(task)}
                    >
                      <PencilIcon
                        className="h-4 w-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2
                        className="h-4 w-4 text-red-500"
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Task Button */}
        <Button
          onClick={() => setOpenAddTaskDialog(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>

        {/* Add Task Dialog */}
        <Dialog open={openAddTaskDialog} onOpenChange={setOpenAddTaskDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
              <DialogDescription>
                Create a new task for your housemates.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dueDate" className="text-right">
                  Due Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formDueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formDueDate ? (
                          format(formDueDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formDueDate}
                        onSelect={setFormDueDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="assignee" className="text-right">
                  Assignee
                </Label>
                <Select value={formAssignee} onValueChange={setFormAssignee}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a housemate" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.name}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleAddTask}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Task Dialog */}
        <Dialog open={openEditTaskDialog} onOpenChange={setOpenEditTaskDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
              <DialogDescription>
                Modify the details of the selected task.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-title"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-dueDate" className="text-right">
                  Due Date
                </Label>
                <div className="col-span-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formDueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formDueDate ? (
                          format(formDueDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formDueDate}
                        onSelect={setFormDueDate}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-assignee" className="text-right">
                  Assignee
                </Label>
                <Select value={formAssignee} onValueChange={setFormAssignee}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a housemate" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.name}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleEditTask}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Task Dialog */}
        <Dialog open={openViewTaskDialog} onOpenChange={setOpenViewTaskDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedTask?.title}</DialogTitle>
              <DialogDescription>{selectedTask?.description}</DialogDescription>
              <div className="mt-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Due Date:
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  {selectedTask?.dueDate
                    ? format(selectedTask.dueDate, "PPP")
                    : "No due date"}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Assigned to:
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                  {selectedTask?.assignee}
                </span>
              </div>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                onClick={() => selectedTask && openEditTask(selectedTask)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Edit Task
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ChoreTrackerApp;
