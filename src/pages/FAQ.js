import React from "react";
import "./FAQ.css";

const FAQ = () => {
  return (
    <div className="faq-container">
      <h1>Frequently Asked Questions (FAQ)</h1>
      <h3>Q1: Is Islamic Sphere free to use?</h3>
      <p>Yes, all core features are free. Future premium features (if any) will be optional.</p>

      <h3>Q2: How do I create a group?</h3>
      <p>Go to the Groups page and click “Create Group”. Fill in the required fields.</p>

      <h3>Q3: Can I invite friends?</h3>
      <p>Yes, after they accept your friend request, you can add them to your groups.</p>

      <h3>Q4: How do I join a scholar session?</h3>
      <p>Visit the Q&A section, find the session card, and click “Join” when it's live.</p>

      <h3>Q5: I didn't receive the Gmail code. What should I do?</h3>
      <p>Check your spam folder. If the issue persists, contact support@islamicsphere.app.</p>

      <h3>Q6: Is my data safe?</h3>
      <p>Yes, we use secure authentication and never share your information.</p>
    </div>
  );
};

export default FAQ; 