import { useState } from "react";
import { FaAngleDoubleRight, FaHubspot } from "react-icons/fa";

const Contact = () => {
    const MAX_CHARS = 500;
    const [message, setMessage] = useState("");

    return (
        <section className="flex flex-col items-center justify-center w-full py-20">
            <FaHubspot className="text-5xl text-neutral-content/50" />

            <h2 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold mt-4">
                Hubspot Integration
            </h2>

            <p className="text-base lg:text-xl mt-4 lg:mb-4 ubuntu-regular text-neutral-content/85 text-center max-w-xs lg:max-w-lg">
                Send something to my CRM
            </p>

            <form className="flex flex-col items-start justify-center w-full max-w-2xl bg-base-300 rounded-xl py-6 px-4 mt-16">
                <label htmlFor="email" className="text-base ubuntu-regular text-neutral-content/85">
                    Your email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Type here"
                    className="input input-bordered w-full mt-2"
                    required
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
                    className="textarea textarea-bordered w-full mt-2"
                    placeholder="Type here"
                    required
                ></textarea>

                <div className="flex flex-row items-start justify-between w-full mt-3">
                    <p className="text-base courier-new font-semibold text-neutral-content/75">
                        {MAX_CHARS - message.length} characters left
                    </p>
                    <button type="submit" className="btn btn-neutral rounded-lg text-cyan-200">
                        Send
                        <FaAngleDoubleRight />
                    </button>
                </div>
            </form>
        </section>
    );
};

export default Contact;