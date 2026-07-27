"use server";

/**
 * Server action that forwards a form entry to the CMS.
 *
 * Runs on the server on purpose: `CMS_API_URL` stays private (the browser
 * never learns where the CMS lives, and the CMS needn't be publicly
 * reachable), and the origin the CMS sees is this server rather than a
 * visitor's browser — so a form's access policy can't be tripped by an
 * unexpected Origin header.
 */

const CMS_API_URL = (
    process.env.CMS_API_URL ?? "http://localhost:3000/api"
).replace(/\/+$/, "");

const TIMEOUT_MS = 10000;

export type SubmitResult = { ok: true } | { ok: false; error: string };

export async function submitEntry(
    slug: string,
    data: Record<string, unknown>,
): Promise<SubmitResult> {
    try {
        const res = await fetch(`${CMS_API_URL}/submissions/${slug}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // The CMS validates `data` against the form's declared fields and
            // rejects anything undeclared, so the payload is wrapped.
            body: JSON.stringify({ data }),
            signal: AbortSignal.timeout(TIMEOUT_MS),
            cache: "no-store",
        });

        if (res.ok) return { ok: true };

        // Surface the CMS's own validation message when it gave one.
        const body = (await res.json().catch(() => null)) as
            | { message?: string | string[] }
            | null;
        const message = Array.isArray(body?.message)
            ? body.message.join(", ")
            : body?.message;
        return {
            ok: false,
            error: message || `Submission failed (${res.status}).`,
        };
    } catch {
        return {
            ok: false,
            error: "Could not reach the server. Please try again.",
        };
    }
}
