"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Topic = {
  id: number;
  title: string;
  position: number;
};

type Module = {
  id: number;
  title: string;
  position: number;
  topics: Topic[];
};

export default function CourseBuilderPage() {
  const params = useParams();
  const courseId = params.id;

  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openModule, setOpenModule] = useState<number | null>(null);

  const [addingModule, setAddingModule] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [creatingModule, setCreatingModule] = useState(false);

  const [editingModuleId, setEditingModuleId] =
    useState<number | null>(null);
  const [editingModuleTitle, setEditingModuleTitle] =
    useState("");
  const [savingModule, setSavingModule] = useState(false);

  const [deletingModuleId, setDeletingModuleId] =
    useState<number | null>(null);

  const [addingTopicModuleId, setAddingTopicModuleId] =
    useState<number | null>(null);
  const [topicTitle, setTopicTitle] = useState("");
  const [creatingTopic, setCreatingTopic] = useState(false);

  const [editingTopicId, setEditingTopicId] =
    useState<number | null>(null);
  const [editingTopicTitle, setEditingTopicTitle] =
    useState("");
  const [savingTopic, setSavingTopic] = useState(false);

  const [deletingTopicId, setDeletingTopicId] =
    useState<number | null>(null);

  // LOAD MODULES

  const loadModules = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `/api/teacher/courses/${courseId}/modules`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load modules"
        );
      }

      setModules(data.modules);

      if (
        data.modules.length > 0 &&
        openModule === null
      ) {
        setOpenModule(data.modules[0].id);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      loadModules();
    }
  }, [courseId]);

  // CREATE MODULE

  const addModule = async () => {
    if (!moduleTitle.trim()) return;

    setCreatingModule(true);
    setError("");

    try {
      const response = await fetch(
        `/api/teacher/courses/${courseId}/modules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: moduleTitle,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create module"
        );
      }

      const newModule: Module = {
        ...data.module,
        topics: [],
      };

      setModules((previous) => [
        ...previous,
        newModule,
      ]);

      setOpenModule(newModule.id);
      setModuleTitle("");
      setAddingModule(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setCreatingModule(false);
    }
  };

  // EDIT MODULE

  const saveModuleEdit = async (moduleId: number) => {
    if (!editingModuleTitle.trim()) return;

    setSavingModule(true);
    setError("");

    try {
      const response = await fetch(
        `/api/teacher/courses/${courseId}/modules/${moduleId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editingModuleTitle,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update module"
        );
      }

      setModules((previous) =>
        previous.map((module) =>
          module.id === moduleId
            ? {
              ...module,
              title: data.module.title,
            }
            : module
        )
      );

      setEditingModuleId(null);
      setEditingModuleTitle("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSavingModule(false);
    }
  };

  // DELETE MODULE

  const deleteModule = async (moduleId: number) => {
    const confirmed = window.confirm(
      "Delete this module and all its topics?"
    );

    if (!confirmed) return;

    setDeletingModuleId(moduleId);
    setError("");

    try {
      const response = await fetch(
        `/api/teacher/courses/${courseId}/modules/${moduleId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete module"
        );
      }

      setModules((previous) =>
        previous.filter(
          (module) => module.id !== moduleId
        )
      );

      if (openModule === moduleId) {
        setOpenModule(null);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setDeletingModuleId(null);
    }
  };

  // CREATE TOPIC

  const addTopic = async (moduleId: number) => {
    if (!topicTitle.trim()) return;

    setCreatingTopic(true);
    setError("");

    try {
      const response = await fetch(
        `/api/teacher/courses/${courseId}/modules/${moduleId}/topics`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: topicTitle,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create topic"
        );
      }

      setModules((previous) =>
        previous.map((module) =>
          module.id === moduleId
            ? {
              ...module,
              topics: [
                ...module.topics,
                data.topic,
              ],
            }
            : module
        )
      );

      setTopicTitle("");
      setAddingTopicModuleId(null);
      setOpenModule(moduleId);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setCreatingTopic(false);
    }
  };

  // EDIT TOPIC

  const saveTopicEdit = async (
    moduleId: number,
    topicId: number
  ) => {
    if (!editingTopicTitle.trim()) return;

    setSavingTopic(true);
    setError("");

    try {
      const response = await fetch(
        `/api/teacher/courses/${courseId}/modules/${moduleId}/topics/${topicId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: editingTopicTitle,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update topic"
        );
      }

      setModules((previous) =>
        previous.map((module) =>
          module.id === moduleId
            ? {
              ...module,
              topics: module.topics.map(
                (topic) =>
                  topic.id === topicId
                    ? {
                      ...topic,
                      title: data.topic.title,
                    }
                    : topic
              ),
            }
            : module
        )
      );

      setEditingTopicId(null);
      setEditingTopicTitle("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSavingTopic(false);
    }
  };

  // DELETE TOPIC

  const deleteTopic = async (
    moduleId: number,
    topicId: number
  ) => {
    const confirmed = window.confirm(
      "Delete this topic and all its content?"
    );

    if (!confirmed) return;

    setDeletingTopicId(topicId);
    setError("");

    try {
      const response = await fetch(
        `/api/teacher/courses/${courseId}/modules/${moduleId}/topics/${topicId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete topic"
        );
      }

      setModules((previous) =>
        previous.map((module) =>
          module.id === moduleId
            ? {
              ...module,
              topics: module.topics.filter(
                (topic) => topic.id !== topicId
              ),
            }
            : module
        )
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setDeletingTopicId(null);
    }
  };

  // PUBLISH COURSE

  const publishCourse = async () => {
    setError("");

    try {
      const response = await fetch(
        `/api/teacher/courses/${courseId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "PUBLISHED",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to publish course"
        );
      }

      alert("Course published successfully.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to publish course"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <main>
        <div className="p-8">

          <div className="mx-auto max-w-6xl">

            <div className="flex items-center justify-between">

              <div>
                <h1 className="text-2xl font-bold">
                  Course Builder
                </h1>

                <p className="mt-2 text-gray-600">
                  Build your course structure.
                </p>
              </div>

              <button
                type="button"
                onClick={publishCourse}
                className="rounded-md bg-black px-5 py-3 text-sm text-white"
              >
                Publish Course
              </button>

            </div>

            {error && (
              <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-8 rounded-lg border bg-white p-6">

              <div className="flex items-center justify-between">

                <h2 className="text-lg font-semibold">
                  Course Structure
                </h2>

                <button
                  type="button"
                  onClick={() => setAddingModule(true)}
                  className="rounded-md border px-4 py-2 text-sm"
                >
                  + Add Module
                </button>

              </div>

              {addingModule && (
                <div className="mt-6 rounded-md border p-5">

                  <input
                    type="text"
                    value={moduleTitle}
                    onChange={(e) =>
                      setModuleTitle(e.target.value)
                    }
                    placeholder="Enter module name"
                    className="w-full rounded-md border px-4 py-3 outline-none"
                  />

                  <div className="mt-3 flex gap-2">

                    <button
                      type="button"
                      onClick={addModule}
                      disabled={creatingModule}
                      className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
                    >
                      {creatingModule
                        ? "Creating..."
                        : "Create Module"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setAddingModule(false);
                        setModuleTitle("");
                      }}
                      className="rounded-md border px-4 py-2 text-sm"
                    >
                      Cancel
                    </button>

                  </div>

                </div>
              )}

              {loading ? (
                <div className="mt-6 py-8 text-center text-sm text-gray-500">
                  Loading course structure...
                </div>
              ) : (
                <div className="mt-6 space-y-4">

                  {modules.length === 0 ? (

                    <div className="rounded-md border border-dashed p-8 text-center">
                      <p className="text-sm text-gray-500">
                        No modules created yet.
                      </p>
                    </div>

                  ) : (

                    modules.map((module) => (

                      <div
                        key={module.id}
                        className="rounded-md border"
                      >

                        <div className="p-5">

                          {editingModuleId === module.id ? (

                            <div>

                              <input
                                type="text"
                                value={editingModuleTitle}
                                onChange={(e) =>
                                  setEditingModuleTitle(
                                    e.target.value
                                  )
                                }
                                className="w-full rounded-md border px-4 py-3"
                              />

                              <div className="mt-3 flex gap-2">

                                <button
                                  type="button"
                                  onClick={() =>
                                    saveModuleEdit(module.id)
                                  }
                                  disabled={savingModule}
                                  className="rounded-md bg-black px-4 py-2 text-sm text-white"
                                >
                                  {savingModule
                                    ? "Saving..."
                                    : "Save"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingModuleId(null);
                                    setEditingModuleTitle("");
                                  }}
                                  className="rounded-md border px-4 py-2 text-sm"
                                >
                                  Cancel
                                </button>

                              </div>

                            </div>

                          ) : (

                            <div className="flex items-center justify-between">

                              <button
                                type="button"
                                onClick={() =>
                                  setOpenModule(
                                    openModule === module.id
                                      ? null
                                      : module.id
                                  )
                                }
                                className="text-left"
                              >
                                <h3 className="font-semibold">
                                  {module.title}
                                </h3>

                                <p className="mt-1 text-sm text-gray-500">
                                  {module.topics.length} Topics
                                </p>
                              </button>

                              <div className="flex gap-2">

                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingModuleId(
                                      module.id
                                    );
                                    setEditingModuleTitle(
                                      module.title
                                    );
                                  }}
                                  className="rounded-md border px-3 py-2 text-sm"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteModule(module.id)
                                  }
                                  disabled={
                                    deletingModuleId ===
                                    module.id
                                  }
                                  className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
                                >
                                  {deletingModuleId ===
                                    module.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setAddingTopicModuleId(
                                      module.id
                                    );
                                    setOpenModule(module.id);
                                  }}
                                  className="rounded-md border px-4 py-2 text-sm"
                                >
                                  + Add Topic
                                </button>

                              </div>

                            </div>

                          )}

                        </div>

                        {openModule === module.id && (
                          <div className="border-t px-5 py-4">

                            {addingTopicModuleId ===
                              module.id && (
                                <div className="mb-4 rounded-md border p-4">

                                  <input
                                    type="text"
                                    value={topicTitle}
                                    onChange={(e) =>
                                      setTopicTitle(
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter topic title"
                                    className="w-full rounded-md border px-4 py-3"
                                  />

                                  <div className="mt-3 flex gap-2">

                                    <button
                                      type="button"
                                      onClick={() =>
                                        addTopic(module.id)
                                      }
                                      disabled={creatingTopic}
                                      className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
                                    >
                                      {creatingTopic
                                        ? "Creating..."
                                        : "Create Topic"}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setAddingTopicModuleId(
                                          null
                                        );
                                        setTopicTitle("");
                                      }}
                                      className="rounded-md border px-4 py-2 text-sm"
                                    >
                                      Cancel
                                    </button>

                                  </div>

                                </div>
                              )}

                            {module.topics.length === 0 ? (

                              <p className="text-sm text-gray-500">
                                No topics added yet.
                              </p>

                            ) : (

                              <div className="space-y-2">

                                {module.topics.map(
                                  (topic, index) => (

                                    <div
                                      key={topic.id}
                                      className="rounded-md border"
                                    >

                                      {editingTopicId ===
                                        topic.id ? (

                                        <div className="p-4">

                                          <input
                                            type="text"
                                            value={
                                              editingTopicTitle
                                            }
                                            onChange={(e) =>
                                              setEditingTopicTitle(
                                                e.target.value
                                              )
                                            }
                                            className="w-full rounded-md border px-4 py-3"
                                          />

                                          <div className="mt-3 flex gap-2">

                                            <button
                                              type="button"
                                              onClick={() =>
                                                saveTopicEdit(
                                                  module.id,
                                                  topic.id
                                                )
                                              }
                                              disabled={
                                                savingTopic
                                              }
                                              className="rounded-md bg-black px-4 py-2 text-sm text-white"
                                            >
                                              {savingTopic
                                                ? "Saving..."
                                                : "Save"}
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => {
                                                setEditingTopicId(
                                                  null
                                                );
                                                setEditingTopicTitle(
                                                  ""
                                                );
                                              }}
                                              className="rounded-md border px-4 py-2 text-sm"
                                            >
                                              Cancel
                                            </button>

                                          </div>

                                        </div>

                                      ) : (

                                        <div className="flex items-center justify-between px-4 py-3">

                                          <span className="text-sm">
                                            {index + 1}.{" "}
                                            {topic.title}
                                          </span>

                                          <div className="flex gap-2">

                                            <button
                                              type="button"
                                              onClick={() => {
                                                setEditingTopicId(
                                                  topic.id
                                                );
                                                setEditingTopicTitle(
                                                  topic.title
                                                );
                                              }}
                                              className="rounded-md border px-3 py-2 text-sm"
                                            >
                                              Edit
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() =>
                                                deleteTopic(
                                                  module.id,
                                                  topic.id
                                                )
                                              }
                                              disabled={
                                                deletingTopicId ===
                                                topic.id
                                              }
                                              className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
                                            >
                                              {deletingTopicId ===
                                                topic.id
                                                ? "Deleting..."
                                                : "Delete"}
                                            </button>

                                            <Link
                                              href={`/teacher/courses/${courseId}/builder/topic/${topic.id}?moduleId=${module.id}`}
                                              className="rounded-md border px-3 py-2 text-sm"
                                            >
                                              Open
                                            </Link>

                                          </div>

                                        </div>

                                      )}

                                    </div>

                                  )
                                )}

                              </div>

                            )}

                          </div>
                        )}

                      </div>

                    ))

                  )}

                </div>
              )}

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}