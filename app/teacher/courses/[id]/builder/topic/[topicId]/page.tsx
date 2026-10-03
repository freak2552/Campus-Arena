"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type ContentBlock = {
  id: number;
  type: string;
  position: number;
  content: string | null;
  url: string | null;
  cloudinaryPublicId: string | null;
  cloudinaryResourceType: string | null;
};

type Topic = {
  id: number;
  title: string;
  position: number;
  contentBlocks: ContentBlock[];
};

type QuestionOption = {
  id: number;
  text: string;
  isCorrect: boolean;
  position: number;
};

type Question = {
  id: number;
  question: string;
  explanation: string | null;
  position: number;
  options: QuestionOption[];
};

type KnowledgeCheck = {
  id: number;
  questions: Question[];
};

const contentTypes = [
  { value: "TEXT", label: "Text" },
  { value: "VIDEO", label: "Video" },
  { value: "YOUTUBE", label: "YouTube Video" },
  { value: "PDF", label: "PDF" },
  { value: "ARTICLE", label: "Article" },
  { value: "IMAGE", label: "Image" },
  { value: "FUN_FACT", label: "Fun Fact" },
  { value: "GOOD_TO_KNOW", label: "Good to Know" },
  { value: "COMMON_MISTAKE", label: "Common Mistake" },
];

