Feature: Game Match

Rule: A match will decide a winner based on the option player and npc picked
 Scenario Outline: player pick a different option than npc
    Given I pick "<my_pick>"
    And NPC (server) pick "<npc_pick>"
    And The game decide that "<winner>" should win the game
    When The match is on
    Then The winner should be "<winner>"
    Examples:
    | my_pick | npc_pick | winner |
    | rock    | paper    | npc    |
    | rock    | scissor  | player |
