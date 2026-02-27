# Landing Page Claim Sources

Reference document for every factual claim made on the ZKyNet landing page, with verification status and source links.

Last updated: 2026-02-25

---

## 1. "224 votes" — ProtonVPN simultaneous multi-tunnel request

**File:** `index.html` line 442–445
**Also referenced in:** `src/about.html` line 173

**Claim:** "224 votes — ProtonVPN users requesting simultaneous multi-tunnel support. No provider has shipped it."

**Status:** Verified. Exact vote count confirmed.

**Source:**
- ProtonVPN UserVoice — "Split Tunneling: Two Different VPN Connections Simultaneously"
  https://protonmail.uservoice.com/forums/932836-proton-vpn/suggestions/47324555-split-tunneling-two-different-vpn-connections-sim

---

## 2. "Closed as not planned" — Mullvad per-domain split tunneling

**File:** `index.html` lines 449–452
**Also referenced in:** `src/about.html` line 173

**Claim:** "Closed as not planned — Mullvad's response to per-domain split tunneling requests."

**Status:** Accurate. Matches the actual GitHub issue label (`not_planned`). Mullvad's language was "not really planned," "not currently planning," and "way harder." One developer explicitly said it is "not technically impossible" but "has currently not been prioritized."

**Sources:**

- GitHub Issue #4204 — "[Feature request] Split tunneling excludes websites" (Dec 2022, closed as `not_planned`)
  Mullvad said: "We are not currently planning on extending the split tunneling functionality to work on a per domain or per URL basis."
  https://github.com/mullvad/mullvadvpn-app/issues/4204

- GitHub Issue #2071 — "Split tunneling based on domain names/IP addresses" (Sep 2020, closed Oct 2025)
  Mullvad said: "That does not mean it will never exist, just that we are currently not planning for it."
  Later (Sep 2024): "Having an option to route things outside the tunnel altogether would not be technically impossible. However, it would require some deeper integration between our app and our browser extension. This has currently not been prioritized."
  https://github.com/mullvad/mullvadvpn-app/issues/2071

- GitHub Issue #4529 — "Feature request: Per-domain split tunneling" (Apr 2023, closed Jun 2024 as duplicate of #2071)
  Mullvad said: "Doing per domain split tunneling on the entire system is way harder... We don't want to implement something that is going to work very randomly."
  https://github.com/mullvad/mullvadvpn-app/issues/4529

- Mullvad Blog — "The limitations of split tunneling" (discusses per-app split tunneling only, does not use the word "infeasible")
  https://mullvad.net/en/blog/limitations-split-tunneling

---

## 3. "Requested since 2017" — Firefox per-container tunnel routing

**File:** `index.html` lines 456–459
**Also referenced in:** `src/about.html` line 173

**Claim:** "Requested since 2017 — Firefox users asking for per-container tunnel routing. 8 years. Still not shipped."

**Status:** Accurate. First formal request filed March 2, 2017. True per-container tunnel routing with arbitrary VPN providers has never shipped. Mozilla's 2022 partial solution only works with their own VPN subscription via SOCKS5 proxies.

**Sources:**

- GitHub Issue #313 — "Allow custom proxy settings per containers" (March 2, 2017, the earliest formal request)
  https://github.com/mozilla/multi-account-containers/issues/313

- Mozilla Discourse — "Feature request: Proxy Option for each Container profile" (October 5, 2017)
  https://discourse.mozilla.org/t/feature-request-proxy-option-for-each-container-profile/20043

- GitHub Issue #2252 — "Be able to use different VPNs" (December 28, 2021, still open)
  https://github.com/mozilla/multi-account-containers/issues/2252

- GitHub Issue #2259 — "Per container split-tunneling support" (January 5, 2022, still open, no Mozilla response)
  https://github.com/mozilla/multi-account-containers/issues/2259

- GitHub Issue #2316 — "Allow containers to operate with no VPN" (March 23, 2022)
  https://github.com/mozilla/multi-account-containers/issues/2316

