import React, { useState } from "react";
import { toast } from "react-toastify";
import useHttp from "../../api/useHttp";
import { Trash2, Plus } from "lucide-react";

const AddQuiz = ({ eventId }) => {
  const { sendRequest, loading } = useHttp();
  const [formData, setFormData] = useState({
    quizName: "",
    onTopics: [],
    quizMaster: "",
    startTime: "",
    endTime: "",
    questionSwapTime: "",
    images: null,
  });

  const [questions, setQuestions] = useState([
    {
      question: "",
      answers: ["", "", "", ""],
      correctAnswer: "",
    },
  ]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setFormData({ ...formData, images: files[0] });
    } else if (name === "onTopics") {
      setFormData({ ...formData, onTopics: value.split(",").map((t) => t.trim()) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        answers: ["", "", "", ""],
        correctAnswer: "",
      },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length === 1) {
      toast.warn("At least one question is required");
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index, value) => {
    const updated = [...questions];
    updated[index].question = value;
    setQuestions(updated);
  };

  const updateAnswer = (qIndex, aIndex, value) => {
    const updated = [...questions];
    updated[qIndex].answers[aIndex] = value;
    setQuestions(updated);
  };

  const updateCorrectAnswer = (index, value) => {
    const updated = [...questions];
    updated[index].correctAnswer = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { quizName, onTopics, quizMaster, startTime, endTime, questionSwapTime } = formData;

    if (!quizName || !onTopics.length || !quizMaster || !startTime || !endTime || !questionSwapTime) {
      toast.warn("Please fill all required fields");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast.warn(`Question ${i + 1} is empty`);
        return;
      }
      if (q.answers.some((a) => !a.trim())) {
        toast.warn(`Question ${i + 1} has empty answer options`);
        return;
      }
      if (!q.correctAnswer.trim()) {
        toast.warn(`Question ${i + 1} has no correct answer selected`);
        return;
      }
      if (!q.answers.includes(q.correctAnswer)) {
        toast.warn(`Question ${i + 1} correct answer doesn't match any option`);
        return;
      }
    }

    try {
      const data = new FormData();
      data.append("quizName", quizName);
      data.append("onTopics", JSON.stringify(onTopics));
      data.append("quizMaster", quizMaster);
      data.append("startTime", startTime);
      data.append("endTime", endTime);
      data.append("questionSwapTime", questionSwapTime);
      data.append("questions", JSON.stringify(questions));
      if (formData.images) data.append("images", formData.images);

      const res = await sendRequest(`/superAdmin/event/${eventId}/quiz`, "POST", data);

      if (res?.message === "Quiz created") {
        toast.success("Quiz created successfully!");
        setFormData({
          quizName: "",
          onTopics: [],
          quizMaster: "",
          startTime: "",
          endTime: "",
          questionSwapTime: "",
          images: null,
        });
        setQuestions([
          {
            question: "",
            answers: ["", "", "", ""],
            correctAnswer: "",
          },
        ]);
      } else {
        toast.error(res?.message || "Failed to create quiz");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating quiz");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-gray-100 py-10 px-4 flex justify-center">
      <div className="w-full max-w-5xl bg-[#141C2F] rounded-3xl shadow-xl border border-gray-800 p-6 sm:p-8 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
          Add Quiz
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Quiz Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-gray-300 font-medium">Quiz Name</label>
              <input
                type="text"
                name="quizName"
                value={formData.quizName}
                onChange={handleChange}
                placeholder="Enter quiz name"
                className="w-full p-3 rounded-xl bg-[#1E2A47] text-gray-100 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300 font-medium">Quiz Master</label>
              <input
                type="text"
                name="quizMaster"
                value={formData.quizMaster}
                onChange={handleChange}
                placeholder="Enter quiz master name"
                className="w-full p-3 rounded-xl bg-[#1E2A47] text-gray-100 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-gray-300 font-medium">Topics (comma separated)</label>
            <input
              type="text"
              name="onTopics"
              value={formData.onTopics.join(", ")}
              onChange={handleChange}
              placeholder="Environment, Arts, Science"
              className="w-full p-3 rounded-xl bg-[#1E2A47] text-gray-100 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-2 text-gray-300 font-medium">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[#1E2A47] text-gray-100 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-300 font-medium">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-[#1E2A47] text-gray-100 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-300 font-medium">Swap Time (sec)</label>
              <input
                type="number"
                name="questionSwapTime"
                value={formData.questionSwapTime}
                onChange={handleChange}
                placeholder="30"
                className="w-full p-3 rounded-xl bg-[#1E2A47] text-gray-100 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-gray-300 font-medium">Upload Image (Optional)</label>
            <input
              type="file"
              name="images"
              onChange={handleChange}
              accept="image/*"
              className="block w-full text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
            />
          </div>

          {/* Questions */}
          <div className="border-t border-gray-700 pt-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold text-blue-400">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors w-full sm:w-auto justify-center"
              >
                <Plus size={18} />
                Add Question
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div
                  key={qIndex}
                  className="bg-[#1E2A47] p-5 rounded-xl border border-gray-700 space-y-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-200">Question {qIndex + 1}</h3>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-300 text-sm">Question Text</label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => updateQuestion(qIndex, e.target.value)}
                      placeholder="Enter your question"
                      className="w-full p-3 rounded-lg bg-[#141C2F] text-gray-100 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.answers.map((answer, aIndex) => (
                      <div key={aIndex}>
                        <label className="block mb-2 text-gray-300 text-sm">
                          Option {aIndex + 1}
                        </label>
                        <input
                          type="text"
                          value={answer}
                          onChange={(e) => updateAnswer(qIndex, aIndex, e.target.value)}
                          placeholder={`Answer option ${aIndex + 1}`}
                          className="w-full p-3 rounded-lg bg-[#141C2F] text-gray-100 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-300 text-sm">Correct Answer</label>
                    <select
                      value={q.correctAnswer}
                      onChange={(e) => updateCorrectAnswer(qIndex, e.target.value)}
                      className="w-full p-3 rounded-lg bg-[#141C2F] text-gray-100 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select correct answer</option>
                      {q.answers.map((answer, aIndex) => (
                        <option key={aIndex} value={answer} disabled={!answer.trim()}>
                          {answer.trim() || `Option ${aIndex + 1} (empty)`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg text-lg"
          >
            {loading ? "Creating Quiz..." : "Create Quiz"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddQuiz;
