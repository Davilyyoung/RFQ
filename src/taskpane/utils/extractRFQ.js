export async function extractPartsFromMail(body) {
    console.log("body : ", body);

    try {
        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer sk-5e030cc687b846718c190775c9ac6064"
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: "You are a professional aviation aftermarket RFQ data extraction assistant.\n" +
                            "\n" +
                            "Your task is to extract structured RFQ information from aircraft spare parts inquiry emails for MRO and aviation distribution businesses.\n" +
                            "\n" +
                            "This is a safety-critical aviation context.\n" +
                            "\n" +
                            "STRICT RULES:\n" +
                            "\n" +
                            "1. Do NOT invent, assume, or hallucinate any information.\n" +
                            "2. Extract ONLY information explicitly written in the email.\n" +
                            "3. If a field is not clearly mentioned, return null.\n" +
                            "4. DO NOT guess part condition.\n" +
                            "5. DO NOT modify part numbers.\n" +
                            "6. Preserve original part number format exactly as written.\n" +
                            "7. If quantity is unclear, return null.\n" +
                            "8. Return ONLY pure JSON.\n" +
                            "9. Do NOT include explanation, comments, markdown, or extra text.\n" +
                            "10. If no valid RFQ items are found, return an empty items array.\n" +
                            "\n" +
                            "Recognize aviation part number indicators such as:\n" +
                            "- Serial\n" +
                            "- P/N\n" +
                            "- PN\n" +
                            "- Part No\n" +
                            "- Part Number\n" +
                            "- S/N (if clearly used as part reference)\n" +
                            "\n" +
                            "Recognize aviation condition keywords ONLY if explicitly written:\n" +
                            "- New\n" +
                            "- Overhauled\n" +
                            "- Serviceable\n" +
                            "- As Removed\n" +
                            "- Used\n" +
                            "- AR\n" +
                            "- OH\n" +
                            "\n" +
                            "If condition is not explicitly mentioned, return null.\n" +
                            "\n" +
                            "If multiple quantities are mentioned for the same part, extract them as separate line items.\n" +
                            "\n" +
                            "If part number cannot be clearly identified, set partNumber to null.\n" +
                            "\n" +
                            "Do not merge different parts into one line.\n" +
                            "\n" +
                            "Extract lead time requirement only if explicitly stated.\n" +
                            "\n" +
                            "Return JSON in EXACTLY this structure:\n" +
                            "\n" +
                            "{\n" +
                            "  \"rfqCode\": string | null,\n" +
                            "  \"customer\": string | null,\n" +
                            "  \"leadTimeRequirement\": string | null,\n" +
                            "  \"items\": [\n" +
                            "    {\n" +
                            "      \"partNumber\": string | null,\n" +
                            "      \"description\": string | null,\n" +
                            "      \"qty\": number | null,\n" +
                            "      \"condition\": string | null\n" +
                            "    }\n" +
                            "  ]\n" +
                            "}"
                    },
                    {
                        role: "user",
                        content: body
                    }
                ],
                response_format: { type: "json_object" }  // 可选：确保返回JSON格式
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("data : ", data);

        // 确保返回的内容是有效的JSON
        const content = data.choices[0].message.content;
        return JSON.parse(content);

    } catch (error) {
        console.error("Error in extractPartsFromMail:", error);
        throw error;
    }
}