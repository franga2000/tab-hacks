from participants.models import *
from draw.models import *
from tournaments.models import *

SEQ_FROM = 1
SEQ_TO = 3

TOURNAMENT_SLUG = 'idtl-22-div2'

OPPOSITE = {
    DebateTeam.SIDE_AFF: DebateTeam.SIDE_NEG,
    DebateTeam.SIDE_NEG: DebateTeam.SIDE_AFF,
}


round_to = Round.objects.get(tournament__slug=TOURNAMENT_SLUG, seq=SEQ_TO)

print(round)

for team in Team.objects.filter(tournament__slug=TOURNAMENT_SLUG):
    dts = team.debateteam_set.filter(debate__round__seq=SEQ_FROM)
    if not dts:
        continue
    new_side = OPPOSITE[dts[0].side]
    print(team.short_name, dts[0].side, "->", new_side)
    team.teamsideallocation_set.create(round=round_to, side=new_side)
