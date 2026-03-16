import { useState } from "react";
import { FaAngleDoubleRight } from "react-icons/fa";

const Contact = () => {
    const MAX_CHARS = 500;
    const [message, setMessage] = useState("");

    return (
        <section className="flex flex-col items-center justify-center w-full py-20">
            <h1 className="text-3xl lg:text-5xl text-neutral-content/85 ubuntu-bold">
                Contact
            </h1>

            <div className="flex flex-col items-start justify-center w-full max-w-lg bg-base-300 rounded-xl p-6 mt-16">
                <p className="text-sm lg:text-base ubuntu-regular text-neutral-content/85">
                    Your email
                </p>
                <input type="email" placeholder="Type here" className="input input-bordered w-full mt-2" />

                <p className="text-sm lg:text-base ubuntu-regular text-neutral-content/85 mt-8">
                    Your message
                </p>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={MAX_CHARS}
                    className="textarea textarea-bordered w-full mt-2"
                    placeholder="Type here"
                ></textarea>

                <div className="flex flex-row items-start justify-between w-full mt-3">
                    <p className="text-sm lg:text-base courier-new font-semibold text-neutral-content/75">
                        {MAX_CHARS - message.length} characters left
                    </p>
                    <button className="btn btn-neutral rounded-lg text-cyan-200">
                        Send
                        <FaAngleDoubleRight />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Contact;