# Tabbycat TODO

## Bugs

- ~~Critical crash when ell emojis are used~~
	+ ~~Because the emoji allocator considers all used emojis, not just in the current tournament, this happens with many archived tournaments~~
- When using password ballots, trainees are shown on the public page, but then taken to the chair's ballot
- Info slide display (for projection) isn't auto-sized like the motion is
- Sorting on draw page doesn't work (very dangerous when sorted by rank!)
- Draw display prevents page orientation change when printing
- Ballot edit goes to old form, but switching between versions goes to new one
- Intermediate 1/2 draw generation errors don't properly explain the issue (which teams fell through and what needs to be done about it)
	+ it should also be possible to override the error
- Personal links "view ballot" doesn't always show the viewing judge's ballot (in case of multiple judges)
- Can't submit a judge with `institution=None` via API
- Ballot status chart doesn't show confirmed ballots (maybe only when using split ballots and merging?)
- Doing something in the drag&drop editor (like side confirmation) and immediately pressing Back (or the back arrow) doesn't save the changes
- Judges are assigned to bye debates when auto assigning
- ~~Copy as CSV button doesn't work~~

## Wishlist

- Bulk admin actions for
        + Set tournament inactive
- Make sorting tournaments easier 
- Editing preallocated sides form frontend
	+ Option to copy sides from another round
	+ Option to reverse sides
- API for side allocations
- API for checkins
- Adj-Team clash entry: search by speaker name
- On the break elegibility screen, show the number of speakers next to the number of speakers in a category (e.g. ESL Speakers: 2/4)
	+ maybe additionally mark those where all are in a category 
- Show team's previous sides on draw editing screen
- Release draw to the public without releasing judge allocation
- Clear cache immediately when certain changes are made (like motion/draw/results release)
- Clear All button on check-in status screen
- Diversity overview:
	+ Only color Regions that have members
	+ Option to hide Regions with no members
	+ Maybe a few more colors
- Optionally require a secret code to check in (useful for online tournaments - you share the code in the main call, so people can't check in without being present)
- Ability to export participant data including identifiers
- Editing room priority on admin listing page
- Timezone display is ambiguous (e.g. "debates start at 09:25 (in Australia/Melbourne)")
- Full institution name tooltip when hovering on short name (e.g. check-in status page)
- Show all feedback on one page (equity wants to read through all of it)

# Look into
 - is it possible to disable the default question in feedback? 
