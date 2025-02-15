import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileCard from "@/components/Recruitments/Submission/ProfileCard";
import TimeLine from "@/components/Recruitments/Submission/TimeLine";
import EmailLogin from "@/components/Recruitments/Submission/EmailLogin";
import TaskCard from "@/components/Recruitments/Submission/TaskCard";

const taskTypeInstructions = {
    Technical:
        "Choose the task as per your preference, for Web Dev Choose any one among Front End, Back End or Full Stack. Click the Submit Task button to submit your task before the deadline.",
    Creatives:
        "Submit your creative designs or content for review. Ensure your work is original and aligns with the provided guidelines. Click the Submit Task button to submit your work.",
    Corporate:
        "Complete all sections thoughtfully and submit your responses by the deadline using your SRM email ID click the 'View Task' Button to Open submission form. Keep your answers original and true to yourself. (No AI/ChatGPT assistance allowed!)"
};

const getSubmitButtonText = (domain) => {
    return domain === "Corporate" ? "View Task" : "Submit Task";
};

const Submission = () => {
    const [email, setEmail] = useState("");
    const [participantData, setParticipantData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [selectedTaskType, setSelectedTaskType] = useState("");

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@srmist\.edu\.in$/;
        if (!emailPattern.test(email)) {
            return "Please enter a valid @srmist.edu.in email address.";
        }
        return "";
    };

    const resetForm = () => {
        setError("");
        setParticipantData(null);
        setEmail("");
        setEmailError("");
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);

        const errorMessage = validateEmail(newEmail);
        setEmailError(errorMessage);
    };

    const handleLogin = async () => {
        setLoading(true);
        setError("");

        const validationError = validateEmail(email);
        if (validationError) {
            setEmailError(validationError);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get("/api/v1/recruitment/task", {
                params: { email }
            });
            setTimeout(() => {
                setParticipantData(response.data);
                setLoading(false);
            }, 2000);
        } catch (error) {
            setTimeout(() => {
                if (error.response?.status === 404) {
                    setError("Participant Not Found");
                } else {
                    setError(
                        error.response?.data?.message ||
                        "Failed to fetch data. Please try again."
                    );
                }
                setLoading(false);
            }, 2000);
        }
    };

    // Group tasks by task type
    const groupTasksByType = (tasks) => {
        const grouped = {};

        tasks.forEach((task) => {
            if (!grouped[task.taskType]) {
                grouped[task.taskType] = [];
            }
            grouped[task.taskType].push(task);
        });

        return grouped;
    };

    // Extract unique task types
    const getTaskTypes = (tasks) => {
        const taskTypes = new Set();
        tasks.forEach((task) => {
            taskTypes.add(task.taskType);
        });
        return Array.from(taskTypes);
    };

    useEffect(() => {
        if (participantData && participantData.tasks.length > 0) {
            const taskTypes = getTaskTypes(participantData.tasks);
            if (taskTypes.length > 0 && !selectedTaskType) {
                // Set the first task type as default
                setSelectedTaskType(taskTypes[0]);
            }
        }
    }, [participantData, selectedTaskType]);

    // Render buttons for each task type
    const renderTaskTypeButtons = (taskTypes) => {
        if (taskTypes.length > 1) {
            return (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-flow-col-dense">
                    {taskTypes.map((type) => (
                        <button
                            key={type}
                            className={`px-4 py-2 rounded-md text-white font-poppins ${selectedTaskType === type
                                ? "bg-green-500"
                                : "bg-gray-700"
                                } hover:bg-green-600`}
                            onClick={() => setSelectedTaskType(type)}
                        >
                            {type} Tasks
                        </button>
                    ))}
                </div>
            );
        } else {
            return (
                <div className="center">
                    {taskTypes.map((type) => (
                        <button
                            key={type}
                            className={`px-4 py-2 rounded-md text-white font-poppins ${selectedTaskType === type
                                ? "bg-green-500"
                                : "bg-gray-700"
                                } hover:bg-green-600`}
                            onClick={() => setSelectedTaskType(type)}
                        >
                            {type} Tasks
                        </button>
                    ))}
                </div>
            );
        }
    };

    const renderTasks = (groupedTasks) => {
        const tasksToShow = groupedTasks[selectedTaskType] || [];

        return tasksToShow.map((task, index) => (
            <TaskCard
                key={task._id}
                task={task}
                domain={participantData.domain}
            />
        ));
    };

    // Render instructions for the selected task type
    const renderInstructions = (domain) => {
        if (!domain) return null;

        const instructions =
            taskTypeInstructions[domain] || "No instructions available.";
        return (
            <div className="mb-4 p-4 border-transparent backdrop-filter backdrop-blur-sm bg-gray-500 bg-opacity-30 text-white rounded-xl max-w-2xl z-40 text-justify">
                <p>{instructions}</p>
                {/* Added Discord Query Section */}
                <p className="mt-4 text-lg font-semibold">
                    For any queries, reach us on{" "}
                    <a
                        href="https://discord.gg/Ek2FKk855n"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bright_green underline hover:text-green-400 transition-colors duration-300"
                    >
                        Discord
                    </a>
                </p>
            </div>
        );
    };

    const taskForm = (domain) => {
        switch (domain) {
            case "Technical":
                return "https://forms.gle/TNJcF9X6xxXYo8Ax9";
            case "Creatives":
                return "https://forms.gle/1CMRyQnDfyXQDrFj7";
            case "Corporate":
                return "https://docs.google.com/forms/d/e/1FAIpQLSfEpy3fL_Rz_NcJBKYoqIKbXTEvz0TgR2PNPqJq_FjN0RFJiQ/viewform?usp=sf_link";
            default:
                return "";
        }
    };

    return (
        <section
            className={`relative w-full ${participantData ? "" : "h-[80vh]"
                } overflow-hidden`}
        >
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover"
            >
                <source src="/bghero.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-bg_black"></div>

            {/* Loading or error overlay */}
            {(loading || error) && (
                <div className="absolute inset-0 flex items-center justify-center bg-bg_black bg-opacity-60 backdrop-blur-sm z-50">
                    <div className="mx-3 lg:mx-auto w-[500px] bg-gray-950 rounded-xl overflow-hidden drop-shadow-xl">
                        <div className="bg-[#333] flex items-center p-[5px] text-white relative">
                            <div className="flex absolute left-3">
                                <span
                                    className="h-3.5 w-3.5 bg-[#ff605c] rounded-xl mr-2 cursor-pointer"
                                    onClick={resetForm}
                                ></span>
                                <span className="h-3.5 w-3.5 bg-[#ffbd44] rounded-xl mr-2"></span>
                                <span className="h-3.5 w-3.5 bg-[#00ca4e] rounded-xl"></span>
                            </div>
                            <div className="flex-1 text-center text-white">
                                status
                            </div>
                        </div>
                        <div
                            className={`p-2.5 ${error ? "text-red-500" : "text-[#0f0]"
                                }`}
                        >
                            <div>
                                <span className="mr-2">
                                    {error ? error : "Loading"}
                                </span>
                                <>
                                    <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite]">
                                        .
                                    </span>
                                    <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite]">
                                        .
                                    </span>
                                    <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite]">
                                        .
                                    </span>
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main content */}
            {participantData ? (
                <div className="bg-bg_black flex flex-col items-center justify-center text-white p-4 sm:p-6">
                    {/* Profile Card Section */}
                    <div className="relative w-full sm:w-auto mx-4 my-2 sm:mx-10">
                        <ProfileCard
                            name={participantData.name}
                            regNo={participantData.regNo}
                            domain={participantData.domain}
                        />
                    </div>

                    {/* Timeline Section */}
                    <div className="relative w-full sm:w-auto lg:w-max my-1">
                        <TimeLine status={participantData.status} />
                    </div>

                    {/* Task Instructions*/}
                    {renderInstructions(participantData.domain)}

                    {/* Render Task Type Buttons */}
                    <div className="flex flex-row sm:flex-row justify-center my-4 z-40">
                        {renderTaskTypeButtons(
                            getTaskTypes(participantData.tasks)
                        )}
                    </div>

                    {/* Render Tasks Based on Selected Task Type */}
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-10 z-40">
                        {selectedTaskType &&
                            renderTasks(
                                groupTasksByType(participantData.tasks)
                            )}
                    </div>
                    <div className="mt-16 z-50">
                        <a
                            href={taskForm(participantData.domain)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-black text-md bg-[#0DFF4E] rounded-full py-4 px-8 w-32 md:w-28 sm:w-96 max-w-xs opacity-95 hover:opacity-100 transition-opacity duration-300 text-center mx-auto"
                        >
                            {getSubmitButtonText(participantData.domain)}
                        </a>
                    </div>
                </div>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center z-60 p-4 sm:p-6">
                    <EmailLogin
                        email={email}
                        emailError={emailError}
                        handleEmailChange={handleEmailChange}
                        handleLogin={handleLogin}
                    />
                </div>
            )}
        </section>
    );
};

export default Submission;
