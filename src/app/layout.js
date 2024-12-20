import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Achieva",
  description: "Achieva is your ultimate productivity companion, designed to streamline task management and help you achieve your goals with ease. Whether you're an individual looking to stay on top of personal tasks, or a team working collaboratively on projects, Achieva provides an intuitive, organized, and simple interface to keep you focused and motivated. With Achieva, you can effortlessly create, track, and prioritize your tasks, set deadlines, and monitor progress with a sleek, user-friendly dashboard. Our powerful tools, including smart reminders, collaboration features, and detailed progress tracking, ensure you stay on track and never miss a deadline. Say goodbye to overwhelming to-do lists and hello to a smooth, seamless workflow. Whether you're tackling daily routines or complex projects, Achieva helps you optimize your time, reduce stress, and unlock your full potential. Achieve your tasks, one flow at a time!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > */}
      <body
      >
        {children}
      </body>
    </html>
  );
}
