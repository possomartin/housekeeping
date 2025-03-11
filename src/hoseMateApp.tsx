import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  CheckCircle2,
  Home,
  MessageSquare,
  Plus,
  Trash2,
  Users,
} from "lucide-react";

const HousemateApp = () => {
  // State management
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Clean kitchen",
      assignee: "Alex",
      dueDate: "2025-02-15",
      completed: false,
    },
    {
      id: 2,
      title: "Take out trash",
      assignee: "Sam",
      dueDate: "2025-02-13",
      completed: true,
    },
    {
      id: 3,
      title: "Vacuum living room",
      assignee: "Jordan",
      dueDate: "2025-02-14",
      completed: false,
    },
  ]);

  const [messages, setMessages] = useState([
    {
      id: 1,
      author: "Alex",
      content: "Ill be having friends over this weekend",
      timestamp: "2025-02-12 10:00",
    },
    {
      id: 2,
      author: "Sam",
      content: "No problem! Ill make sure the living room is clean",
      timestamp: "2025-02-12 10:05",
    },
  ]);

  const [newTask, setNewTask] = useState({
    title: "",
    assignee: "",
    dueDate: "",
  });
  const [newMessage, setNewMessage] = useState("");

  // Task handlers
  const addTask = () => {
    if (newTask.title && newTask.assignee && newTask.dueDate) {
      setTasks([
        ...tasks,
        {
          id: tasks.length + 1,
          ...newTask,
          completed: false,
        },
      ]);
      setNewTask({ title: "", assignee: "", dueDate: "" });
    }
  };

  const toggleTask = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Message handlers
  const addMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          author: "You",
          content: newMessage,
          timestamp: new Date().toLocaleString(),
        },
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-6 w-6" />
            Housemate Hub
          </CardTitle>
          <CardDescription>
            Keep your shared space organized and peaceful
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Chores & Tasks
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            House Chat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>House Tasks</CardTitle>
              <CardDescription>
                Manage and track household chores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new task form */}
              <div className="flex gap-2">
                <Input
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
                <Input
                  placeholder="Assignee"
                  value={newTask.assignee}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignee: e.target.value })
                  }
                />
                <Input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                />
                <Button onClick={addTask}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Task list */}
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-2 bg-secondary rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleTask(task.id)}
                      >
                        <CheckCircle2
                          className={`h-4 w-4 ${
                            task.completed ? "text-green-500" : "text-gray-400"
                          }`}
                        />
                      </Button>
                      <span
                        className={
                          task.completed ? "line-through text-gray-500" : ""
                        }
                      >
                        {task.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {task.assignee}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {task.dueDate}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>House Chat</CardTitle>
              <CardDescription>
                Communicate with your housemates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Messages list */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div key={message.id} className="p-2 bg-secondary rounded-lg">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span className="font-medium">{message.author}</span>
                      <span>{message.timestamp}</span>
                    </div>
                    <p className="mt-1">{message.content}</p>
                  </div>
                ))}
              </div>

              {/* New message input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addMessage()}
                />
                <Button onClick={addMessage}>Send</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HousemateApp;