- Mozilla Blog — Multi-Account Containers + Mozilla VPN integration announcement (February 1, 2022)
  This is the partial solution: per-container VPN location switching, but only through Mozilla VPN (Mullvad infrastructure), not third-party tunnels.
  https://blog.mozilla.org/en/mozilla/multi-account-containers-add-on-on-mozilla-vpn/

- Mozilla Support — "Use Multi-Account Containers with Mozilla VPN"
  https://support.mozilla.org/en-US/kb/use-multi-account-containers-mozilla-vpn

- Mozilla Connect — "Disable/Enable Mozilla VPN per container" idea
  https://connect.mozilla.org/t5/ideas/disable-enable-mozilla-vpn-per-container-in-multi-account/idi-p/34269

- Proton VPN UserVoice — "Per-Container VPN Routing in Firefox/Zen" (July 2025, 9 votes)
  https://protonmail.uservoice.com/forums/932836-proton-vpn/suggestions/50257554-per-container-vpn-routing-in-firefox-zen

- Container Proxy Extension — third-party per-container proxy add-on (first version August 15, 2019, proxy-level only)
  https://addons.mozilla.org/en-US/firefox/addon/container-proxy/versions/

- Bugzilla Meta-Bug #1191418 — Contextual Identity / Containers tracking bug
  https://bugzilla.mozilla.org/show_bug.cgi?id=1191418

**Earlier informal requests (pre-2017):**

- gHacks article comments — commenter asked for "per-identity proxies" (September 1, 2015)
  https://www.ghacks.net/2015/09/01/mozilla-plans-to-add-contextual-identities-to-firefox/

- Mozilla Blog — Tanvi Vyas post on containers, commenter requested per-container proxy settings (June 2016)
  https://blog.mozilla.org/tanvi/2016/06/16/contextual-identities-on-the-web/

---

## 4. "One tunnel at a time" — WireGuard Windows client limitation

**File:** `index.html` lines 463–466

**Claim:** "One tunnel at a time — The WireGuard official client on Windows. Activate a second, the first deactivates."

**Status:** Accurate for standard VPN use. Since August 2021 (commit 9f92a337), WireGuard allows non-overlapping tunnels to coexist. But standard VPN configs use `AllowedIPs = 0.0.0.0/0` which always overlaps with any other tunnel, so for typical VPN users activating a second tunnel still deactivates the first.

**Sources:**

- WireGuard commit 9f92a337 — "make multiple tunnels mode automatic" (August 13, 2021)
  Changed from unconditionally stopping all tunnels to only stopping tunnels with overlapping routes/IPs.
  https://git.zx2c4.com/wireguard-windows/commit/conf?h=v0.4.10&id=9f92a337376794baaff9b7e60e715a0f102549ba

- WireGuard adminregistry.md (older version) — documented the `MultipleSimultaneousTunnels` registry key that defaulted to false
  https://github.com/WireGuard/wireguard-windows/blob/8afe1a3eec6022d4e7328b22ee8cd8f8df1c1075/docs/adminregistry.md

- WireGuard adminregistry.md (current master) — `MultipleSimultaneousTunnels` key removed, intersection-based behavior is now default
  https://github.com/WireGuard/wireguard-windows/blob/master/docs/adminregistry.md

- WireGuard ipc_server.go (current master) — source code showing `IntersectsWith` check
  https://github.com/WireGuard/wireguard-windows/blob/master/manager/ipc_server.go

- WireGuard Quick Start — documents `AllowedIPs = 0.0.0.0/0` as standard full-tunnel VPN config
  https://www.wireguard.com/quickstart/

- Rair Dev — "WireGuard Windows Multiple Simultaneous Tunnels" (explains the limitation)
  https://rair.dev/wireguard-windows-multiple-simultaneous-tunnels/

