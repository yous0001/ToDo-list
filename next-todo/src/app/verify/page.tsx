"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/contexts/auth-context";

const VerifyContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const runVerification = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Missing verification token.");
        return;
      }
      try {
        const result = await verifyEmail(token);
        setStatus("success");
        setMessage(result || "Email verified successfully!");
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error ? error.message : "Failed to verify email."
        );
      }
    };
    runVerification();
  }, [token, verifyEmail]);

  return (
    <div className="relative px-4 py-10 font-sans sm:px-6 lg:px-8">
      <div className="mx-auto max-w-lg rounded-[32px] border border-white/15 bg-white/10 p-8 text-center text-white shadow-2xl backdrop-blur">
        <p className="text-xs uppercase tracking-[0.4em] text-white/70">
          Email verification
        </p>
        <h1 className="mt-2 text-4xl font-bold">
          {status === "success" ? "All set!" : "Verifying…"}
        </h1>
        <p className="mt-4 text-sm text-white/70">
          {status === "idle" && "Confirming your account. Please wait…"}
          {status === "success" && message}
          {status === "error" && message}
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href={status === "success" ? "/login" : "/register"}
            className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg"
          >
            {status === "success" ? "Go to login" : "Try again"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="relative px-4 py-10 font-sans sm:px-6 lg:px-8">
          <div className="mx-auto max-w-lg rounded-[32px] border border-white/15 bg-white/10 p-8 text-center text-white shadow-2xl backdrop-blur">
            <p className="text-xs uppercase tracking-[0.4em] text-white/70">
              Email verification
            </p>
            <h1 className="mt-2 text-4xl font-bold">Verifying…</h1>
            <p className="mt-4 text-sm text-white/70">
              Confirming your account. Please wait…
            </p>
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}

