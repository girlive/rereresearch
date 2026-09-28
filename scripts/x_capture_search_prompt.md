You are running the X Search capture job for rereresearch.

Execution constraints:
- Use only Computer Use tools for browser interaction: get_app_state, click, set_value, type_text, press_key, scroll.
- Do not use Browser Use, Playwright, agent.browser, node browser runtimes, web search, Chronicle, SKILL.md files, or Codex skills.
- Do not inspect tool reference files.
- Do not use a different browser backend. The target browser is the existing Firefox app.
- If Computer Use is unavailable, save an error raw JSON immediately.

Goal:
- Use Computer Use with Firefox.
- Capture X account hint @maypdgj.
- Mode: search.
- Search query and limit are provided in the "Runtime mode context" at the end of this prompt.
- Save raw JSON only under raw/x_maypdgj_search_<query_slug>_*.json.
- Do not generate highlights.
- Do not run npm run highlights.

Hard requirements:
- Treat this as a single fast capture cycle only, then exit.
- Confirm Firefox is on X and the signed-in account hint @maypdgj is visible if available.
- Navigate to X search using the X search UI, not the browser URL bar:
  - Do not type `x.com/search?...` or any search URL into Firefox's address bar.
  - Use the visible X search field labeled 検索 / 検索クエリ, or the left-nav search entry if needed.
  - Enter the raw search query text into the X search field and press Return.
  - After results load, select or confirm the Top / 話題 / 上位 tab. Do not use Latest / 最新.
- Use Computer Use screenshots and accessibility tree.
- Collect the top N unique posts where N is search_limit.
- Deduplicate posts by normalized status URL.
- Only save posts related to at least one of these domains: IT, software engineering, developer tools, infrastructure, security, AI, machine learning, LLMs, local AI hardware, research workflows, startup/business, product strategy, creator/business revenue, markets, finance, or investing.
- Do not save posts that are unrelated to IT / investing / AI / business, even if they match the search term incidentally.
- Ads/promoted posts are excluded unless the product or content is directly related to IT, AI, developer tools, business, finance, or investing.
- For excluded posts, do not include them in `posts`; instead record counts and short reasons in `filtered_out_count` and `filtered_out_examples` if useful.
- Extract at minimum: status_url, author, handle if visible, timestamp if visible, text if visible, metrics if visible, and whether the result is promoted/ad if visible.
- Use Firefox PageDown between result pages, with about 1 second between passes.
- Stop when either N unique posts are captured, 8 PageDown passes have run, or 2 consecutive passes add no new status URLs.
- Do not click like, repost, follow, reply, post, subscribe, or change X account state.
- Do not click into individual posts unless needed to recover a status URL; prefer links from the accessibility tree.
- If search navigation fails or no results are visible, save an error raw JSON.

Raw JSON requirements:
- Save one JSON file named:
  - raw/x_maypdgj_search_<query_slug>_YYYYMMDD-HHMMSS-JST.json, or
  - raw/x_maypdgj_search_<query_slug>_partial_YYYYMMDD-HHMMSS-JST.json, or
  - raw/x_maypdgj_search_<query_slug>_error_YYYYMMDD-HHMMSS-JST.json
- query_slug must be lowercase ASCII, with non-alphanumeric runs replaced by `_`, trimmed to 48 characters. If empty, use `query`.
- Include these top-level fields:
  - job: "x_maypdgj_search"
  - mode: "search"
  - account_hint: "@maypdgj"
  - search_query
  - search_limit
  - url
  - result_mode: "top"
  - captured_at
  - status: "ok" | "partial_capture" | "error"
  - complete
  - scroll_passes
  - unique_posts_after_scroll
  - stopped_reason
  - relevance_filter: "it_investing_ai_business"
  - relevant_posts_after_filter
  - filtered_out_count
  - observed_status_urls
  - posts
  - raw_observation_notes
- raw_observation_notes must explicitly say that the query was entered into the X search field, not through the browser URL bar.
- Use status "ok" and complete true only if at least search_limit unique posts are captured.
- Use status "partial_capture" and complete false if fewer than search_limit posts are captured but at least one post is captured.
- Use status "error" and complete false if no posts are captured or navigation fails.
