import React from "react";

const Home = () => {
  return (
    <>
      <section className="py-24 flex items-center min-h-48 justify-center bg-white dark:bg-[#000000]">
        <div className="mx-auto max-w-[43rem]">
          <div className="text-center">
            <p className="text-lg font-medium leading-8 text-blue-600">
              Securely Encrypting and Delivering Quizzes
            </p>
            <h1 className="mt-3 text-[3.5rem] font-bold leading-[4rem] tracking-tight text-black dark:text-white">
              Securely Distribute Your Educational Content
            </h1>
            <p className="mt-3 text-lg leading-relaxed text-slate-400">
              Safeguard quizzes with robust encryption for confident and secure
              learning experiences. Unlock a seamless journey from creation to
              assessment with our trusted platform.
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <a
              href="#"
              className="transform rounded-md  bg-blue-600 px-5 py-3 font-medium text-white transition-colors hover:bg-blue-800">
              Get started for free
            </a>
            <a
              href="#"
              className="transform rounded-md border border-slate-200 px-5 py-3 font-medium text-slate-900 transition-colors hover:bg-slate-50 dark:text-white hover:dark:text-black">
              Start Encrypting
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
