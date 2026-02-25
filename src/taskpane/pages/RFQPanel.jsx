import React, { useState, useEffect } from "react";
import { getMailContent } from "../services/mailService";
import PartsTable from "../components/PartsTable";
import Header from "../components/Header";
import ActionBar from "../components/ActionBar";
import {extractPartsFromMail} from "../utils/extractRFQ";
import { createRFQ } from "../api/mockApi";
export default function RFQPanel() {
    const USE_FRONTEND_AI = true;// 前端AI 测试
    const USE_MOCK = true;// 后端 测试
    const [mail, setMail] = useState(null);
    const [parts, setParts] = useState([]);
    const [rfqCode, setRfqCode] = useState([]);
    const [phase, setPhase] = useState("loading");
    const [error, setError] = useState(null);

    useEffect(() => {
        async function loadMail() {
            try {
                setPhase("loading");

                const data = await getMailContent();
                setMail(data);

                setPhase("idle");
            } catch (err) {
                setError(err.toString());
                setPhase("error");
            }
        }

        loadMail();
    }, []);

    // ✅ 企业正式流程：前端 → 后端 → AI
    const handleExtract = async () => {
        if (!mail || phase === "extracting") return;

        try {
            setPhase("extracting");
            setParts([]);
            setRfqCode();
            let data;

            if (USE_FRONTEND_AI) {
                data = await extractPartsFromMail(mail.body);
            } else {
                const response = await fetch("/api/rfq/extract", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        subject: mail.subject,
                        body: mail.body
                    })
                });

                data = await response.json();
            }

            setParts(data.items || data);
            setRfqCode(data.rfqCode);
            setPhase("extracted");

        } catch (err) {
            console.error(err);
            setPhase("error");
        }
    };

    const handleSubmit = async () => {
        if (parts.length === 0 || phase === "submitting") return;

        try {
            setPhase("submitting");

            let result;

            if (USE_MOCK) {
                setPhase("submitting");

                result = await createRFQ({
                    subject: rfqCode,
                    items: parts
                });
            } else {
                const response = await fetch("/api/rfq/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        subject: rfqCode,
                        items: parts
                    })
                });

                result = await response.json();
            }

            console.log(result);
            setPhase("completed");

        } catch (err) {
            console.error(err);
            setError(err.toString());
            setPhase("error");
        }
    };

    return (
        <div style={styles.container}>
            <Header />

            {/* 全局错误 */}
            {phase === "error" && (
                <div style={styles.error}>
                    Error: {error}
                </div>
            )}

            {mail && (
                <>
                    <div style={styles.mailCard}>
                        <h4>Data mapped from current email</h4>
                        <div>
                            <strong>Email Title:</strong> {mail.subject}
                        </div>
                    </div>

                    {/* Loading 邮件 */}
                    {phase === "loading" && (
                        <div style={styles.loadingBox}>
                            Loading mail...
                        </div>
                    )}

                    {/* AI处理中 */}
                    {phase === "extracting" && (
                        <div style={styles.loadingBox}>
                            <div style={styles.spinner}></div>
                            <div style={{ marginTop: 10 }}>
                                AI is analyzing the email...
                            </div>
                        </div>
                    )}

                    {/* 展示结果 */}
                    {phase === "extracted" && (
                        <PartsTable items={parts} />
                    )}

                    {/* 创建中 */}
                    {phase === "submitting" && (
                        <div style={styles.loadingBox}>
                            Creating RFQ...
                        </div>
                    )}

                    {/* 创建成功 */}
                    {phase === "completed" && (
                        <div style={styles.success}>
                            RFQ Created Successfully
                        </div>
                    )}

                    <ActionBar
                        phase={phase}
                        onExtract={handleExtract}
                        onSubmit={handleSubmit}
                    />
                </>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: 20,
        fontFamily: "Segoe UI",
        background: "#f4f6f9",
        minHeight: "100vh"
    },
    mailCard: {
        background: "#e8f5e9",
        padding: 16,
        borderRadius: 10,
        marginBottom: 16,
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
    },
    loadingBox: {
        background: "#ffffff",
        padding: 20,
        borderRadius: 10,
        textAlign: "center",
        marginBottom: 16,
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
    },
    spinner: {
        width: 40,
        height: 40,
        border: "4px solid #ddd",
        borderTop: "4px solid #0078d4",
        borderRadius: "50%",
        margin: "0 auto",
        animation: "spin 1s linear infinite"
    },
    error: {
        color: "red",
        marginBottom: 16
    },
    success: {
        color: "green",
        fontWeight: "bold",
        marginBottom: 16
    }
};