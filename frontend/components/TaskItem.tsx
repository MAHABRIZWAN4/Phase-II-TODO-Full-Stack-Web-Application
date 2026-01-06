"use client";

import { useState } from "react";
import type { Task } from "@/lib/types";
import { deleteTask, updateTask } from "@/lib/api";
import TaskForm from "./TaskForm";
import DeleteConfirm from "./DeleteConfirm";

interface TaskItemProps {
  task: Task;
  onToggleComplete?: (taskId: number) => void;
  onTaskUpdated?: () => void;
}

export default function TaskItem({ task, onToggleComplete, onTaskUpdated }: TaskItemProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleEditSave = async (data: { title: string; description?: string }) => {
    try {
      await updateTask(task.id, data);
      setShowEditForm(false);
      onTaskUpdated?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTask(task.id);
      setShowDeleteConfirm(false);
      onTaskUpdated?.();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  return (
    <div
      className={`border rounded-lg p-4 transition-all ${
        task.completed
          ? "bg-gray-50 border-gray-200"
          : "bg-white border-gray-200 hover:border-blue-300"
      }`}
    >
      {showEditForm ? (
        <TaskForm
          mode="edit"
          taskId={task.id}
          initialData={{ title: task.title, description: task.description || undefined }}
          onSuccess={handleEditSave}
          onCancel={() => setShowEditForm(false)}
        />
      ) : (
        <>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3 flex-1">
              <button
                onClick={() => onToggleComplete?.(task.id)}
                className={`mt-1 flex-shrink-0 h-5 w-5 rounded border-2 transition-colors ${
                  task.completed
                    ? "bg-blue-600 border-blue-600"
                    : "bg-white border-gray-300 hover:border-blue-500"
                }`}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {task.completed && (
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <div className="flex-1 min-w-0">
                <h3
                  className={`text-lg font-medium ${
                    task.completed ? "text-gray-500 line-through" : "text-gray-900"
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p
                    className={`mt-1 text-sm ${
                        task.completed ? "text-gray-400" : "text-gray-600"
                      }`}
                  >
                    {task.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
            <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                task.completed
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {task.completed ? "Completed" : "Pending"}
            </span>
          </div>
        </>
      )}

      {showDeleteConfirm && (
        <DeleteConfirm
          taskTitle={task.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
