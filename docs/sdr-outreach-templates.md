# SDR outreach templates (hot + warm): send these yourself

These are for **you** to personalize and send by hand (or paste into HubSpot
sequences you control). Hot and warm leads are never emailed by the automated
nurture engine on purpose: a strong lead deserves a human, not a robot.

Reference, not automation:
- **Hot** = green band (readiness score 70+). Call first, then send if you miss them.
- **Warm** = yellow band (45–69). A short, personal note plus a call works best.
- Cold (red, under 45) is handled by automation (see `lib/nurtureEmails.ts` cold
  track + the cold-lead triage in `app/api/nurture/run/route.ts`).

Keep it plain, no em-dashes, no guarantees. Always: "you may qualify, approval
depends on underwriting." Swap `{{first}}` and your booking link in.

---

## HOT (call-first; these back up the call)

**1. Right after you connect or try to**
Subject: You look like a strong fit. Let's talk.
> Hi {{first}}, based on what you shared, your business looks like a strong fit
> for funding. The fastest way to see real numbers is a quick call: I read your
> deposits and bank activity, walk you through your options, and you decide if it
> makes sense. No pressure and no obligation. Here is my calendar: {{calLink}}

**2. Next day, if no reply**
Subject: Let's not leave cash sitting on the table
> Hi {{first}}, I do not want you stuck waiting on money that could already be
> working for you. The owners who set capital up ahead of time keep moving when a
> slow week hits. The ones who wait usually pay for it twice. Grab a few minutes
> before your next tight week: {{calLink}}

**3. A few days later, last personal nudge**
Subject: Want me to pull your options?
> Hi {{first}}, your file is ready. I just need about 15 minutes to walk you
> through what you may qualify for. If now is not the time, tell me when. If it
> is, grab a slot: {{calLink}}

---

## WARM (a personal note + an easy call)

**1. Set expectations**
Subject: Here is what happens next
> Hi {{first}}, thanks for starting your funding check. Here is what happens next.
> I look at your business revenue, recent bank activity, and time in business,
> then walk you through the options that fit. It is a quick conversation, not a
> long application. Want to skip ahead? Grab a time: {{calLink}}

**2. Take the pressure off credit**
Subject: We read your deposits, not just your credit
> Hi {{first}}, a lot of owners hold back because they think their credit will
> sink them. That is not how this works. The review leans on your deposits and
> bank activity. Steady money coming in matters more than a perfect score, and a
> rough stretch does not erase a business that is still taking money in. If that
> sounds like you, let's talk: {{calLink}}

**3. Lower the friction**
Subject: A 15-minute call beats a long form
> Hi {{first}}, if you would rather just talk it through, I get it. Tell me what
> the money is for, and I will tell you what may fit and what the payback looks
> like. You decide from there. No obligation. Pick a time: {{calLink}}

**4. Soft close**
Subject: Still here when you are ready
> Hi {{first}}, if the timing is not right yet, that is fine. Funding works best
> when you set it up before you need it, not in the middle of a crunch. When you
> are ready, I am one call away and your answers are saved. Book whenever it
> suits you: {{calLink}}
