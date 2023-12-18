"use client";
import { Button, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export default function TestEmail() {
  const [message1, setMessage1] = useState({
    email: "",
    subject: "",
    html: "",
  });
  const [response, setResponse] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage1({ ...message1, [e.target.name]: e.target.value });
  };
  const handleClick1 = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setResponse("送信中...");
    try {
      const response = await axios({
        method: "post",
        url: "/email",
        data: message1,
      });
      setResponse(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setResponse(error.message);
      } else {
        setResponse("錯誤");
      }
    }
  };
  return (
    <div>
      <div style={{ border: "1px solid lightgray", marginTop: "40px", padding: "10px" }}>
        <center>
          <br />
          <h3>器材催還</h3>
          <br />
          <p style={{textAlign: "left", width: "800px", marginBottom: "10px"}}>信件預覽：</p>
          <div
            style={{
              border: "1px solid lightgray ",
              width: "800px",
              boxShadow: "5px 5px 5px lightgray",
              padding: "15px",
            }}
          >
            <div>
              <TextField
                type="text"
                name="subject"
                // value={message.subject}
                value="輔仁大學體育器材室催還通知"
                placeholder="主題"
                onChange={handleChange}
                style={{ width: "240px" }}
                InputProps={{ readOnly: true }}
              />
            </div>
            <br />
            <div>
              <TextField
                type="text"
                name="html"
                // value={message.html}
                value="老師/同學您好：您租借之器材已達歸還時間，為確保其他同仁租借權益，請立即將器材歸還。"
                placeholder="內容"
                onChange={handleChange}
                style={{ width: "700px" }}
                InputProps={{ readOnly: true }}
              />
            </div>
          </div>
          <br />
          <div>
            <TextField
              type="email"
              name="email"
              value={message1.email}
              placeholder="請填寫發送信箱"
              onChange={handleChange}
              autoComplete="email"
              size="small"
              style={{ width: "800px", marginBottom: "20px" }}
            />
          </div>
          <div>{response}</div>
          <Button
              variant="outlined"
              color="secondary"
              size="medium"
              onClick={handleClick1}
              style={{ marginBottom: "20px", marginTop: "10px" }}
            >
              送出
            </Button>
        </center>
      </div>
    </div>
  );
}
