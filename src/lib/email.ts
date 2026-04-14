import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContinueSessionEmail({
  to,
  sessionTitle,
  sessionId,
  appUrl,
}: {
  to: string;
  sessionTitle: string;
  sessionId: string;
  appUrl: string;
}) {
  const resumeUrl = `${appUrl}/app/session/${sessionId}`;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@focussteps.app",
      to,
      subject: `Ready to continue? "${sessionTitle}" is waiting`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #f9fafb;">
          <div style="background: white; border-radius: 12px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 8px;">
              Ready to pick up where you left off?
            </h1>
            <p style="color: #6b7280; margin: 0 0 24px; font-size: 16px;">
              Your task "<strong style="color: #111827;">${sessionTitle}</strong>" is still waiting. You've already done the hard part — starting. Pick one tiny step and keep going.
            </p>
            <a href="${resumeUrl}" style="display: inline-block; background: #7c3aed; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              Continue My Task →
            </a>
            <p style="margin: 24px 0 0; color: #9ca3af; font-size: 14px;">
              No pressure. Even finishing one more step counts.
            </p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}
