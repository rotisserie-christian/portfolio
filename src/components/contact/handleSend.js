import { supabase } from "../../supabaseClient";

/**
 * Validates and sends the message to the edge function.
 * @param {string} email 
 * @param {string} message 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const handleSend = async (email, message) => {
    const cleanEmail = email?.trim();
    const cleanMessage = message?.trim();

    if (!cleanEmail || !cleanMessage) {
        return { success: false, error: "Email and message are missing" };
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
        return { success: false, error: "Invalid email" };
    }

    // Length validation
    if (cleanMessage.length < 5) {
        return { success: false, error: "Message too short" };
    }
    if (cleanMessage.length > 500) {
        return { success: false, error: "Message too long" };
    }

    try {
        const { error } = await supabase.functions.invoke("handle-message", {
            body: { email: cleanEmail, message: cleanMessage },
        });

        if (error) {
            const errorMsg = typeof error === 'string' ? error : error.message || "Failed to send";
            throw new Error(errorMsg);
        }

        return { success: true };
    } catch (err) {
        console.error("Submission error:", err);
        return {
            success: false,
            error: err.message || "Error"
        };
    }
};
