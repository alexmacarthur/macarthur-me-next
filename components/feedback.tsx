import { useEffect } from "react";

const Feedback = ({ url }: { url: string }) => {
  const slug = url.split("/posts/").reverse()[0];

  useEffect(() => {
    const handleFeedback = (e) => {
      const {
        detail: { value },
      } = e;

      fetch(`/api/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug, value }),
      });
    };

    document.addEventListener("feedback:interaction", handleFeedback);

    return () => {
      document.removeEventListener("feedback:interaction", handleFeedback);
    };
  }, []);

  return (
    <div className="mt-16">
      <hr className="divider" />

      <div className="flex flex-col md:flex-row justify-center items-center py-14 md:space-x-6">
        <span className="text-center md:text-left block prose">
          <feedback-component data-slug={slug}>
            <span slot="cta">Was this post helpful?</span>
            <span slot="confirmation">Thanks for the feedback!</span>
          </feedback-component>
        </span>
      </div>

      <hr className="divider" />
    </div>
  );
};

export default Feedback;
