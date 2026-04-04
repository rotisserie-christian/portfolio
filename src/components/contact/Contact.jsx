import { useState } from "react";
import { FaAngleDoubleRight, FaHubspot } from "react-icons/fa";
import { handleSend } from "./handleSend";

const Contact = ({ 
    Icon = FaHubspot, 
    heading = "Hubspot Integration", 
    tagline = "Send something to my CRM",
    source = "home" 
}) => {
    const MAX_CHARS = 500;
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("idle"); // idle | loading | success | error
    const [errorMessage, setErrorMessage] = useState("");

    const handleSendMessage = async (e) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        const result = await handleSend(email, message, source);

        if (result.success) {
            setStatus("success");
            setMessage("");
            setEmail("");
        } else {
            setStatus("error");
            setErrorMessage(result.error);
        }
    };

    return (
        <section data-section="contact" className="flex flex-col items-center justify-center w-full pt-20 pb-40 px-4">
            <Icon className="text-5xl lg:text-6xl text-neutral-content/80" />

            <h2 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold mt-4 text-center">
                {heading}
            </h2>

            <p className="text-base lg:text-xl mt-4 lg:mb-4 ubuntu-regular text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                {tagline}
            </p>

            <form
                onSubmit={handleSendMessage}
                className="flex flex-col items-start justify-center w-full max-w-2xl bg-base-300 rounded-xl py-6 px-4 mt-16"
            >
                <label htmlFor="email" className="text-base ubuntu-regular text-neutral-content/85">
                    Your email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Type here"
                    className="input input-bordered text-base w-full mt-2 placeholder:text-neutral-content/40"
                    required
                    disabled={status === "loading"}
                />

                <label htmlFor="message" className="text-base lg:text-base ubuntu-regular text-neutral-content/85 mt-8">
                    Your message
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={MAX_CHARS}
                    className="textarea textarea-bordered text-base w-full mt-2 placeholder:text-neutral-content/40"
                    placeholder="Type here"
                    required
                    disabled={status === "loading"}
                ></textarea>

                <div className="flex flex-row items-center justify-between w-full mt-3">
                    <p className="text-base courier-new font-semibold text-neutral-content/75">
                        {MAX_CHARS - message.length} characters left
                    </p>

                    <button
                        type="submit"
                        disabled={status === "loading" || status === "success"}
                        className={`btn btn-neutral rounded-lg text-cyan-200 ${status === "success" ? "btn-success text-white" : ""}`}
                    >
                        {status === "loading" ? (
                            <span className="loading loading-spinner loading-sm"></span>
                        ) : status === "success" ? (
                            "Success!"
                        ) : (
                            <>
                                Send
                                <FaAngleDoubleRight />
                            </>
                        )}
                    </button>
                </div>

                {status === "error" && (
                    <div className="mt-4 text-error text-sm ubuntu-regular">
                        {errorMessage}
                    </div>
                )}
            </form>
        </section>
    );
};

export default Contact;
