import * as React from "react";
export default function ActionBar({ phase, onExtract, onSubmit }) {

    let text = "Extract RFQ";
    let handler = onExtract;
    let disabled = false;

    if (phase === "extracting") {
        text = "Analyzing...";
        disabled = true;
    }

    if (phase === "extracted") {
        text = "Review & Submit";
        handler = onSubmit;
    }

    if (phase === "submitting") {
        text = "Creating RFQ...";
        disabled = true;
    }

    if (phase === "completed") {
        text = "Completed";
        disabled = true;
    }

    if (phase === "loading") {
        disabled = true;
    }

    return (
        <button
            onClick={handler}
            disabled={disabled}
            style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "none",
                background: disabled ? "#999" : "#1976d2",
                color: "#fff",
                cursor: disabled ? "not-allowed" : "pointer"
            }}
        >
            {text}
        </button>
    );
}