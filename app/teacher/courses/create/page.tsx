"use client";

import { useState } from "react";
import { ArrowLeft, BookOpen, Save } from "lucide-react";
import Link from "next/link";

export default function CreateCoursePage() {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-950">

      {/* PAGE HEADER */}
      <div className="w-full border-b border-slate-200 dark:border-slate-800">
        <div className="flex w-full items-center justify-between px-5 py-4 sm:px-8">

          {/* LEFT */}
          <div className="flex min-w-0 items-center gap-3">

            <Link
              href="/teacher/courses"
              className="
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-lg
                text-slate-500
                hover:bg-slate-100
                hover:text-slate-900
                dark:hover:bg-slate-800
                dark:hover:text-white
              "
            >
              <ArrowLeft size={19} />
            </Link>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-slate-900 dark:text-white">
                Create Course
              </h1>

              <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
                Set up the basic information for your course
              </p>
            </div>

          </div>

          {/* SAVE BUTTON */}

          <button
            type="button"
            className="
              flex shrink-0 items-center gap-2
              rounded-lg
              bg-emerald-600
              px-3 py-2
              text-sm font-medium
              text-white
              transition
              hover:bg-emerald-700
              sm:px-4
            "
          >
            <Save size={16} />

            <span className="hidden sm:inline">
              Save & Continue
            </span>

            <span className="sm:hidden">
              Save
            </span>
          </button>

        </div>
      </div>


      {/* PAGE CONTENT */}

      <div className="w-full px-5 py-8 sm:px-8">

        <div className="mx-auto w-full max-w-4xl">

          {/* INTRO */}

          <div className="mb-8">

            <div
              className="
                flex h-14 w-14
                items-center justify-center
                rounded-2xl
                bg-emerald-100
                text-emerald-700
                dark:bg-emerald-950
                dark:text-emerald-400
              "
            >
              <BookOpen size={26} />
            </div>

            <h2
              className="
                mt-5
                text-2xl
                font-bold
                text-slate-900
                dark:text-white
              "
            >
              Start your course
            </h2>

            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                text-slate-500
                dark:text-slate-400
              "
            >
              Add some basic information first. You can build
              the modules and topics after this.
            </p>

          </div>


          {/* FORM CARD */}

          <div
            className="
              w-full
              rounded-2xl
              border border-slate-200
              bg-white
              p-5
              shadow-sm
              dark:border-slate-800
              dark:bg-slate-900
              sm:p-7
            "
          >

            {/* COURSE NAME */}

            <div className="mb-6">

              <label
                htmlFor="courseName"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-800
                  dark:text-slate-200
                "
              >
                Course Name
              </label>

              <input
                id="courseName"
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Example: Database Management System"
                className="
                  w-full
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  px-4 py-3
                  text-sm
                  text-slate-900
                  outline-none
                  transition

                  placeholder:text-slate-400

                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-100

                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                  dark:placeholder:text-slate-500
                  dark:focus:ring-emerald-950
                "
              />

            </div>


            {/* SUBJECT */}

            <div className="mb-6">

              <label
                htmlFor="subject"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-800
                  dark:text-slate-200
                "
              >
                Subject
              </label>

              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Example: DBMS"
                className="
                  w-full
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  px-4 py-3
                  text-sm
                  text-slate-900
                  outline-none
                  transition

                  placeholder:text-slate-400

                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-100

                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                  dark:placeholder:text-slate-500
                  dark:focus:ring-emerald-950
                "
              />

            </div>


            {/* DESCRIPTION */}

            <div>

              <label
                htmlFor="description"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-slate-800
                  dark:text-slate-200
                "
              >
                Course Description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Explain what students will learn in this course..."
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border border-slate-200
                  bg-slate-50
                  px-4 py-3
                  text-sm
                  text-slate-900
                  outline-none
                  transition

                  placeholder:text-slate-400

                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-100

                  dark:border-slate-700
                  dark:bg-slate-950
                  dark:text-white
                  dark:placeholder:text-slate-500
                  dark:focus:ring-emerald-950
                "
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}