"use client";

import React from "react";

/**
 * Renders a single snippet, optionally turning snippet_links into anchors.
 * Links are applied by replacing link.text with <a> in the snippet.
 */
function SnippetWithLinks({ snippet, snippet_links }) {
    if (!snippet) return null;

    const links = Array.isArray(snippet_links) ? snippet_links : [];
    if (links.length === 0) {
        return <>{snippet}</>;
    }

    // Build segments: split by link texts and insert <a> for each
    const parts = [];
    let remaining = snippet;

    // for (const link of links) {
    //     const text = link?.text;
    //     const href = link?.link;
    //     if (!text || typeof text !== "string") continue;

    //     const idx = remaining.indexOf(text);
    //     if (idx === -1) continue;

    //     if (idx > 0) {
    //         parts.push({ type: "text", value: remaining.slice(0, idx) });
    //     }
    //     parts.push({
    //         type: "link",
    //         value: text,
    //         href: href && (href.startsWith("http") ? href : `https://${href}`),
    //     });
    //     remaining = remaining.slice(idx + text.length);
    // }

    if (remaining) {
        parts.push({ type: "text", value: remaining });
    }

    return (
        <>
            {parts.map((seg, i) =>
                seg.type === "link" ? (
                    <a
                        key={i}
                        href={seg.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                    >
                        {seg.value}
                    </a>
                ) : (
                    <span key={i}>{seg.value}</span>
                )
            )}
        </>
    );
}

/**
 * Renders a list item (snippet, optional snippet_links, optional nested list).
 */
function ListItem({ item, depth = 0 }) {
    const nested = Array.isArray(item?.list) ? item.list : [];
    const hasNested = nested.length > 0;

    return (
        <li className={depth > 0 ? "ms-3 mt-1" : ""}>
            <SnippetWithLinks
                snippet={item?.snippet}
                snippet_links={item?.snippet_links}
            />
            {hasNested && (
                <ul className="list-unstyled mb-1 mt-1">
                    {nested.map((sub, j) => (
                        <ListItem key={j} item={sub} depth={depth + 1} />
                    ))}
                </ul>
            )}
        </li>
    );
}

/**
 * Renders one block from text_blocks (paragraph, heading, or list).
 */
function TextBlock({ block }) {
    const type = block?.type;
    const snippet = block?.snippet;

    if (type === "heading") {
        return (
            <h4 className="serp-ai-heading mt-4 mb-2 fw-semibold">
                {snippet}
            </h4>
        );
    }

    if (type === "paragraph") {
        return (
            <p className="serp-ai-paragraph mb-3 text-secondary">
                <SnippetWithLinks
                    snippet={snippet}
                    snippet_links={block?.snippet_links}
                />
            </p>
        );
    }

    if (type === "list" && Array.isArray(block?.list)) {
        return (
            <ul className="serp-ai-list list-unstyled mb-3">
                {block.list.map((item, i) => (
                    <ListItem key={i} item={item} />
                ))}
            </ul>
        );
    }

    return null;
}

/**
 * Renders SerpAI modal API response: text_blocks, optional references, related_questions.
 * @param {Object} data - API response: { text_blocks, raw?: { references, related_questions } }
 */
export default function SerpAiModalContent({ data }) {
    const textBlocks = data?.text_blocks;
    const raw = data?.raw ?? data;
    const references = raw?.references;
    const relatedQuestions = raw?.related_questions;

    const hasBlocks = Array.isArray(textBlocks) && textBlocks.length > 0;
    const hasRefs = Array.isArray(references) && references.length > 0;
    const hasQuestions =
        Array.isArray(relatedQuestions) && relatedQuestions.length > 0;

    if (!hasBlocks && !hasRefs && !hasQuestions) {
        return null;
    }

    return (
        <div className="serp-ai-modal-content">
            {hasBlocks && (
                <div className="serp-ai-text-blocks">
                    {textBlocks.map((block, index) => (
                        <TextBlock key={index} block={block} />
                    ))}
                </div>
            )}

            {hasRefs && (
                <div className="serp-ai-references mt-4 pt-3 border-top">
                    <h5 className="serp-ai-heading small fw-semibold mb-2">
                        Sources
                    </h5>
                    <ul className="list-unstyled small text-secondary">
                        {references.slice(0, 8).map((ref, i) => (
                            <li key={i} className="mb-1">
                                {/* <a
                                    href={ref?.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-decoration-none text-secondary"
                                > */}
                                    {ref?.title ?? ref?.link}
                                {/* </a> */}
                                {ref?.source && (
                                    <span className="text-muted ms-1">
                                        — {ref.source}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