- DeepWiki — WireGuard Windows Tunnel Management (code analysis of intersection checking)
  https://deepwiki.com/WireGuard/wireguard-windows/3.1-tunnel-management

- AmneziaWG Issue #7 — confirms the limitation in forked WireGuard client
  https://github.com/amnezia-vpn/amneziawg-windows-client/issues/7

- TunnlTo — third-party WireGuard client built specifically to address this limitation
  https://github.com/TunnlTo/desktop-app

---

## 5. "Established, audited protocols" — WireGuard + OpenVPN

**File:** `index.html` line 557
**Also referenced in:** `src/about.html` line 235 ("well-audited, widely trusted protocols")

**Claim:** WireGuard and OpenVPN are "established, audited protocols."

**Status:** Accurate for OpenVPN (two formal third-party code audits). Overstated for WireGuard (extensive formal verification of the protocol, but no published third-party implementation code audit).

### OpenVPN audit sources:

- OSTIF / QuarksLab + Cryptography Engineering audit (2017)
  Scope: OpenVPN 2.4.0 including NDIS6 TAP driver and Windows GUI. 50 person-days by 3 engineers.
  Findings: 1 Critical (CVE-2017-7478), 1 Medium (CVE-2017-7479), 5 Low. All fixed in OpenVPN 2.4.2.
  Full report PDF: https://ostif.org/wp-content/uploads/2017/05/OpenVPN1.2final.pdf
  Announcement: https://ostif.org/the-openvpn-2-4-0-audit-by-ostif-and-quarkslab-results/

- Trail of Bits audit (2022–2023)
  Scope: OpenVPN2 codebase — memory safety, fuzzing, authentication, cryptography, build systems.
  Findings: No significant flaws impacting confidentiality, integrity, or availability.
  Full report PDF: https://github.com/trailofbits/publications/blob/master/reviews/2022-12-openvpn-openvpn2-securityreview.pdf
  Announcement: https://blog.openvpn.net/trail-of-bits/

- Bleeping Computer coverage of Matthew Green's involvement in the 2017 audit:
  https://www.bleepingcomputer.com/news/security/cryptography-expert-matthew-green-to-audit-openvpn-security/

### WireGuard formal verification sources (protocol-level, not implementation code audit):

- WireGuard Formal Verification page (lists all proofs)
  https://www.wireguard.com/formal-verification/

- Tamarin symbolic verification paper — proves authentication, key agreement, forward secrecy, identity hiding
  https://www.wireguard.com/papers/wireguard-formal-verification.pdf

- INRIA CryptoVerif computational proof — machine-checked proof of entire WireGuard protocol
  https://inria.hal.science/hal-02100345v3/document

- Dowling-Paterson computational cryptographic analysis
  https://www.wireguard.com/papers/dowling-paterson-computational-2018.pdf

- MIT security analysis (student project, 6.857 course)
  https://courses.csail.mit.edu/6.857/2018/project/He-Xu-Xu-WireGuard.pdf

---

## 6. Tailscale analogy

**File:** `src/about.html` lines 195–196

**Claim:** "The same way Tailscale made mesh networking usable without manual WireGuard configuration, ZKyNet makes multi-tunnel routing usable without iptables knowledge."

**Status:** Accurate. Tailscale uses WireGuard under the hood (specifically wireguard-go) and is widely described as making mesh networking accessible. Fair analogy.

---

## 7. "Federally incorporated under PIPEDA" — Canadian company

**File:** `index.html` line 567
**Also referenced in:** `src/about.html` line 241, `src/legal/terms.html` line 88, `src/legal/privacy.html`

**Claim:** ZKyNet is operated by 17204671 Canada Inc., federally incorporated in Canada under PIPEDA.

**Status:** Internal company fact. Verify against your federal incorporation certificate. PIPEDA (Personal Information Protection and Electronic Documents Act) applies to all federally incorporated Canadian companies handling personal information in commercial activities, so the PIPEDA reference is accurate if the incorporation is valid.
