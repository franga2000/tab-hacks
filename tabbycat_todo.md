# Tabbycat TODO

## Bugs

- Ballot edit goes to old form, but switching between versions goes to new one
- Intermediate 1/2 draw generation errors don't properly explain the issue (which teams fell through and what needs to be done about it)
	+ it should also be possible to override the error
- Personal links "view ballot" doesn't always show the viewing judge's ballot (in case of multiple judges)
- Can't submit a judge with `institution=None` via API
- Ballot status chart doesn't show confirmed ballots (maybe only when using split ballots and merging?)
- Copy as CSV button doesn't work

## Wishlist

- Editing preallocated sides form frontend
	+ Option to copy sides from another round
	+ Option to reverse sides
- API for side allocations
- Show team's previous sides on draw editing screen
- Release draw to the public without releasing judge allocation
- Clear cache immediately when certain changes are made (like motion/draw/results release)
- Clear All button on check-in status screen
- Diversity overview:
	+ Only color Regions that have members
	+ Option to hide Regions with no members
	+ Maybe a few more colors
