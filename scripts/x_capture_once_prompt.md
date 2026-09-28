You are running the X For You capture job for rereresearch.

Execution constraints:
- Use only Computer Use tools for browser interaction: get_app_state, click, set_value, type_text, press_key, scroll.
- Do not use Browser Use, Playwright, agent.browser, node browser runtimes, web search, Chronicle, SKILL.md files, or Codex skills.
- Do not inspect tool reference files, AGENTS.md, package.json, scripts, logs, or previous raw files. This prompt contains the full procedure.
- Do not use a different browser backend. The target browser is the existing Firefox app.
- If Computer Use is unavailable, save an error raw JSON immediately and exit.
- After saving the raw JSON, exit immediately. Do not generate summaries, highlights, or follow-up analysis.

Goal:
- Use Computer Use with Firefox.
- Capture X account hint @maypdgj at https://x.com/home.
- Timeline: For You / おすすめ.
- Save raw JSON only under raw/x_maypdgj_for_you_*.json.
- Do not generate highlights.
- Do not run npm run highlights.

Hard requirements:
- Treat this as a single fast capture cycle only, then exit.
- Confirm Firefox is on x.com/home and the おすすめ tab is selected.
- Use Computer Use screenshots and accessibility tree.
- Only save posts related to at least one of these domains: IT, software engineering, developer tools, infrastructure, security, AI, machine learning, LLMs, local AI hardware, research workflows, startup/business, product strategy, creator/business revenue, markets, finance, or investing.
- Do not save posts that are unrelated to IT / investing / AI / business, even if they are popular or visible.
- Ads/promoted posts are excluded unless the product or content is directly related to IT, AI, developer tools, business, finance, or investing.
- For excluded posts, do not include them in `posts`; instead record counts and short reasons in `filtered_out_count` and `filtered_out_examples` if useful.
- Record `relevance_filter: "it_investing_ai_business"` and `relevant_posts_after_filter` in the raw JSON.
- If a numeric new-post button such as "35 件のポストを表示" is present, record it.
- For the numeric new-post button, click the exact Computer Use accessibility `ボタン` element whose label matches `/^[0-9,]+ 件のポストを表示$/` using the Computer Use `click` tool with `element_index`.
- Do not use `perform_secondary_action` for this button. It is not a click and has been observed to fail on X.
- If the matching button has a text child, click the parent `ボタン` element index, not the child text index.
- Use coordinate click only if that exact accessibility button is not exposed. Coordinate fallback must click the center of the visible numeric button, not the first post body.
- Do not run multiple Computer Use clicks in parallel. Click one target, wait at least 1 second, re-check the screenshot/accessibility tree, then decide the next click.
- After any click, wait at least 5 seconds and recheck.
- Set click_effective true only if all of these are true: the top status URL changed, the numeric new-post button is absent in 2 consecutive rechecks, and the screenshot visibly shows different timeline content.
- If the URL changes from `x.com/home` to a status URL after clicking the new-post button, the click failed. Immediately return to `https://x.com/home`, set `click_effective: false`, and do not retry coordinate click in that cycle.
- Run 3 to 5 PageDown passes inside the cycle, with about 1 second between passes.
- If the cycle is slow, do at least 3 PageDown passes before saving.
- Use the Computer Use scroll API only as a fallback if PageDown does not move the visible Firefox screenshot.
- For each visible post, if its body contains a blue "さらに表示" expansion control, click only that post's "さらに表示" control, wait about 1 second, recheck the same viewport, and record the expanded text.
- Treat "さらに表示" clicks as read-only expansion clicks. Do not click reply, repost, like, bookmark, share, follow, media load buttons, ads, external links, or status links.
- Do not run multiple "さらに表示" clicks in parallel.
- If multiple "さらに表示" controls are visible, expand at most 3 per viewport to keep the cycle fast, prioritizing only relevant posts that mention AI, coding tools, models, developer tooling, research, infrastructure, finance, investing, startups, business, or product strategy.
- Record `expanded_more_count` in the raw JSON. If a post still appears truncated after expansion, set `text_truncated: true` on that post.
- Deduplicate posts by status URL.
- Record scroll_passes, unique_posts_after_scroll, stopped_reason, click_method, click_effective, and complete.
- For this scheduled fast job, fewer than 10 unique posts is acceptable; use status "partial_capture" and complete false.
- Save one JSON file named raw/x_maypdgj_for_you_partial_YYYYMMDD-HHMMSS-JST.json, raw/x_maypdgj_for_you_nonew_YYYYMMDD-HHMMSS-JST.json, or raw/x_maypdgj_for_you_error_YYYYMMDD-HHMMSS-JST.json as appropriate.
- Do not modify highlights or reports.
- Do not send messages, post, like, follow, or change X account state.
