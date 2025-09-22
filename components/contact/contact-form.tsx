"use client";

import { FormEvent, useRef, useState } from "react";
import { useContactFormTranslations } from "./contact-form-translation";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState("");
  const t = useContactFormTranslations();

  const formRef = useRef<HTMLFormElement>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSubmitResult("");
    const formData = new FormData(formRef.current!!);
    // Print all form fields and values
    // Convert FormData to regular object
    const data: any = {};
    formData.forEach((value: FormDataEntryValue, key: string) => {
      data[key] = value;
    });
    console.log(formData);
    // Submit data via AJAX
    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setSubmitResult(t.submitted);
      })
      .catch((error) => {
        setSubmitResult(error);
        setLoading(false);
      });
  };
  return (
    <form method="POST" className="max-w-xl" onSubmit={submit} ref={formRef}>
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-semibold leading-6 text-foreground"
          >
            {t.firstName}
          </label>
          <div className="mt-2.5">
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              autoComplete="first-name"
              className="block w-full rounded-md border-0 px-3.5 py-2 bg-background text-foreground shadow-xs ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-semibold leading-6 text-foreground"
          >
            {t.lastName}
          </label>
          <div className="mt-2.5">
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              autoComplete="given-name"
              className="block w-full rounded-md border-0 px-3.5 py-2 bg-background text-foreground shadow-xs ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold leading-6 text-foreground"
          >
            {t.email}
          </label>
          <div className="mt-2.5">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="block w-full rounded-md border-0 px-3.5 py-2 bg-background text-foreground shadow-xs ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="text-sm font-semibold leading-6 text-foreground flex items-center justify-between"
          >
            <span>{t.message}</span>
            {submitResult && (
              <span className="text-primary">{submitResult}</span>
            )}
          </label>
          <div className="mt-2.5">
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="block w-full rounded-md border-0 px-3.5 py-2 bg-background text-foreground shadow-xs ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
              defaultValue={""}
            />
          </div>
        </div>
      </div>
      <div className="mt-8">
        <button
          disabled={loading}
          type="submit"
          className="block w-full rounded-md bg-primary px-3.5 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors
                        focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {loading ? t.sending : t.send}
        </button>
      </div>
    </form>
  );
}
