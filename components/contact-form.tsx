import { useState } from "react";

const ContactForm = () => {
  const [validationMessage, setValidationMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const response = await fetch("/api/email", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData as any).toString(),
    });

    await response.json();

    e.target.reset();
    setValidationMessage("Message successfully sent!");
  };

  return (
    <div className="mx-auto max-w-2xl">
      {validationMessage && (
        <span
          className={
            "block text-base md:text-xl bg-green-200 text-green-700 px-3 py-2 rounded-md mb-10 text-center"
          }
        >
          {validationMessage}
        </span>
      )}

      <form
        name="contact"
        method="post"
        action="/api/email"
        onSubmit={handleSubmit}
        style={{
          flex: "1",
        }}
      >
        <p className="mb-4">
          <label className="block">
            Your name:
            <br />
            <input required type="text" name="name" />
          </label>
        </p>

        <p className="mb-4">
          <label className="block">
            Your email:
            <br />
            <input required type="email" name="email" />
          </label>
        </p>

        <p className="mb-4">
          <label className="block">
            Message:
            <br />
            <textarea required name="message" rows={4} />
          </label>
        </p>

        <p className="mt-6">
          <button type="submit" className="button">
            Send
          </button>
        </p>
      </form>
    </div>
  );
};

export default ContactForm;