export default function TopicBuilderPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const moduleId = searchParams.get("moduleId");

  const courseId = params.id;
  const topicId = params.topicId;

  const [topic, setTopic] = useState<Topic | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------
  // CREATE CONTENT
  // --------------------------------

  const [selectedType, setSelectedType] =
    useState("TEXT");

  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");

  const [
    cloudinaryPublicId,
    setCloudinaryPublicId,
  ] = useState<string | null>(null);

  const [
    cloudinaryResourceType,
    setCloudinaryResourceType,
  ] = useState<string | null>(null);

  const [uploadingFile, setUploadingFile] =
    useState(false);

  const [creating, setCreating] =
    useState(false);

  // --------------------------------
  // EDIT CONTENT
  // --------------------------------

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editType, setEditType] =
    useState("TEXT");

  const [editContent, setEditContent] =
    useState("");

  const [editUrl, setEditUrl] =
    useState("");

  const [savingEdit, setSavingEdit] =
    useState(false);

  // --------------------------------
  // DELETE
  // --------------------------------

  const [deletingId, setDeletingId] =
    useState<number | null>(null);

  // --------------------------------
  // KNOWLEDGE CHECK
  // --------------------------------

  const [knowledgeCheck, setKnowledgeCheck] =
    useState<KnowledgeCheck | null>(null);

  const [questionText, setQuestionText] =
    useState("");

  const [questionExplanation, setQuestionExplanation] =
    useState("");

  const [options, setOptions] = useState([
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  const [creatingQuestion, setCreatingQuestion] =
    useState(false);

  // --------------------------------
  // LOAD TOPIC
  // --------------------------------

  const loadTopic = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/teacher/courses/${courseId}/modules/${moduleId}/topics/${topicId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load topic"
        );
      }

      setTopic(data.topic);
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

  const loadKnowledgeCheck = async () => {
    try {
      const response = await fetch(
        `/api/teacher/courses/${courseId}/modules/${moduleId}/topics/${topicId}/knowledge-check`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to load knowledge check"
        );
      }

      setKnowledgeCheck(data.knowledgeCheck);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (courseId && topicId && moduleId) {
      loadTopic();
      loadKnowledgeCheck();
    }
  }, [courseId, topicId, moduleId]);

  // --------------------------------
  // UPLOAD FILE TO CLOUDINARY
  // --------------------------------

  const uploadFile = async (file: File) => {
    setUploadingFile(true);
    setError("");

    try {
      /*
       * Ask our backend for a signed upload.
       */
      const prepareResponse = await fetch(
        "/api/teacher/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: selectedType,
          }),
        }
      );

      const prepareData =
        await prepareResponse.json();

      if (!prepareResponse.ok) {
        throw new Error(
          prepareData.message ||
          "Failed to prepare upload"
        );
      }

      const upload =
        prepareData.upload;

      /*
       * Basic file-size validation on frontend.
       *
       * Backend configuration remains the
       * authoritative validation.
       */
      if (
        upload.maxSize &&
        file.size > upload.maxSize
      ) {
        throw new Error(
          `File is too large. Maximum allowed size is ${upload.maxSizeMB} MB.`
        );
      }

      /*
       * Check file extension.
       */
      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase();

      if (
        extension &&
        Array.isArray(upload.allowedFormats) &&
        !upload.allowedFormats.includes(
          extension
        )
      ) {
        throw new Error(
          `Invalid file format. Allowed formats: ${upload.allowedFormats.join(
            ", "
          )}`
        );
      }

      /*
       * Upload DIRECTLY to Cloudinary.
       *
       * The actual file does not go through
       * our Next.js server.
       */
      const cloudinaryForm =
        new FormData();

      cloudinaryForm.append(
        "file",
        file
      );

      cloudinaryForm.append(
        "api_key",
        upload.apiKey
      );

      cloudinaryForm.append(
        "timestamp",
        String(upload.timestamp)
      );

      cloudinaryForm.append(
        "signature",
        upload.signature
      );

      cloudinaryForm.append(
        "folder",
        upload.folder
      );

      cloudinaryForm.append(
        "public_id",
        upload.publicId
      );

      const cloudinaryResponse =
        await fetch(
          upload.uploadUrl,
          {
            method: "POST",
            body: cloudinaryForm,
          }
        );

      const cloudinaryData =
        await cloudinaryResponse.json();

      if (!cloudinaryResponse.ok) {
        throw new Error(
          cloudinaryData.error?.message ||
          "Cloudinary upload failed"
        );
      }

      /*
       * Save Cloudinary information locally.
       */
      setUrl(
        cloudinaryData.secure_url
      );

      setCloudinaryPublicId(
        cloudinaryData.public_id ||
        upload.publicId
      );

      setCloudinaryResourceType(
        cloudinaryData.resource_type ||
        upload.resourceType
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "File upload failed"
      );
    } finally {
      setUploadingFile(false);
    }
  };

  // --------------------------------
  // CREATE CONTENT BLOCK
  // --------------------------------

  const createContentBlock =
    async () => {
      if (
        selectedType === "YOUTUBE" &&
        !url.trim()
      ) {
        setError("Please enter a YouTube URL.");
        return;
      }

      if (
        selectedType !== "VIDEO" &&
        selectedType !== "IMAGE" &&
        selectedType !== "PDF" &&
        !content.trim() &&
        !url.trim()
      ) {
        return;
      }

      /*
       * File content must finish uploading
       * before creating the database record.
       */
      if (uploadingFile) {
        setError(
          "Please wait for the file upload to finish."
        );
        return;
      }

      setCreating(true);
      setError("");

      try {
        const response = await fetch(
          `/api/teacher/courses/${courseId}/modules/${moduleId}/topics/${topicId}/content`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              type: selectedType,

              content:
                content || null,

              url:
                url || null,

              cloudinaryPublicId,

              cloudinaryResourceType,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to create content"
          );
        }

        setTopic((previous) =>
          previous
            ? {
              ...previous,
              contentBlocks: [
                ...previous.contentBlocks,
                data.block,
              ],
            }
            : previous
        );
      
        setContent("");
        setUrl("");

        setCloudinaryPublicId(
          null
        );

        setCloudinaryResourceType(
          null
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setCreating(false);
      }
    };

  // --------------------------------
  // CREATE QUESTION
  // --------------------------------

  const createQuestion =
    async () => {
      if (!questionText.trim()) {
        alert("Enter a question");
        return;
      }

      const validOptions =
        options.filter(
          (option) =>
            option.text.trim()
        );

      if (validOptions.length < 2) {
        alert("Add at least 2 options");
        return;
      }

      const correctOptions =
        validOptions.filter(
          (option) =>
            option.isCorrect
        );

      if (correctOptions.length !== 1) {
        alert(
          "Select exactly one correct answer"
        );
        return;
      }

      setCreatingQuestion(true);

      try {
        const response = await fetch(
          `/api/teacher/courses/${courseId}/modules/${moduleId}/topics/${topicId}/knowledge-check/questions`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              question: questionText,
              explanation:
                questionExplanation,
              options: validOptions,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to create question"
          );
        }

        setKnowledgeCheck(
          (previous) => ({
            id:
              data.question
                .knowledgeCheckId,

            questions: [
              ...(previous?.questions ||
                []),
              data.question,
            ],
          })
        );

        setQuestionText("");
        setQuestionExplanation("");

        setOptions([
          {
            text: "",
            isCorrect: true,
          },
          {
            text: "",
            isCorrect: false,
          },
          {
            text: "",
            isCorrect: false,
          },
          {
            text: "",
            isCorrect: false,
          },
        ]);
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "Failed to create question"
        );
      } finally {
        setCreatingQuestion(false);
      }
    };

  // --------------------------------
  // START EDIT
  // --------------------------------

  const startEdit = (
    block: ContentBlock
  ) => {
    setEditingId(block.id);

    setEditType(block.type);

    setEditContent(
      block.content || ""
    );

    setEditUrl(
      block.url || ""
    );

    setError("");
  };

  // --------------------------------
  // SAVE EDIT
  // --------------------------------

  const saveEdit = async (
    blockId: number
  ) => {
    setSavingEdit(true);
    setError("");

    try {
      const response = await fetch(
        `/api/teacher/courses/${courseId}/modules/${moduleId}/topics/${topicId}/content/${blockId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            type: editType,
            content:
              editContent || null,
            url:
              editUrl || null,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to update content"
        );
      }

      setTopic((previous) =>
        previous
          ? {
            ...previous,
            contentBlocks:
              previous.contentBlocks.map(
                (block) =>
                  block.id === blockId
                    ? data.block
                    : block
              ),
          }
          : previous
      );

      setEditingId(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setSavingEdit(false);
    }
  };

  // --------------------------------
  // DELETE
  // --------------------------------

  const deleteContentBlock =
    async (
      blockId: number
    ) => {
      const confirmed =
        window.confirm(
          "Delete this content block?"
        );

      if (!confirmed) return;

      setDeletingId(blockId);
      setError("");

      try {
        const response =
          await fetch(
            `/api/teacher/courses/${courseId}/modules/${moduleId}/topics/${topicId}/content/${blockId}`,
            {
              method: "DELETE",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to delete content"
          );
        }

        setTopic((previous) =>
          previous
            ? {
              ...previous,
              contentBlocks:
                previous.contentBlocks.filter(
                  (block) =>
                    block.id !==
                    blockId
                ),
            }
            : previous
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setDeletingId(null);
      }
    };

  // --------------------------------
  // CONTENT FORM
  // --------------------------------

  const renderContentForm = (
    editMode = false
  ) => {
    const type = editMode
      ? editType
      : selectedType;

    const setType = editMode
      ? setEditType
      : setSelectedType;

    const textValue = editMode
      ? editContent
      : content;

    const setTextValue = editMode
      ? setEditContent
      : setContent;

    const urlValue = editMode
      ? editUrl
      : url;

    const setUrlValue = editMode
      ? setEditUrl
      : setUrl;

    return (
      <div className="space-y-4">
        <select
          value={type}
          onChange={(e) =>
            setType(
              e.target.value
            )
          }
          className="w-full rounded-md border px-4 py-3"
        >
          {contentTypes.map(
            (item) => (
              <option
                key={item.value}
                value={item.value}
              >
                {item.label}
              </option>
            )
          )}
        </select>

        {type === "TEXT" && (
          <textarea
            value={textValue}
            onChange={(e) =>
              setTextValue(
                e.target.value
              )
            }
            placeholder="Write your content..."
            rows={6}
            className="w-full rounded-md border px-4 py-3"
          />
        )}

        {type === "VIDEO" && (
          <>
            {!editMode && (
              <input
                type="file"
                accept="video/*"
                disabled={
                  uploadingFile
                }
                onChange={(e) => {
                  const file =
                    e.target.files?.[0];

                  if (file) {
                    uploadFile(file);
                  }
                }}
                className="w-full rounded-md border px-4 py-3"
              />
            )}

            {uploadingFile &&
              !editMode && (
                <p className="text-sm text-gray-500">
                  Uploading video...
                </p>
              )}
          </>
        )}

        {type === "YOUTUBE" && (
          <input
            value={urlValue}
            onChange={(e) =>
              setUrlValue(
                e.target.value
              )
            }
            placeholder="YouTube video URL"
            className="w-full rounded-md border px-4 py-3"
          />
        )}

        {type === "PDF" && (
          <>
            {!editMode && (
              <input
                type="file"
                accept=".pdf"
                disabled={
                  uploadingFile
                }
                onChange={(e) => {
                  const file =
                    e.target.files?.[0];

                  if (file) {
                    uploadFile(file);
                  }
                }}
                className="w-full rounded-md border px-4 py-3"
              />
            )}

            {uploadingFile &&
              !editMode && (
                <p className="text-sm text-gray-500">
                  Uploading PDF...
                </p>
              )}
          </>
        )}

        {type === "IMAGE" && (
          <>
            {!editMode && (
              <input
                type="file"
                accept="image/*"
                disabled={
                  uploadingFile
                }
                onChange={(e) => {
                  const file =
                    e.target.files?.[0];

                  if (file) {
                    uploadFile(file);
                  }
                }}
                className="w-full rounded-md border px-4 py-3"
              />
            )}

            {uploadingFile &&
              !editMode && (
                <p className="text-sm text-gray-500">
                  Uploading image...
                </p>
              )}
          </>
        )}

        {type === "ARTICLE" && (
          <>
            <input
              value={urlValue}
              onChange={(e) =>
                setUrlValue(
                  e.target.value
                )
              }
              placeholder="Article URL"
              className="w-full rounded-md border px-4 py-3"
            />

            <textarea
              value={textValue}
              onChange={(e) =>
                setTextValue(
                  e.target.value
                )
              }
              placeholder="Article description..."
              rows={4}
              className="w-full rounded-md border px-4 py-3"
            />
          </>
        )}

        {type === "FUN_FACT" && (
          <textarea
            value={textValue}
            onChange={(e) =>
              setTextValue(
                e.target.value
              )
            }
            placeholder="Enter fun fact..."
            rows={4}
            className="w-full rounded-md border px-4 py-3"
          />
        )}

        {type === "GOOD_TO_KNOW" && (
          <textarea
            value={textValue}
            onChange={(e) =>
              setTextValue(
                e.target.value
              )
            }
            placeholder="Enter important information..."
            rows={4}
            className="w-full rounded-md border px-4 py-3"
          />
        )}

        {type === "COMMON_MISTAKE" && (
          <textarea
            value={textValue}
            onChange={(e) =>
              setTextValue(
                e.target.value
              )
            }
            placeholder="Explain the common mistake..."
            rows={4}
            className="w-full rounded-md border px-4 py-3"
          />
        )}
      </div>
    );
  };

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <div className="ml-64 min-h-screen bg-gray-50 p-8 pt-24">
        Loading topic...
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="ml-64 min-h-screen bg-gray-50 p-8 pt-24">
        <p className="text-red-600">
          {error || "Topic not found"}
        </p>
      </div>
    );
  }

  // --------------------------------
  // PAGE
  // --------------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <div className="p-8">
          <div className="mx-auto max-w-5xl">

            {/* TOPIC HEADER */}

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Topic Builder
                </p>

                <h1 className="mt-1 text-2xl font-bold">
                  {topic.title}
                </h1>
              </div>

              <button
                type="button"
                onClick={() =>
                  window.history.back()
                }
                className="rounded-md border px-4 py-2 text-sm"
              >
                Back
              </button>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* ADD CONTENT */}

            <div className="mt-8 rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold">
                Add Content
              </h2>

              <div className="mt-5">
                {renderContentForm()}
              </div>

              <button
                type="button"
                onClick={
                  createContentBlock
                }
                disabled={
                  creating ||
                  uploadingFile
                }
                className="mt-5 rounded-md bg-black px-5 py-3 text-sm text-white disabled:opacity-50"
              >
                {uploadingFile
                  ? "Uploading..."
                  : creating
                    ? "Saving..."
                    : "Add Content"}
              </button>
            </div>

            {/* CONTENT BLOCKS */}

            <div className="mt-8 rounded-lg border bg-white p-6">
              <h2 className="text-lg font-semibold">
                Topic Content
              </h2>

              {topic.contentBlocks.length ===
                0 ? (
                <div className="mt-5 rounded-md border border-dashed p-8 text-center text-sm text-gray-500">
                  No content added yet.
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {topic.contentBlocks.map(
                    (
                      block,
                      index
                    ) => (
                      <div
                        key={block.id}
                        className="rounded-md border p-5"
                      >
                        {editingId ===
                          block.id ? (
                          <>
                            {renderContentForm(
                              true
                            )}

                            <div className="mt-4 flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  saveEdit(
                                    block.id
                                  )
                                }
                                disabled={
                                  savingEdit
                                }
                                className="rounded-md bg-black px-4 py-2 text-sm text-white"
                              >
                                {savingEdit
                                  ? "Saving..."
                                  : "Save Changes"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  setEditingId(
                                    null
                                  )
                                }
                                className="rounded-md border px-4 py-2 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Content{" "}
                                  {index +
                                    1}
                                </p>

                                <h3 className="mt-1 font-semibold">
                                  {
                                    contentTypes.find(
                                      (
                                        item
                                      ) =>
                                        item.value ===
                                        block.type
                                    )
                                      ?.label ||
                                    block.type
                                  }
                                </h3>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    startEdit(
                                      block
                                    )
                                  }
                                  className="rounded-md border px-3 py-2 text-sm"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteContentBlock(
                                      block.id
                                    )
                                  }
                                  disabled={
                                    deletingId ===
                                    block.id
                                  }
                                  className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
                                >
                                  {deletingId ===
                                    block.id
                                    ? "Deleting..."
                                    : "Delete"}
                                </button>
                              </div>
                            </div>

                            {block.content && (
                              <div className="mt-4 whitespace-pre-wrap rounded-md bg-gray-50 p-4 text-sm">
                                {
                                  block.content
                                }
                              </div>
                            )}

                            {block.url && (
                              <div className="mt-3 rounded-md bg-gray-50 p-4 text-sm break-all">
                                {block.url}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            {/* KNOWLEDGE CHECK */}

            <div className="mt-8 rounded-lg border bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    Knowledge Check
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Create questions to check whether students
                    understood this topic.
                  </p>
                </div>
              </div>

              {/* CREATE QUESTION */}

              <div className="mt-6 rounded-md border bg-gray-50 p-5">
                <h3 className="font-semibold">
                  Add Question
                </h3>

                <textarea
                  value={questionText}
                  onChange={(e) =>
                    setQuestionText(
                      e.target.value
                    )
                  }
                  placeholder="Write your question..."
                  rows={3}
                  className="mt-4 w-full rounded-md border bg-white px-4 py-3"
                />

                <div className="mt-4 space-y-3">
                  {options.map(
                    (
                      option,
                      index
                    ) => (
                      <div
                        key={index}
                        className="flex items-center gap-3"
                      >
                        <input
                          type="radio"
                          name="correct-answer"
                          checked={
                            option.isCorrect
                          }
                          onChange={() => {
                            setOptions(
                              (
                                previous
                              ) =>
                                previous.map(
                                  (
                                    item,
                                    itemIndex
                                  ) => ({
                                    ...item,
                                    isCorrect:
                                      itemIndex ===
                                      index,
                                  })
                                )
                            );
                          }}
                        />

                        <input
                          value={
                            option.text
                          }
                          onChange={(e) => {
                            setOptions(
                              (
                                previous
                              ) =>
                                previous.map(
                                  (
                                    item,
                                    itemIndex
                                  ) =>
                                    itemIndex ===
                                      index
                                      ? {
                                        ...item,
                                        text: e
                                          .target
                                          .value,
                                      }
                                      : item
                                )
                            );
                          }}
                          placeholder={`Option ${String.fromCharCode(
                            65 + index
                          )}`}
                          className="flex-1 rounded-md border bg-white px-4 py-3"
                        />
                      </div>
                    )
                  )}
                </div>

                <textarea
                  value={
                    questionExplanation
                  }
                  onChange={(e) =>
                    setQuestionExplanation(
                      e.target.value
                    )
                  }
                  placeholder="Explanation shown after the student answers..."
                  rows={3}
                  className="mt-4 w-full rounded-md border bg-white px-4 py-3"
                />

                <button
                  type="button"
                  onClick={
                    createQuestion
                  }
                  disabled={
                    creatingQuestion
                  }
                  className="mt-4 rounded-md bg-black px-5 py-3 text-sm text-white disabled:opacity-50"
                >
                  {creatingQuestion
                    ? "Saving..."
                    : "Add Question"}
                </button>
              </div>

              {/* EXISTING QUESTIONS */}

              <div className="mt-6 space-y-4">
                {knowledgeCheck?.questions.map(
                  (
                    question,
                    index
                  ) => (
                    <div
                      key={question.id}
                      className="rounded-md border p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-gray-500">
                            Question{" "}
                            {index + 1}
                          </p>

                          <h3 className="mt-1 font-semibold">
                            {
                              question.question
                            }
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={async () => {
                            const confirmed =
                              window.confirm(
                                "Delete this question?"
                              );

                            if (
                              !confirmed
                            )
                              return;

                            await fetch(
                              `/api/teacher/courses/${courseId}/modules/${moduleId}/topics/${topicId}/knowledge-check/questions/${question.id}`,
                              {
                                method:
                                  "DELETE",
                              }
                            );

                            setKnowledgeCheck(
                              (
                                previous
                              ) =>
                                previous
                                  ? {
                                    ...previous,
                                    questions:
                                      previous.questions.filter(
                                        (
                                          item
                                        ) =>
                                          item.id !==
                                          question.id
                                      ),
                                  }
                                  : previous
                            );
                          }}
                          className="rounded-md border px-3 py-2 text-sm"
                        >
                          Delete
                        </button>
                      </div>

                      <div className="mt-4 space-y-2">
                        {question.options.map(
                          (
                            option
                          ) => (
                            <div
                              key={
                                option.id
                              }
                              className={`rounded-md border p-3 ${option.isCorrect
                                  ? "border-green-500 bg-green-50"
                                  : "bg-gray-50"
                                }`}
                            >
                              <span>
                                {
                                  option.text
                                }
                              </span>

                              {option.isCorrect && (
                                <span className="ml-2 text-xs font-semibold text-green-700">
                                  Correct Answer
                                </span>
                              )}
                            </div>
                          )
                        )}
                      </div>

                      {question.explanation && (
                        <div className="mt-4 rounded-md bg-blue-50 p-4 text-sm">
                          <strong>
                            Explanation:
                          </strong>{" "}
                          {
                            question.explanation
                          }
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}