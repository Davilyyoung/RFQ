import React, { useEffect, useState } from "react";

const App = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    Office.onReady(() => {
      const item = Office.context.mailbox.item;

      if (!item) {
        console.log("没有邮件对象");
        return;
      }

      // 获取主题
      setSubject(item.subject);

      // 获取正文（必须异步）
      item.body.getAsync(
          Office.CoercionType.Text, // 也可以用 Html
          (result) => {
            if (result.status === Office.AsyncResultStatus.Succeeded) {
              setBody(result.value);
            } else {
              console.error(result.error.message);
            }
          }
      );
    });
  }, []);

  return (
      <div style={{ padding: 20 }}>
        <h2>邮件主题</h2>
        <p>{subject}</p>

        <h2>邮件正文</h2>
        <pre style={{ whiteSpace: "pre-wrap" }}>{body}</pre>
      </div>
  );
};

export default App;