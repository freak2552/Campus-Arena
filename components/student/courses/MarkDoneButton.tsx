"use client";

import { useState } from "react";
import { Check } from "lucide-react";

type MarkDoneButtonProps = {
  courseId: number;
  topicId: number;
  completed: boolean;
  onChange: (completed: boolean) => void;
};

export default function MarkDoneButton({
  courseId,
  topicId,
  completed,
  onChange,
}: MarkDoneButtonProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/student/courses/${courseId}/topics/${topicId}/progress`,
        { method: completed ? "DELETE" : "POST" }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not save your progress.");
      }

      onChange(Boolean(data.completed));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={saving}
        title={completed ? "Click to undo" : undefined}
        className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
          completed
            ? "border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
            : "bg-emerald-600 text-white hover:bg-emerald-700"
        }`}
      >
        <Check size={16} strokeWidth={3} />
        {saving ? "Saving..." : completed ? "Completed" : "Mark as Done"}
      </button>

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
