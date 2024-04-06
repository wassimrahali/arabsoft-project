import React, { useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import "../App.css";

import Dashboard from "../Components/Dashboard/Header";
import Footer from "../Components/Footer";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const baseUrl = "http://localhost:8000";

  const sendEmail = async () => {
    let dataSend = {
      email: email,
      subject: subject,
      message: message,
    };

    const res = await fetch(`${baseUrl}/email/sendEmail`, {
      method: "POST",
      body: JSON.stringify(dataSend),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    console.log(res);
    if (res.status > 199 && res.status < 300) {
      alert("Send Successfully !");
    }
  };

  return (
    <>
      <Dashboard />
      <div className="container mt-5">
        <div className="heading">Contact Us</div>
        <div>
          <form>
            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Receiver's Email Address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter the subject here..."
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea
                className="form-control"
                placeholder="Enter your message here..."
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => sendEmail()}
            >
              Send Email
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
