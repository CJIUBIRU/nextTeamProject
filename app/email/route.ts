import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  const smtpOptions = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: true,
    auth: {
      user: process.env.SMTP_USER || "user",
      pass: process.env.SMTP_PASSWORD || "password",
    },
  };

  try {
    const transporter = nodemailer.createTransport(smtpOptions);
    const data = await request.json();
    console.log("body:", data);
    // const formData = await request.json();

    if (data) {
      await transporter.sendMail({
        from: process.env.SMTP_USER || "trickleofbenefaction@gmail.com",
        to: data.email || "microsoftdeanchiu@gmail.com",
        subject: data.subject || "輔仁大學體育器材室催還通知",
        html: data.html || "<h1>老師/同學您好，輔大體育器材室在此提醒，您租借之器材已達歸還時間，為確保其他同仁租借權益，請立即將器材繳回體育器材室。</h1>",
      });
      return NextResponse.json({ message: "成功送出信件" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "error" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "error" }, { status: 500 });
  }
}